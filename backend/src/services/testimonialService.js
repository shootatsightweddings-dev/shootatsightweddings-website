const Testimonial = require('../models/Testimonial');

const defaultTestimonials = [
  {
    num: "01",
    quote: "We didn't want standard wedding photography; we wanted an author for our legacy. Shoot @ Sight didn't just capture our celebration—they curated a high-fashion, digital visual spread. Every single frame is pure art.",
    author: "Raghu Dixit & Varijashree",
    location: "THE HEIRLOOM CEREMONY",
    tags: ["Editorial Narrative", "High-Fashion Spread"]
  },
  {
    num: "02",
    quote: "To say they captured the emotion is an understatement. They captured the unspoken whispers, the raw poetry, and the cinematic architecture of our wedding. Absolute masters of high-end visual art.",
    author: "Naveen & Kate",
    location: "THE CINEMATIC CAPTURE",
    tags: ["Cinematic Poetry", "Candid Emotion"]
  },
  {
    num: "03",
    quote: "The sheer drama, the unscripted whispers, the absolute masterclass in lighting. Working with them was an immersive luxury experience. They don't just document—they command the lens with sheer prestige.",
    author: "Aishwarya & Akshay",
    location: "THE LUXURY PORTFOLIO",
    tags: ["Luxury Curation", "Prestige Lighting"]
  },
  {
    num: "04",
    quote: "Every single print is a physical masterpiece. The deep emotional weight, the rich color grading, and the timeless textures. They have forever preserved the raw soul of our celebration.",
    author: "Srinidhi & Ramya",
    location: "THE FINE ART LEGACY",
    tags: ["Fine Art Legacy", "Color Grading"]
  }
];

const getAllTestimonials = async () => {
  let testimonials = await Testimonial.find().sort({ num: 1 }).maxTimeMS(3000).lean();

  // Auto-seed if empty
  if (testimonials.length === 0) {
    await Testimonial.insertMany(defaultTestimonials);
    testimonials = await Testimonial.find().sort({ num: 1 }).maxTimeMS(3000).lean();
  }

  return testimonials;
};

const createTestimonial = async ({ num, quote, author, location, tags }) => {
  if (!num?.trim()) {
    const err = new Error('Number is required');
    err.statusCode = 400;
    throw err;
  }
  if (!quote?.trim()) {
    const err = new Error('Quote is required');
    err.statusCode = 400;
    throw err;
  }
  if (!author?.trim()) {
    const err = new Error('Author is required');
    err.statusCode = 400;
    throw err;
  }
  if (!location?.trim()) {
    const err = new Error('Location is required');
    err.statusCode = 400;
    throw err;
  }

  return Testimonial.create({
    num: num.trim(),
    quote: quote.trim(),
    author: author.trim(),
    location: location.trim(),
    tags: tags || []
  });
};

const updateTestimonial = async (id, updates) => {
  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    const err = new Error('Testimonial not found');
    err.statusCode = 404;
    throw err;
  }

  if (updates.num) updates.num = updates.num.trim();
  if (updates.quote) updates.quote = updates.quote.trim();
  if (updates.author) updates.author = updates.author.trim();
  if (updates.location) updates.location = updates.location.trim();

  Object.assign(testimonial, updates);
  return testimonial.save();
};

const deleteTestimonial = async (id) => {
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) {
    const err = new Error('Testimonial not found');
    err.statusCode = 404;
    throw err;
  }
  return testimonial;
};

module.exports = {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
