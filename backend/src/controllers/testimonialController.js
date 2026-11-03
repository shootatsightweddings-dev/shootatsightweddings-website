const testimonialService = require('../services/testimonialService');

const getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await testimonialService.getAllTestimonials();
    res.json({ success: true, testimonials });
  } catch (err) {
    next(err);
  }
};

const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body);
    res.status(201).json({ success: true, testimonial });
  } catch (err) {
    next(err);
  }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await testimonialService.updateTestimonial(req.params.id, req.body);
    res.json({ success: true, testimonial });
  } catch (err) {
    next(err);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    await testimonialService.deleteTestimonial(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
