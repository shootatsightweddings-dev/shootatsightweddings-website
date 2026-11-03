const { Schema, model } = require('mongoose');

const shootSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    desc: { type: String, required: true },
    heroImage: { type: String, required: true },
    gallery: [{ type: String }],
  },
  {
    timestamps: true,
    autoIndex: false  // index already exists in MongoDB — prevents duplicate index warning on startup
  }
);

module.exports = model('Shoot', shootSchema);
