const { Router } = require('express');
const multer = require('multer');
const adminAuth = require('../middlewares/adminAuth');
const { uploadImage } = require('../controllers/imageController');

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/upload', adminAuth, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: 'File too large. Maximum size is 10 MB.' });
    }
    if (err) return next(err);
    next();
  });
}, uploadImage);

module.exports = router;
