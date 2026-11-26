const { Schema, model } = require('mongoose');

const { fields } = require('../services/seoFields');

const shootSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    // Optional: some couples are published before the studio confirms the city.
    location: { type: String, default: '', trim: true },
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
    // Position on the portfolio page (1 = first). Couples without one follow.
    displayOrder: { type: Number, default: null },
    // Pinned to the homepage "Recent Captures" strip, in this order (1 =
    // first), ahead of the newest shoots. Optional portrait photo for that
    // card (the strip's cards are tall); falls back to heroImage.
    homeOrder: { type: Number, default: null },
    homeImage: { type: String, default: null },
    gallery: [{ type: String }],
  },
  {
    timestamps: true,
    autoIndex: false  // index already exists in MongoDB — prevents duplicate index warning on startup
  }
);

module.exports = model('Shoot', shootSchema);
