const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAnalytics, getUsers, updateUserRole, getAdminTestimonials, getAdminBlogs,
  getAdminOrders, updateOrderStatus,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, restrictTo('admin'));
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/testimonials', getAdminTestimonials);
router.get('/blogs', getAdminBlogs);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
