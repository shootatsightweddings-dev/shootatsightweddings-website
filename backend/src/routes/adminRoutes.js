const { Router } = require('express');
const multer = require('multer');
const os = require('os');
const adminAuth = require('../middlewares/adminAuth');
const { getAllBlogs, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { updateSectionConfig } = require('../controllers/siteConfigController');
const { uploadVideo } = require('../controllers/videoController');

const router = Router();

const videoUploadMiddleware = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB video ceiling
});

router.use(adminAuth);

// Direct Cloudflare R2 video upload
router.post(
  '/upload-video',
  (req, res, next) => {
    videoUploadMiddleware.single('video')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      }
      if (err) return res.status(500).json({ success: false, message: err.message });
      next();
    });
  },
  uploadVideo
);

router.get('/blogs', getAllBlogs);
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

// Testimonials management
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// Site configuration management
router.put('/site-config/:sectionKey', updateSectionConfig);

const contentPages = require('../services/contentPageService');
router.get('/pages', async (req,res,next) => { try {res.json({success:true,pages:await contentPages.listPages(true)});}catch(error){next(error);} });
router.put('/pages', async (req,res,next) => { try {res.json({success:true,page:await contentPages.savePage(req.body)});}catch(error){next(error);} });

module.exports = router;
