const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { getAnalytics, getUsers, updateUserRole, getAdminTestimonials, getAdminBlogs } = require('../controllers/adminController');

const router = express.Router();

router.use(protect, restrictTo('admin'));
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.get('/testimonials', getAdminTestimonials);
router.get('/blogs', getAdminBlogs);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
