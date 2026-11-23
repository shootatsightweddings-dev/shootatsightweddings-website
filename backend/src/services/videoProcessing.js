// Converts uploaded videos into web-friendly MP4s on this server, in the
// background, one at a time:
//   - longest side capped at 1920px (1080p), H.264 video, AAC audio
//   - "faststart" so playback can begin before the whole file downloads
//
// It turns itself on only when ffmpeg is installed on the server
// (apt-get install -y ffmpeg). Without ffmpeg, uploads are kept as they are.
//
// Uploads keep the same public URL before and after conversion:
//   - MP4 uploads are saved as <id>.mp4 and play immediately; the optimised
//     version replaces the file in place when it is ready (only if smaller).
//   - MOV/WebM uploads are saved as <id>.source.<ext>; <id>.mp4 appears when
//     conversion finishes, and the source is deleted.
// If conversion fails, the original file is kept and nothing is lost.
// Pending jobs are stored in .jobs.json, so a restart or deploy resumes them.

const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

// VIDEO_UPLOAD_DIR is only for tests; the site serves backend/uploads/videos.
const VIDEO_DIR = process.env.VIDEO_UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads', 'videos');
const JOBS_FILE = path.join(VIDEO_DIR, '.jobs.json');
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
const ID_PATTERN = /^[0-9a-f-]{36}$/;

let available = null;
let runner = null;
let running = false;
const queue = [];

const isAvailable = () => {
  if (available === null) {
    try {
      available = spawnSync(FFMPEG, ['-version'], { stdio: 'ignore', timeout: 10000 }).status === 0;
    } catch {
      available = false;
    }
    console.log(available ? '🎬 ffmpeg found: uploaded videos will be optimised for the web.' : 'ℹ️ ffmpeg not installed: uploaded videos are kept as uploaded.');
  }
  return available;
};

const ffmpegArgs = (input, output) => [
  '-hide_banner', '-nostdin', '-y', '-loglevel', 'error',
  '-i', input,
  '-map', '0:v:0', '-map', '0:a:0?',
  // Cap the longest side at 1920px, keep the aspect ratio and even dimensions.
  '-vf', "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1920,ih))'",
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '128k',
  '-movflags', '+faststart',
  '-threads', '2',
  output,
];

// Runs ffmpeg at low CPU priority so the website stays responsive.
const defaultRunner = (args) => new Promise((resolve, reject) => {
  const [cmd, cmdArgs] = process.platform === 'win32' ? [FFMPEG, args] : ['nice', ['-n', '10', FFMPEG, ...args]];
  const child = spawn(cmd, cmdArgs, { stdio: ['ignore', 'ignore', 'pipe'] });
  let stderr = '';
  child.stderr.on('data', (chunk) => { stderr = (stderr + chunk).slice(-2000); });
  child.on('error', reject);
  child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}: ${stderr.trim()}`))));
});

const readJobs = () => {
  try { return JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8')); } catch { return {}; }
};

const writeJobs = (jobs) => {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
  const tmp = `${JOBS_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(jobs, null, 2));
  fs.renameSync(tmp, JOBS_FILE);
};

const setJob = (id, fields) => {
  const jobs = readJobs();
  jobs[id] = { ...jobs[id], ...fields, updatedAt: new Date().toISOString() };
  writeJobs(jobs);
  return jobs[id];
};

const sizeOf = (file) => { try { return fs.statSync(file).size; } catch { return 0; } };

const processJob = async (id) => {
  const job = readJobs()[id];
  if (!job) return;
  const source = path.join(VIDEO_DIR, job.source);
  const output = path.join(VIDEO_DIR, `${id}.mp4`);
  const temp = path.join(VIDEO_DIR, `${id}.converting.mp4`);
  if (!fs.existsSync(source)) {
    setJob(id, { status: 'failed', error: 'Uploaded file is missing.' });
    return;
  }

  setJob(id, { status: 'processing', error: undefined });
  const started = Date.now();
  try {
    await (runner || defaultRunner)(ffmpegArgs(source, temp));
    const before = sizeOf(source);
    const after = sizeOf(temp);
    if (!after) throw new Error('Conversion produced an empty file.');

    if (source === output && after >= before) {
      // Already an efficient MP4: keep the original.
      fs.unlinkSync(temp);
    } else {
      fs.renameSync(temp, output);
      if (source !== output) fs.unlinkSync(source);
    }
    setJob(id, {
      status: 'ready',
      originalBytes: before,
      finalBytes: sizeOf(output),
      seconds: Math.round((Date.now() - started) / 1000),
    });
    console.log(`🎬 Video ${id} optimised: ${(before / 1048576).toFixed(1)} MB → ${(sizeOf(output) / 1048576).toFixed(1)} MB`);
  } catch (err) {
    try { fs.unlinkSync(temp); } catch { /* nothing to clean up */ }
    setJob(id, { status: 'failed', error: err.message.slice(0, 500) });
    console.error(`🎬 Video ${id} could not be optimised; the original is kept.`, err.message);
  }
};

const drain = async () => {
  if (running) return;
  running = true;
  try {
    while (queue.length) await processJob(queue.shift());
  } finally {
    running = false;
  }
};

// Called after an upload has been saved. Returns the public URL to store.
const enqueue = (id, savedFilename) => {
  setJob(id, { status: 'queued', source: savedFilename, createdAt: new Date().toISOString() });
  if (!queue.includes(id)) queue.push(id);
  drain();
  return `/uploads/videos/${id}.mp4`;
};

// On server start: pick up anything that was waiting or mid-conversion.
const resumePending = () => {
  if (!isAvailable()) return 0;
  const jobs = readJobs();
  const pending = Object.keys(jobs).filter((id) => ['queued', 'processing'].includes(jobs[id].status));
  for (const id of pending) {
    try { fs.unlinkSync(path.join(VIDEO_DIR, `${id}.converting.mp4`)); } catch { /* none */ }
    if (!queue.includes(id)) queue.push(id);
  }
  if (pending.length) {
    console.log(`🎬 Resuming ${pending.length} video conversion(s).`);
    drain();
  }
  return pending.length;
};

const getStatus = (id) => {
  if (!ID_PATTERN.test(id)) return null;
  const job = readJobs()[id];
  if (job) return { status: job.status, url: `/uploads/videos/${id}.mp4`, error: job.error };
  return fs.existsSync(path.join(VIDEO_DIR, `${id}.mp4`)) ? { status: 'ready', url: `/uploads/videos/${id}.mp4` } : null;
};

// Lets the tests control conversion without needing ffmpeg installed.
const _test = {
  setAvailable: (value) => { available = value; },
  setRunner: (fn) => { runner = fn; },
  idle: async () => { while (running || queue.length) await new Promise((r) => setTimeout(r, 10)); },
  ffmpegArgs,
};

module.exports = { VIDEO_DIR, isAvailable, enqueue, resumePending, getStatus, _test };
