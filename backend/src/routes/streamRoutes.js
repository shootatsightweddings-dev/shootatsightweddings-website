const { Router } = require('express');
const adminAuth = require('../middlewares/adminAuth');
const { createTusUpload, getStreamVideo, deleteStreamVideo } = require('../controllers/streamController');

const router = Router();

router.use(adminAuth);
router.post('/tus-upload', createTusUpload);
router.get('/:uid', getStreamVideo);
router.delete('/:uid', deleteStreamVideo);

module.exports = router;
