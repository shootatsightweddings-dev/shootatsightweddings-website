const { Router } = require('express');
const adminAuth = require('../middlewares/adminAuth');
const { videoUpload } = require('../middlewares/videoUpload');
const { uploadVideo, videoStatus } = require('../controllers/videoController');
const { startUpload, uploadStatus, uploadChunk, completeUpload } = require('../controllers/chunkedUploadController');

const router = Router();

// Resumable uploads in pieces (used by the admin panel; up to 10 GB).
router.post('/uploads', adminAuth, startUpload);
router.get('/uploads/:id', adminAuth, uploadStatus);
router.put('/uploads/:id', adminAuth, uploadChunk);
router.post('/uploads/:id/complete', adminAuth, completeUpload);

// Single-request upload (kept for compatibility; limited by nginx to 2 GB).
router.post('/upload', adminAuth, videoUpload, uploadVideo);
router.get('/status/:id', adminAuth, videoStatus);

module.exports = router;
