const { Schema, model } = require('mongoose');
const { fields } = require('../services/seoFields');

const schema = new Schema({
  kind: { type: String, enum: ['service', 'location'], required: true },
  slug: { type: String, required: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
  title: { type: String, required: true, trim: true },
  ...fields,
  heroImage: { type: String, default: '' },
  heroImageAlt: { type: String, default: '' },
  body: { type: String, required: true },
  areaServed: { type: String, default: '' },
  faqs: [{ _id: false, q: { type: String, required: true }, a: { type: String, required: true } }],
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });
schema.index({ kind: 1, slug: 1 }, { unique: true });
module.exports = model('ContentPage', schema);
