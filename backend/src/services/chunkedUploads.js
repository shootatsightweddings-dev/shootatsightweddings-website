// Resumable video uploads, sent in pieces.
//
// Large wedding films are uploaded from the admin panel in pieces of up to
// CHUNK_BYTES, each well under nginx's 50 MB per-request limit. If the
// connection drops, the browser asks how much arrived and carries on from
// there, so a 5 GB upload never restarts from zero.
//
//   1. start:    POST   /api/videos/uploads              {filename,size,type}
//   2. piece:    PUT    /api/videos/uploads/:id?offset=N  raw bytes
//   3. resume:   GET    /api/videos/uploads/:id           -> {received,size}
//   4. finish:   POST   /api/videos/uploads/:id/complete  -> {url,...}
//
// Partial files live in uploads/videos/.partial and are removed 24 hours
// after their last piece if the upload is never finished.

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { VIDEO_DIR, isAvailable, enqueue } = require('./videoProcessing');

const PARTIAL_DIR = path.join(VIDEO_DIR, '.partial');
const CHUNK_BYTES = 16 * 1024 * 1024; // 16 MB per piece
const MAX_VIDEO_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB per video
const STALE_MS = 24 * 60 * 60 * 1000;
const SPARE_BYTES = 2 * 1024 * 1024 * 1024; // always leave 2 GB free on the server
const TYPES = { 'video/mp4': '.mp4', 'video/webm': '.webm', 'video/quicktime': '.mov' };
// Some computers (e.g. Windows without QuickTime) send no type for .mov files.
const EXTENSIONS = { '.mp4': '.mp4', '.m4v': '.mp4', '.webm': '.webm', '.mov': '.mov' };
const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const busy = new Set(); // uploads currently receiving a piece

let freeSpace = (dir) => {
  try { const s = fs.statfsSync(dir); return s.bavail * s.bsize; } catch { return Infinity; }
};

const httpError = (status, message, extra = {}) => Object.assign(new Error(message), { statusCode: status, ...extra });
const metaPath = (id) => path.join(PARTIAL_DIR, `${id}.json`);
const dataPath = (id) => path.join(PARTIAL_DIR, `${id}.part`);

const readMeta = (id) => {
  if (!ID_PATTERN.test(id)) throw httpError(404, 'Unknown upload.');
  try { return JSON.parse(fs.readFileSync(metaPath(id), 'utf8')); } catch { throw httpError(404, 'Unknown or expired upload. Please start the upload again.'); }
};

