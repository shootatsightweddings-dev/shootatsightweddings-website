const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

// Point the service at a throwaway folder before loading it.
const DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'video-jobs-'));
process.env.VIDEO_UPLOAD_DIR = DIR;
const videos = require('../src/services/videoProcessing');
const { _test } = videos;

const file = (name) => path.join(DIR, name);
const write = (name, bytes) => fs.writeFileSync(file(name), Buffer.alloc(bytes, 1));
const jobs = () => JSON.parse(fs.readFileSync(file('.jobs.json'), 'utf8'));
// Stand-in for ffmpeg: writes an output of a chosen size, or fails.
const fakeFfmpeg = (outBytes) => async (args) => {
  if (outBytes === 'fail') throw new Error('simulated ffmpeg failure');
  fs.writeFileSync(args[args.length - 1], Buffer.alloc(outBytes, 2));
};

before(() => _test.setAvailable(true));
after(() => { _test.setRunner(null); fs.rmSync(DIR, { recursive: true, force: true }); });

test('an MP4 upload plays at once and is replaced in place by a smaller optimised file', async () => {
  const id = '11111111-1111-4111-8111-111111111111';
  write(`${id}.mp4`, 5000);
  _test.setRunner(fakeFfmpeg(1200));
  assert.equal(videos.enqueue(id, `${id}.mp4`), `/uploads/videos/${id}.mp4`);
  await _test.idle();
  assert.equal(fs.statSync(file(`${id}.mp4`)).size, 1200);
  assert.equal(jobs()[id].status, 'ready');
  assert.ok(!fs.existsSync(file(`${id}.converting.mp4`)));
});

test('an already-efficient MP4 is kept when conversion would make it bigger', async () => {
  const id = '22222222-2222-4222-8222-222222222222';
  write(`${id}.mp4`, 1000);
  _test.setRunner(fakeFfmpeg(3000));
  videos.enqueue(id, `${id}.mp4`);
  await _test.idle();
  assert.equal(fs.statSync(file(`${id}.mp4`)).size, 1000);
  assert.equal(jobs()[id].status, 'ready');
});

test('a MOV upload becomes <id>.mp4 at the promised URL and the source is removed', async () => {
  const id = '33333333-3333-4333-8333-333333333333';
  write(`${id}.source.mov`, 8000);
  _test.setRunner(fakeFfmpeg(2000));
  const url = videos.enqueue(id, `${id}.source.mov`);
  await _test.idle();
  assert.equal(url, `/uploads/videos/${id}.mp4`);
  assert.ok(fs.existsSync(file(`${id}.mp4`)));
  assert.ok(!fs.existsSync(file(`${id}.source.mov`)));
  assert.deepEqual(videos.getStatus(id), { status: 'ready', url, error: undefined });
});

test('a failed conversion keeps the original and reports the error', async () => {
  const id = '44444444-4444-4444-8444-444444444444';
  write(`${id}.mp4`, 4000);
  _test.setRunner(fakeFfmpeg('fail'));
  videos.enqueue(id, `${id}.mp4`);
  await _test.idle();
  assert.equal(fs.statSync(file(`${id}.mp4`)).size, 4000);
  assert.equal(jobs()[id].status, 'failed');
  assert.match(jobs()[id].error, /simulated ffmpeg failure/);
});

test('jobs left waiting by a restart are resumed, and half-written outputs discarded', async () => {
  const id = '55555555-5555-4555-8555-555555555555';
  write(`${id}.source.webm`, 6000);
  write(`${id}.converting.mp4`, 10); // left over from an interrupted run
  const all = jobs();
  all[id] = { status: 'processing', source: `${id}.source.webm` };
  fs.writeFileSync(file('.jobs.json'), JSON.stringify(all));
  _test.setRunner(fakeFfmpeg(1500));
  assert.equal(videos.resumePending(), 1);
  await _test.idle();
  assert.equal(fs.statSync(file(`${id}.mp4`)).size, 1500);
  assert.equal(jobs()[id].status, 'ready');
});

test('status lookups reject anything that is not a video id', () => {
  assert.equal(videos.getStatus('../../etc/passwd'), null);
  assert.equal(videos.getStatus('66666666-6666-4666-8666-666666666666'), null);
});

// Real conversion, only where ffmpeg is installed (it is optional on dev machines).
const hasFfmpeg = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0;
test('real ffmpeg: a 4K clip becomes a smaller 1080p, web-ready MP4', { skip: !hasFfmpeg && 'ffmpeg not installed' }, async () => {
  const id = '77777777-7777-4777-8777-777777777777';
  const src = file(`${id}.source.mov`);
  const made = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y',
    '-f', 'lavfi', '-i', 'testsrc2=size=3840x2160:rate=25:duration=3',
    '-f', 'lavfi', '-i', 'sine=frequency=440:duration=3',
    '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '10', '-c:a', 'aac', '-shortest', src]);
  assert.equal(made.status, 0, String(made.stderr));
  _test.setRunner(null); // use the real ffmpeg
  videos.enqueue(id, `${id}.source.mov`);
  await _test.idle();
  const out = file(`${id}.mp4`);
  assert.equal(jobs()[id].status, 'ready', jobs()[id].error);
  const probe = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,codec_name', '-of', 'json', out], { encoding: 'utf8' });
  const stream = JSON.parse(probe.stdout).streams[0];
  assert.equal(stream.codec_name, 'h264');
  assert.equal(stream.width, 1920);
  assert.equal(stream.height, 1080);
  assert.ok(jobs()[id].finalBytes < jobs()[id].originalBytes, 'output should be smaller');
  // "faststart": the index (moov) comes before the media data (mdat).
  const head = fs.readFileSync(out).subarray(0, 4096).toString('latin1');
  assert.ok(head.indexOf('moov') !== -1 && (head.indexOf('mdat') === -1 || head.indexOf('moov') < head.indexOf('mdat')), 'moov atom should be at the start');
});
