const { Router } = require('express');
const { getAllTestimonials } = require('../controllers/testimonialController');

const router = Router();

router.get('/', getAllTestimonials);

module.exports = router;
