const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Videos uploaded from the admin panel are saved straight onto this server in
// backend/uploads/videos and served by server.js at /uploads/videos/<file>.
// nginx allows up to 2 GB on the upload routes (see docs/deployment.md).
const VIDEO_DIR = path.join(__dirname, '..', '..', 'uploads', 'videos');
const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB
const ALLOWED = { 'video/mp4': '.mp4', 'video/webm': '.webm', 'video/quicktime': '.mov' };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir(VIDEO_DIR, { recursive: true }, (err) => cb(err, VIDEO_DIR));
  },
  filename: (req, file, cb) => cb(null, `${uuidv4()}${ALLOWED[file.mimetype] || '.mp4'}`),
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
