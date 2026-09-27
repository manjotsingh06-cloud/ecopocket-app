const User = require('../models/User');
const Product = require('../models/Product');
const Blog = require('../models/Blog');
const ContactMessage = require('../models/ContactMessage');
const Newsletter = require('../models/Newsletter');
const Testimonial = require('../models/Testimonial');
const Order = require('../models/Order');

// GET /api/admin/analytics — headline numbers for the admin dashboard
async function getAnalytics(req, res, next) {
  try {
    const [userCount, productCount, blogCount, newMessages, subscriberCount, orderCount, paidOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Blog.countDocuments(),
      ContactMessage.countDocuments({ status: 'new' }),
      Newsletter.countDocuments({ active: true }),
      Order.countDocuments(),
      Order.find({ paymentStatus: 'Paid' }).select('totalAmount'),
    ]);

    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({
      success: true,
      analytics: { userCount, productCount, blogCount, newMessages, subscriberCount, orderCount, totalRevenue },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users
async function getUsers(req, res, next) {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/users/:id/role
async function updateUserRole(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/testimonials — every testimonial (approved or pending) for moderation.
async function getAdminTestimonials(req, res, next) {
  try {
    const testimonials = await Testimonial.find().sort('-createdAt');
    res.json({ success: true, testimonials });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/blogs — every blog post (drafts included) for the content manager.
async function getAdminBlogs(req, res, next) {
  try {
    const blogs = await Blog.find().sort('-createdAt').populate('author', 'name');
    res.json({ success: true, blogs });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/orders — list all customer orders for fulfillment
async function getAdminOrders(req, res, next) {
  try {
    const orders = await Order.find().sort('-createdAt');
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/orders/:id/status — update order fulfillment status
async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status.' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAnalytics, getUsers, updateUserRole, getAdminTestimonials, getAdminBlogs, getAdminOrders, updateOrderStatus };

