const { Router } = require('express');
const authRoutes = require('./authRoutes');
const imageRoutes = require('./imageRoutes');
const blogRoutes = require('./blogRoutes');
const adminRoutes = require('./adminRoutes');
const shootRoutes = require('./shootRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const siteConfigRoutes = require('./siteConfigRoutes');

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/images', imageRoutes);
router.use('/blogs', blogRoutes);
router.use('/admin', adminRoutes);
router.use('/shoots', shootRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/site-config', siteConfigRoutes);

module.exports = router;
