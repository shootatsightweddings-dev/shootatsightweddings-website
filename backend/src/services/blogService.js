const Blog = require('../models/Blog');
const { validateSeo } = require('./seoFields');

const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const uniqueSlug = async (title, excludeId = null) => {
  const base = generateSlug(title);
  let slug = base;
  let count = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Blog.findOne(query).lean();
    if (!existing) return slug;
    slug = `${base}-${++count}`;
  }
};

const getPublishedBlogs = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const filter = { isPublished: true };

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .select('title slug coverImageUrl content tags createdAt updatedAt publishedAt metaTitle metaDescription altText authorName authorType authorUrl canonicalUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .maxTimeMS(3000)
      .lean(),
    Blog.countDocuments(filter).maxTimeMS(3000),
  ]);

  return { blogs, total, page, totalPages: Math.ceil(total / limit) };
};

const getPublishedBlogBySlug = async (slug) => {
  const blog = await Blog.findOne({ slug, isPublished: true }).lean();
  if (!blog) {
    const err = new Error('Blog not found');
    err.statusCode = 404;
    throw err;
  }
  return blog;
};

const getAllBlogs = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .maxTimeMS(3000)
      .lean(),
    Blog.countDocuments().maxTimeMS(3000),
  ]);

  return { blogs, total, page, totalPages: Math.ceil(total / limit) };
};

const createBlog = async (data) => {
  validateSeo(data);
  const { title, content, coverImageUrl, tags, isPublished, metaTitle, metaDescription, altText, authorName, authorType, authorUrl, canonicalUrl } = data;
  if (!title?.trim()) {
    const err = new Error('Title is required');
    err.statusCode = 400;
    throw err;
  }
  if (!content?.trim()) {
    const err = new Error('Content is required');
    err.statusCode = 400;
    throw err;
  }

  const slug = await uniqueSlug(title);

  return Blog.create({
    title: title.trim(),
    slug,
    content: content.trim(),
    metaTitle, metaDescription, altText, authorName, authorType, authorUrl, canonicalUrl,
    publishedAt: isPublished ? new Date() : null,
    coverImageUrl: coverImageUrl || null,
    tags: tags || [],
    isPublished: isPublished ?? false,
  });
};

const updateBlog = async (id, updates) => {
  validateSeo(updates);
  const blog = await Blog.findById(id);
  if (!blog) {
    const err = new Error('Blog not found');
    err.statusCode = 404;
    throw err;
  }

  if (updates.title && updates.title.trim() !== blog.title) {
    updates.title = updates.title.trim();
  }

  if (updates.content) updates.content = updates.content.trim();

  const allowed = ['title','content','coverImageUrl','tags','isPublished','metaTitle','metaDescription','altText','authorName','authorType','authorUrl','canonicalUrl'];
  if (updates.isPublished && !blog.publishedAt) blog.publishedAt = blog.isPublished ? blog.createdAt : new Date();
  Object.assign(blog, Object.fromEntries(allowed.filter(key=>updates[key] !== undefined).map(key=>[key,updates[key]])));
  return blog.save();
};

const deleteBlog = async (id) => {
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) {
    const err = new Error('Blog not found');
    err.statusCode = 404;
    throw err;
  }
  return blog;
};

module.exports = {
  getPublishedBlogs,
  getPublishedBlogBySlug,
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
};
