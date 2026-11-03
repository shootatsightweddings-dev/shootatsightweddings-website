const { Schema, model } = require('mongoose');

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    coverImageUrl: { type: String, default: null },
    tags: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

blogSchema.index({ isPublished: 1, createdAt: -1 });

module.exports = model('Blog', blogSchema);
