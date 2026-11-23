const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { VIDEO_DIR, isAvailable } = require('../services/videoProcessing');

// Videos uploaded from the admin panel are saved straight onto this server in
// backend/uploads/videos and served by server.js at /uploads/videos/<file>.
// nginx must allow large bodies on the upload routes (see docs/deployment.md).
// When ffmpeg is installed, services/videoProcessing.js then optimises them.
const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB
const ALLOWED = { 'video/mp4': '.mp4', 'video/webm': '.webm', 'video/quicktime': '.mov' };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir(VIDEO_DIR, { recursive: true }, (err) => cb(err, VIDEO_DIR));
  },
  filename: (req, file, cb) => {
    const id = uuidv4();
    const ext = ALLOWED[file.mimetype] || '.mp4';
    req.videoId = id;
    // Non-MP4 uploads that will be converted keep a ".source" name; the
    // converted <id>.mp4 appears beside it when ready.
    cb(null, ext !== '.mp4' && isAvailable() ? `${id}.source${ext}` : `${id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_VIDEO_BYTES },
  fileFilter: (req, file, cb) => {
    if (ALLOWED[file.mimetype]) return cb(null, true);
    const error = new Error('Only MP4, WebM or MOV videos can be uploaded.');
    error.statusCode = 400;
    return cb(error);
  },
});

// Wraps multer so upload errors come back as clear JSON messages.
const videoUpload = (req, res, next) => {
  upload.single('video')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'Videos can be up to 2 GB.' : `Upload error: ${err.message}`;
      return res.status(400).json({ success: false, message });
    }
    if (err) return res.status(err.statusCode || 500).json({ success: false, message: err.message });
    next();
  });
};

module.exports = { videoUpload, VIDEO_DIR };
