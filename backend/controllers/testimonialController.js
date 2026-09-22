const Testimonial = require('../models/Testimonial');

async function getTestimonials(req, res, next) {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort('-createdAt');
    res.json({ success: true, testimonials });
  } catch (err) {
    next(err);
  }
}

async function submitTestimonial(req, res, next) {
  try {
    const testimonial = await Testimonial.create(req.body); // approved:false by default
    res.status(201).json({ success: true, message: 'Thanks! Your review will appear once approved.', testimonial });
  } catch (err) {
    next(err);
  }
}

async function approveTestimonial(req, res, next) {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { approved: req.body.approved ?? true }, { new: true });
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    res.json({ success: true, testimonial });
  } catch (err) {
    next(err);
  }
}

async function deleteTestimonial(req, res, next) {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTestimonials, submitTestimonial, approveTestimonial, deleteTestimonial };
