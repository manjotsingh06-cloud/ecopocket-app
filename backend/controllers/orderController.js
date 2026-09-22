const Order = require('../models/Order');
let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (e) {
  Razorpay = null;
}

// Initialize Razorpay instance if keys are provided in .env
const getRazorpayInstance = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && Razorpay) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return null;
};

// POST /api/orders/create-razorpay-order
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const rzp = getRazorpayInstance();

    if (!rzp) {
      // Return simulated order ID when running in demo/sandbox without live API keys
      return res.json({
        success: true,
        orderId: 'rzp_demo_' + Date.now().toString().slice(-8),
        amount: amount * 100,
        currency: 'INR',
        isDemo: true,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_EcoPocketDemoKey123',
      });
    }

    const options = {
      amount: Math.round(amount * 100), // in paise
      currency: 'INR',
      receipt: 'rcpt_' + Date.now().toString().slice(-8),
    };

    const rzpOrder = await rzp.orders.create(options);
    res.json({
      success: true,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/orders - Create a new order with instant payment verification
exports.createOrder = async (req, res, next) => {
  try {
    const { customer, items, totalAmount, paymentMethod, razorpayPaymentId } = req.body;

    if (!customer || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Invalid order data.' });
    }

    const orderNumber = 'EP-' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);
    const transactionId = razorpayPaymentId
      ? razorpayPaymentId
      : paymentMethod === 'CashOnDelivery'
      ? 'COD-' + Date.now().toString().slice(-8)
      : 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const order = await Order.create({
      orderNumber,
      user: req.user?._id || null,
      customer,
      items,
      totalAmount,
      shippingFee: totalAmount >= 999 ? 0 : 79,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: paymentMethod === 'CashOnDelivery' ? 'Pending' : 'Paid',
      orderStatus: 'Processing',
      transactionId,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/my-orders (optional for logged in users)
exports.getMyOrders = async (req, res, next) => {
  try {
    const query = req.user ? { user: req.user._id } : {};
    const orders = await Order.find(query).sort('-createdAt').limit(20);
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:orderNumber
exports.getOrderByNumber = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
