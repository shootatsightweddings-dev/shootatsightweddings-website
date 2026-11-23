const { Router } = require('express');
const adminAuth = require('../middlewares/adminAuth');
const { videoUpload } = require('../middlewares/videoUpload');
const { uploadVideo } = require('../controllers/videoController');

const router = Router();

router.post('/upload', adminAuth, videoUpload, uploadVideo);

module.exports = router;