const writeMeta = (id, meta) => {
  const tmp = `${metaPath(id)}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(meta));
  fs.renameSync(tmp, metaPath(id));
};

// Remove uploads abandoned for more than a day.
const cleanupStale = (now = Date.now()) => {
  let removed = 0;
  let names = [];
  try { names = fs.readdirSync(PARTIAL_DIR); } catch { return 0; }
  for (const name of names.filter((n) => n.endsWith('.json'))) {
    const id = name.slice(0, -5);
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath(id), 'utf8'));
      if (now - Date.parse(meta.updatedAt) > STALE_MS && !busy.has(id)) {
        fs.rmSync(dataPath(id), { force: true });
        fs.rmSync(metaPath(id), { force: true });
        removed++;
      }
    } catch { /* ignore unreadable entries */ }
  }
  return removed;
};

const start = ({ filename, size, type }) => {
  const ext = TYPES[type] || EXTENSIONS[path.extname(String(filename || '')).toLowerCase()];
  if (!ext) throw httpError(400, 'Only MP4, WebM or MOV videos can be uploaded.');
  const bytes = Number(size);
  if (!Number.isSafeInteger(bytes) || bytes <= 0) throw httpError(400, 'A valid file size is required.');
  if (bytes > MAX_VIDEO_BYTES) throw httpError(413, 'Videos can be up to 10 GB.');
  fs.mkdirSync(PARTIAL_DIR, { recursive: true });
  cleanupStale();
  // Room for the upload plus its web-optimised copy, with space to spare.
  if (freeSpace(PARTIAL_DIR) < bytes * 2 + SPARE_BYTES) {
    throw httpError(507, 'The server does not have enough free disk space for this video. Please contact the website team.');
  }
  const id = uuidv4();
  const now = new Date().toISOString();
  fs.writeFileSync(dataPath(id), '');
  writeMeta(id, { id, size: bytes, received: 0, ext, name: String(filename || '').slice(0, 200), createdAt: now, updatedAt: now });
  return { id, size: bytes, received: 0, chunkBytes: CHUNK_BYTES };
};

const status = (id) => {
  const meta = readMeta(id);
  if (meta.done) return { id, size: meta.size, received: meta.size, chunkBytes: CHUNK_BYTES, done: true, result: meta.result };
  return { id, size: meta.size, received: meta.received, chunkBytes: CHUNK_BYTES };
};

// Streams one piece from the request straight onto disk at its offset.
const receiveChunk = async (id, offset, req) => {
  const meta = readMeta(id);
  if (meta.done) throw httpError(409, 'This upload is already finished.', { received: meta.size });
  const at = Number(offset);
  const length = Number(req.headers['content-length']);
  if (!Number.isSafeInteger(at) || at !== meta.received) {
    // Out of step (e.g. a retry of a piece that already arrived): tell the
    // browser where to continue from.
    throw httpError(409, 'Upload is out of step; continue from the reported position.', { received: meta.received });
  }
  if (!Number.isSafeInteger(length) || length <= 0 || length > CHUNK_BYTES) throw httpError(400, `Each piece must be between 1 byte and ${CHUNK_BYTES / 1048576} MB.`);
  if (at + length > meta.size) throw httpError(400, 'Piece goes past the end of the file.');
  if (busy.has(id)) throw httpError(409, 'A piece is already being received for this upload.', { received: meta.received });

  busy.add(id);
  try {
    const written = await new Promise((resolve, reject) => {
      const out = fs.createWriteStream(dataPath(id), { flags: 'r+', start: at });
      let count = 0;
      let failed = false;
      const fail = (err) => { if (!failed) { failed = true; out.destroy(); reject(err); } };
      req.on('data', (chunk) => {
        count += chunk.length;
        if (count > length) fail(httpError(400, 'Piece is larger than declared.'));
      });
      req.on('aborted', () => fail(httpError(400, 'Connection dropped during this piece.')));
      req.on('close', () => { if (!req.complete) fail(httpError(400, 'Connection dropped during this piece.')); });
      req.on('error', fail);
      out.on('error', fail);
      out.on('finish', () => { if (!failed) resolve(count); });
      req.pipe(out);
    });
    if (written !== length) throw httpError(400, 'Piece arrived incomplete; please resend it.', { received: meta.received });
    meta.received = at + written;
    meta.updatedAt = new Date().toISOString();
    writeMeta(id, meta);
    return { id, received: meta.received, size: meta.size };
  } finally {
    busy.delete(id);
  }
};

// All pieces are in: move the file into place and queue it for optimisation.
// Safe to call again (e.g. if the reply was lost): the same result is returned,
// and is remembered for 24 hours so the browser can always pick it up.
const complete = (id) => {
  const meta = readMeta(id);
  if (meta.done) return meta.result;
  if (meta.received !== meta.size) throw httpError(409, 'The upload is not finished yet.', { received: meta.received });
  if (fs.statSync(dataPath(id)).size !== meta.size) throw httpError(500, 'The uploaded file size does not match; please upload again.');

  const convert = isAvailable();
  const filename = meta.ext !== '.mp4' && convert ? `${id}.source${meta.ext}` : `${id}${meta.ext}`;
  fs.renameSync(dataPath(id), path.join(VIDEO_DIR, filename));

  const result = convert
    ? { url: enqueue(id, filename), processing: true, playableNow: filename === `${id}.mp4` }
    : { url: `/uploads/videos/${filename}`, processing: false };
  writeMeta(id, { ...meta, done: true, result, updatedAt: new Date().toISOString() });
  return result;
};

const _test = { setFreeSpace: (fn) => { freeSpace = fn; } };

module.exports = { start, status, receiveChunk, complete, cleanupStale, CHUNK_BYTES, MAX_VIDEO_BYTES, PARTIAL_DIR, _test };
