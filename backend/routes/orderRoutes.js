const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const { createOrder, createRazorpayOrder, getMyOrders, getOrderByNumber } = require('../controllers/orderController');

router.post('/', optionalAuth, createOrder);
router.post('/create-razorpay-order', createRazorpayOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:orderNumber', getOrderByNumber);

module.exports = router;

