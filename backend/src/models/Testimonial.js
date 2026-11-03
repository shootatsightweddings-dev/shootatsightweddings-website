const { Schema, model } = require('mongoose');

const testimonialSchema = new Schema(
  {
    num: { type: String, required: true, trim: true },
    quote: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = model('Testimonial', testimonialSchema);
