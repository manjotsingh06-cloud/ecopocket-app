const express = require('express');
const router = express.Router();
const { createOrder, createRazorpayOrder, getMyOrders, getOrderByNumber } = require('../controllers/orderController');

router.post('/', createOrder);
router.post('/create-razorpay-order', createRazorpayOrder);
router.get('/my-orders', getMyOrders);
router.get('/:orderNumber', getOrderByNumber);

module.exports = router;

