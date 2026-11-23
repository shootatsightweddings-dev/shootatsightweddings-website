const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Throwaway upload folder; conversion switched off unless a test enables it.
const DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'chunked-uploads-'));
process.env.VIDEO_UPLOAD_DIR = DIR;
const express = require('express');
const videos = require('../src/services/videoProcessing');
const uploads = require('../src/services/chunkedUploads');
const ctl = require('../src/controllers/chunkedUploadController');

let server; let api; let client;
const MB = 1024 * 1024;
const noWait = async () => {};

before(async () => {
  videos._test.setAvailable(false);
  const app = express();
  app.use(express.json());
  // Same handlers as the real routes, without the admin login check.
  app.post('/api/videos/uploads', ctl.startUpload);
  app.get('/api/videos/uploads/:id', ctl.uploadStatus);
  app.put('/api/videos/uploads/:id', ctl.uploadChunk);
  app.post('/api/videos/uploads/:id/complete', ctl.completeUpload);
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  api = `http://127.0.0.1:${server.address().port}/api`;
  client = await import('../../frontend/src/utils/chunkedUpload.js');
});
after(() => { server.close(); fs.rmSync(DIR, { recursive: true, force: true }); });

const makeFile = (bytes, type = 'video/mp4', name = 'film.mp4') => {
  const data = crypto.randomBytes(bytes);
  return { data, file: new File([data], name, { type, lastModified: bytes }) };
};
const memoryStorage = () => { const m = new Map(); return { get: (k) => m.get(k) ?? null, set: (k, v) => m.set(k, v), remove: (k) => m.delete(k), m }; };
const saved = (url) => fs.readFileSync(path.join(DIR, path.basename(url)));

test('a 40 MB video arrives in 16 MB pieces and is byte-identical', async () => {
  const { data, file } = makeFile(40 * MB);
  const progress = [];
  let puts = 0;
  const res = await client.uploadVideoInPieces(file, {
    apiUrl: api, token: 't', storage: memoryStorage(), sleep: noWait,
    onProgress: (p) => progress.push(p),
    fetchImpl: (url, init) => { if (init?.method === 'PUT') puts++; return fetch(url, init); },
  });
  assert.equal(puts, 3);
  assert.equal(res.processing, false);
  assert.ok(saved(res.url).equals(data));
  assert.equal(progress.at(-1), 100);
  assert.deepEqual(fs.readdirSync(uploads.PARTIAL_DIR).filter((f) => f.endsWith('.part')), [], 'no partial data left behind');
});

test('a lost reply on the final step is retried and never re-uploads the video', async () => {
  const { data, file } = makeFile(20 * MB);
  const storage = memoryStorage();
  let completes = 0;
  let puts = 0;
  const res = await client.uploadVideoInPieces(file, {
    apiUrl: api, token: 't', storage, sleep: noWait,
    fetchImpl: async (url, init) => {
      if (init?.method === 'PUT') puts++;
      const r = await fetch(url, init);
      if (url.endsWith('/complete') && ++completes === 1) throw new TypeError('reply lost');
      return r;
    },
  });
  assert.equal(completes, 2);
  assert.equal(puts, 2);
  assert.ok(saved(res.url).equals(data));
  assert.equal(storage.m.size, 0);
});

test('if the final step never got confirmed, picking the file again finishes it without re-uploading', async () => {
  const { data, file } = makeFile(18 * MB);
  const storage = memoryStorage();
  await assert.rejects(client.uploadVideoInPieces(file, {
    apiUrl: api, token: 't', storage, sleep: noWait,
    fetchImpl: async (url, init) => {
      const r = await fetch(url, init);
      if (url.endsWith('/complete')) throw new TypeError('offline');
      return r;
    },
  }), /will not re-upload/);
  assert.equal(storage.m.size, 1, 'upload remembered');

  let calls = 0;
  const res = await client.uploadVideoInPieces(file, {
    apiUrl: api, token: 't', storage, sleep: noWait,
    fetchImpl: (url, init) => { calls++; return fetch(url, init); },
  });
  assert.equal(calls, 1, 'one status check, nothing re-sent');
  assert.ok(saved(res.url).equals(data));
  assert.equal(storage.m.size, 0);
});

test('a network blip while resuming keeps the earlier upload instead of starting over', async () => {
  const { file } = makeFile(20 * MB);
  const storage = memoryStorage();
  const { id } = uploads.start({ filename: file.name, size: file.size, type: file.type });
  storage.set(`video-upload:${file.name}:${file.size}:${file.lastModified}`, id);
  await assert.rejects(client.uploadVideoInPieces(file, {
    apiUrl: api, token: 't', storage, sleep: noWait,
    fetchImpl: () => Promise.reject(new TypeError('offline')),
  }), /Could not reach the server/);
  assert.equal([...storage.m.values()][0], id);
});

test('a .mov with no file type (some Windows PCs) is accepted by its extension', () => {
  const { id } = uploads.start({ filename: 'Wedding Film.MOV', size: 10, type: '' });
  assert.match(id, /^[0-9a-f-]{36}$/);
  assert.throws(() => uploads.start({ filename: 'notes.txt', size: 10, type: '' }), /Only MP4/);
});

