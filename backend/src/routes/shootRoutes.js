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
} = require('../controllers/shootController');

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit per file
});

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
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    if (err) return next(err);
    next();
  });
}, adminAuth, createShoot);

// Add images to existing shoot gallery
router.patch('/:id/gallery', (req, res, next) => {
  upload.fields([{ name: 'gallery', maxCount: 50 }])(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, adminAuth, addGalleryImages);

// Remove one image from gallery
router.delete('/:id/gallery', adminAuth, removeGalleryImage);

// Replace hero/cover image
router.patch('/:id/hero', (req, res, next) => {
  upload.fields([{ name: 'heroImage', maxCount: 1 }])(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, adminAuth, updateHeroImage);

// Delete entire shoot
router.delete('/:id', adminAuth, deleteShoot);

module.exports = router;
