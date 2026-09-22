const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const {
  getTestimonials, submitTestimonial, approveTestimonial, deleteTestimonial,
} = require('../controllers/testimonialController');

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', submitTestimonial);
router.put('/:id/approve', protect, restrictTo('admin'), approveTestimonial);
router.delete('/:id', protect, restrictTo('admin'), deleteTestimonial);

module.exports = router;
