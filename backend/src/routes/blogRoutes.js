const { Router } = require('express');
const { getPublishedBlogs, getPublishedBlogBySlug } = require('../controllers/blogController');

const router = Router();

router.get('/', getPublishedBlogs);
router.get('/:slug', getPublishedBlogBySlug);

module.exports = router;
