const { Router } = require('express');
const multer = require('multer');
const os = require('os');
const adminAuth = require('../middlewares/adminAuth');
const { uploadVideo } = require('../controllers/videoController');

const router = Router();

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB limit
});

router.post(
  '/upload',
  adminAuth,
  (req, res, next) => {
    upload.single('video')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      }
      if (err) return res.status(500).json({ success: false, message: err.message });
      next();
    });
  },
  uploadVideo
);

module.exports = router;
