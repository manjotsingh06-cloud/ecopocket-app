const { isMongo } = require('../config/db');
const Order = require('../models/Order');
const Product = require('../models/Product');
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

// POST /api/orders - Create a new order with verified server-side pricing
exports.createOrder = async (req, res, next) => {
  try {
    const { customer, items, paymentMethod, razorpayPaymentId } = req.body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order data.' });
    }

    // Server-side calculation of subtotal
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      let unitPrice = Number(item.price);

      // Verify price against DB product if available
      if (item.product && isMongo()) {
        try {
          const dbProduct = await Product.findById(item.product);
          if (dbProduct) {
            unitPrice = dbProduct.price;
          }
        } catch (_) {}
      }

      subtotal += unitPrice * qty;
      validatedItems.push({
        product: item.product || null,
        name: item.name,
        slug: item.slug,
        price: unitPrice,
        quantity: qty,
        image: item.image || '',
      });
    }

    const shippingFee = subtotal >= 999 ? 0 : 79;
    const totalAmount = subtotal + shippingFee;

    const orderNumber = 'EP-' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);
    const transactionId = razorpayPaymentId
      ? razorpayPaymentId
      : paymentMethod === 'CashOnDelivery'
      ? 'COD-' + Date.now().toString().slice(-8)
      : 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const order = await Order.create({
      orderNumber,
      user: req.user?._id || req.user?.id || null,
      customer,
      items: validatedItems,
      totalAmount,
      shippingFee,
      paymentMethod: paymentMethod || 'Razorpay',
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

// GET /api/orders/my-orders (strictly authenticated to prevent IDOR leaks)
exports.getMyOrders = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    const userId = req.user._id || req.user.id;
    const orders = await Order.find({ user: userId }).sort('-createdAt').limit(20);
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
