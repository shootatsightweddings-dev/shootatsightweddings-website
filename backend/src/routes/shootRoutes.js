const { Router } = require('express');
const multer = require('multer');
const adminAuth = require('../middlewares/adminAuth');
const {
  getAllShoots,
  getShootByIdOrSlug,
  createShoot,
  deleteShoot,
  addGalleryImages,
  removeGalleryImage,
  updateHeroImage,
  updateShootMetadata,
} = require('../controllers/shootController');

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit per file
});

// Plain-language message for a rejected upload (e.g. a photo over 20 MB).
const uploadErrorMessage = (err) => (err.code === 'LIMIT_FILE_SIZE'
  ? 'One of the photos is larger than 20 MB. Please make it smaller and try again.'
  : `Upload error: ${err.message}`);

const uploadFields = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'gallery', maxCount: 50 },
]);

// Public endpoints
router.get('/', getAllShoots);
router.get('/:idOrSlug', getShootByIdOrSlug);

// Create new shoot (multer first, then auth)
router.post('/', (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ success: false, message: uploadErrorMessage(err) });
    if (err) return next(err);
    next();
  });
}, adminAuth, createShoot);

// Add images to existing shoot gallery
router.patch('/:id/gallery', (req, res, next) => {
  upload.fields([{ name: 'gallery', maxCount: 50 }])(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ success: false, message: uploadErrorMessage(err) });
    if (err) return next(err);
    next();
  });
}, adminAuth, addGalleryImages);

// Remove one image from gallery
router.delete('/:id/gallery', adminAuth, removeGalleryImage);

// Replace hero/cover image
router.patch('/:id/hero', (req, res, next) => {
  upload.fields([{ name: 'heroImage', maxCount: 1 }])(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ success: false, message: uploadErrorMessage(err) });
    if (err) return next(err);
    next();
  });
}, adminAuth, updateHeroImage);

// Delete entire shoot
router.delete('/:id', adminAuth, deleteShoot);
router.patch('/:id/metadata', adminAuth, updateShootMetadata);

module.exports = router;
