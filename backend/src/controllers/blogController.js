const blogService = require('../services/blogService');

const getPublishedBlogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const result = await blogService.getPublishedBlogs(page, limit);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getPublishedBlogBySlug = async (req, res, next) => {
  try {
    const blog = await blogService.getPublishedBlogBySlug(req.params.slug);
    res.json({ success: true, blog });
  } catch (err) {
    next(err);
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const result = await blogService.getAllBlogs(page, limit);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const blog = await blogService.createBlog(req.body);
    res.status(201).json({ success: true, blog });
  } catch (err) {
    next(err);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    res.json({ success: true, blog });
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    await blogService.deleteBlog(req.params.id);
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublishedBlogs,
  getPublishedBlogBySlug,
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
};
