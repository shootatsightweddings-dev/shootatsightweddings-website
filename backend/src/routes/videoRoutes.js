const { Router } = require('express');
const adminAuth = require('../middlewares/adminAuth');
const { videoUpload } = require('../middlewares/videoUpload');
const { uploadVideo, videoStatus } = require('../controllers/videoController');

const router = Router();

router.post('/upload', adminAuth, videoUpload, uploadVideo);
router.get('/status/:id', adminAuth, videoStatus);

module.exports = router;
