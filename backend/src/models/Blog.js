const { Schema, model } = require('mongoose');

const { fields } = require('../services/seoFields');

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    ...fields,
    altText: { type: String, default: '' },
    authorName: { type: String, default: 'Shoot At Sight Weddings' },
    authorType: { type: String, enum: ['Organization', 'Person'], default: 'Organization' },
    authorUrl: { type: String, default: '' },
    publishedAt: { type: Date, default: null },
    coverImageUrl: { type: String, default: null },
    tags: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

blogSchema.index({ isPublished: 1, createdAt: -1 });

module.exports = model('Blog', blogSchema);