test('an upload is refused up front if the server disk is too full', async () => {
  uploads._test.setFreeSpace(() => 5 * 1024 * MB);
  try {
    const r = await fetch(`${api}/videos/uploads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: 'big.mp4', size: 3 * 1024 * MB, type: 'video/mp4' }) });
    assert.equal(r.status, 507);
    assert.match((await r.json()).message, /disk space/);
  } finally {
    uploads._test.setFreeSpace((dir) => { try { const s = fs.statfsSync(dir); return s.bavail * s.bsize; } catch { return Infinity; } });
  }
});

test('dropped connections are retried and the upload completes', async () => {
  const { data, file } = makeFile(35 * MB);
  let puts = 0;
  const res = await client.uploadVideoInPieces(file, {
    apiUrl: api, token: 't', storage: memoryStorage(), sleep: noWait,
    fetchImpl: (url, init) => {
      if (init?.method === 'PUT' && ++puts % 2 === 0) return Promise.reject(new TypeError('network down'));
      return fetch(url, init);
    },
  });
  assert.ok(saved(res.url).equals(data));
});

test('a piece that arrived but whose reply was lost is not sent twice', async () => {
  const { data, file } = makeFile(33 * MB);
  let first = true;
  const res = await client.uploadVideoInPieces(file, {
    apiUrl: api, token: 't', storage: memoryStorage(), sleep: noWait,
    fetchImpl: async (url, init) => {
      const r = await fetch(url, init);
      if (init?.method === 'PUT' && first) { first = false; throw new TypeError('reply lost'); }
      return r;
    },
  });
  assert.ok(saved(res.url).equals(data));
});

test('closing the browser mid-upload and picking the same file again resumes, not restarts', async () => {
  const { data, file } = makeFile(40 * MB);
  const storage = memoryStorage();
  let puts = 0;
  await assert.rejects(client.uploadVideoInPieces(file, {
    apiUrl: api, token: 't', storage, sleep: noWait,
    fetchImpl: (url, init) => {
      if (init?.method === 'PUT' && ++puts > 1) return Promise.reject(new TypeError('offline'));
      return fetch(url, init);
    },
  }), /keeps dropping/);
  const id = [...storage.m.values()][0];
  assert.equal(uploads.status(id).received, 16 * MB);

  let secondRunPuts = 0;
  const res = await client.uploadVideoInPieces(file, {
    apiUrl: api, token: 't', storage, sleep: noWait,
    fetchImpl: (url, init) => { if (init?.method === 'PUT') secondRunPuts++; return fetch(url, init); },
  });
  assert.equal(secondRunPuts, 2, 'only the remaining 24 MB is sent');
  assert.ok(saved(res.url).equals(data));
  assert.equal(storage.m.size, 0);
});

test('the server rejects bad input clearly', async () => {
  const post = (body) => fetch(`${api}/videos/uploads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  assert.equal((await post({ filename: 'x.txt', size: 10, type: 'text/plain' })).status, 400);
  assert.equal((await post({ filename: 'huge.mp4', size: 11 * 1024 * MB, type: 'video/mp4' })).status, 413);

  const { id } = await (await post({ filename: 'a.mp4', size: 100, type: 'video/mp4' })).json();
  const put = (offset, bytes) => fetch(`${api}/videos/uploads/${id}?offset=${offset}`, { method: 'PUT', headers: { 'Content-Type': 'application/octet-stream' }, body: Buffer.alloc(bytes) });
  const wrongOffset = await put(50, 10);
  assert.equal(wrongOffset.status, 409);
  assert.equal((await wrongOffset.json()).received, 0);
  assert.equal((await put(0, 101)).status, 400, 'past the end of the file');
  assert.equal((await fetch(`${api}/videos/uploads/${id}/complete`, { method: 'POST' })).status, 409, 'not finished');
  assert.equal((await fetch(`${api}/videos/uploads/00000000-0000-4000-8000-000000000000`)).status, 404);
  assert.equal((await fetch(`${api}/videos/uploads/..%2F..%2Fetc`)).status, 404);
});

test('a piece larger than 16 MB is refused', async () => {
  const { id } = uploads.start({ filename: 'b.mp4', size: 40 * MB, type: 'video/mp4' });
  const r = await fetch(`${api}/videos/uploads/${id}?offset=0`, { method: 'PUT', headers: { 'Content-Type': 'application/octet-stream' }, body: Buffer.alloc(16 * MB + 1) });
  assert.equal(r.status, 400);
});

test('abandoned uploads are cleaned up after 24 hours', () => {
  const { id } = uploads.start({ filename: 'old.mp4', size: 10, type: 'video/mp4' });
  assert.ok(fs.existsSync(path.join(uploads.PARTIAL_DIR, `${id}.json`)));
  assert.ok(uploads.cleanupStale(Date.now() + 25 * 60 * 60 * 1000) >= 1);
  assert.ok(!fs.existsSync(path.join(uploads.PARTIAL_DIR, `${id}.json`)));
  assert.ok(!fs.existsSync(path.join(uploads.PARTIAL_DIR, `${id}.part`)));
});

test('with ffmpeg available, a finished MOV upload is queued for conversion at its .mp4 URL', async () => {
  videos._test.setAvailable(true);
  videos._test.setRunner(async (args) => fs.writeFileSync(args[args.length - 1], Buffer.alloc(1000)));
  try {
    const { file } = makeFile(2 * MB, 'video/quicktime', 'clip.mov');
    const res = await client.uploadVideoInPieces(file, { apiUrl: api, token: 't', storage: memoryStorage(), sleep: noWait });
    assert.equal(res.processing, true);
    assert.equal(res.playableNow, false);
    assert.match(res.url, /^\/uploads\/videos\/[0-9a-f-]{36}\.mp4$/);
    await videos._test.idle();
    assert.equal(fs.statSync(path.join(DIR, path.basename(res.url))).size, 1000);
  } finally {
    videos._test.setAvailable(false);
    videos._test.setRunner(null);
  }
});
