const { Schema, model } = require('mongoose');

const { fields } = require('../services/seoFields');

const shootSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    desc: { type: String, required: true },
    ...fields,
    heroImageAlt: { type: String, default: '' },
    galleryAlt: { type: [String], default: [] },
    narrative: { type: String, default: '' },
    clientQuote: { type: String, default: '' },
    clientQuoteAuthor: { type: String, default: '' },
    testimonialId: { type: Schema.Types.ObjectId, ref: 'Testimonial', default: null },
    resultsSummary: { type: String, default: '' },
    heroImage: { type: String, required: true },
    gallery: [{ type: String }],
  },
  {
    timestamps: true,
    autoIndex: false  // index already exists in MongoDB — prevents duplicate index warning on startup
  }
);

module.exports = model('Shoot', shootSchema);
