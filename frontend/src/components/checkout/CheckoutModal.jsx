import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiCreditCard, FiSmartphone, FiTruck, FiShield, FiLock, FiZap } from 'react-icons/fi';
import api from '../../api/axios';
import { formatPrice } from '../../data/products';

export default function CheckoutModal({ isOpen, onClose, product, quantity = 1 }) {
  const [step, setStep] = useState('details'); // 'details' | 'payment' | 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'Razorpay', // 'Razorpay' | 'UPI' | 'Card' | 'CashOnDelivery'
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  if (!isOpen || !product) return null;

  const subtotal = product.price * quantity;
  const shipping = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.street || !form.city || !form.pincode) {
      setError('Please fill in all shipping details.');
      return;
    }
    setError('');
    setStep('payment');
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. If Razorpay is chosen, launch Razorpay Gateway Modal
      if (form.paymentMethod === 'Razorpay') {
        const isLoaded = await loadRazorpayScript();
        const rzpRes = await api.post('/orders/create-razorpay-order', { amount: total });

        if (isLoaded && window.Razorpay && !rzpRes.data.isDemo) {
          const options = {
            key: rzpRes.data.key,
            amount: rzpRes.data.amount,
            currency: rzpRes.data.currency,
            name: 'EcoPocket Textiles',
            description: `Order for ${product.name}`,
            order_id: rzpRes.data.orderId,
            prefill: {
              name: form.name,
              email: form.email,
              contact: form.phone,
            },
            theme: { color: '#193528' },
            handler: async (response) => {
              // Complete order on backend with Razorpay Payment ID
              await submitOrderToBackend(response.razorpay_payment_id);
            },
          };

          const rzpInstance = new window.Razorpay(options);
          rzpInstance.open();
          setLoading(false);
          return;
        }
      }

      // 2. Direct payment or COD or Demo fallback
      await submitOrderToBackend();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete transaction. Please try again.');
      setLoading(false);
    }
  };

  const submitOrderToBackend = async (razorpayPaymentId = null) => {
    const payload = {
      customer: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state || 'India',
          pincode: form.pincode,
        },
      },
      items: [
        {
          product: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          quantity,
          image: product.images?.[0]?.url || '',
        },
      ],
      totalAmount: total,
      paymentMethod: form.paymentMethod,
      razorpayPaymentId,
    };

    const res = await api.post('/orders', payload);
    setOrderResult(res.data.order);
    setStep('success');
    setLoading(false);
  };

  const resetAndClose = () => {
    setStep('details');
    setError('');
    setOrderResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-xl bg-[#FAF7F2] dark:bg-[#10251B] border border-forest/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-forest text-cream flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiShield size={18} className="text-emerald-400" />
            <span className="font-display font-bold text-sm tracking-wide">
              {step === 'success' ? 'Order Confirmed!' : 'Secure Express Checkout'}
            </span>
          </div>
          <button
            onClick={resetAndClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Order Summary Pill */}
          {step !== 'success' && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-forest/5 dark:bg-white/5 border border-forest/10 dark:border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={product.images?.[0]?.url || '/images/products/quilted-sandwich-pocket.jpg'}
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover border border-forest/10"
                />
                <div>
                  <p className="font-bold text-xs text-forest dark:text-cream truncate max-w-[200px]">
                    {product.name}
                  </p>
                  <p className="text-[11px] opacity-70">
                    Qty: {quantity} × {formatPrice(product.price)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-forest dark:text-cream">{formatPrice(total)}</p>
                <p className="text-[10px] text-emerald-600 font-semibold">
                  {shipping === 0 ? 'Free Shipping' : '+ ₹79 Shipping'}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-200 text-red-700 dark:text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* STEP 1: Shipping Address */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4 text-xs">
              <p className="font-bold text-forest dark:text-sage-soft uppercase tracking-wider text-[11px]">
                1. Delivery Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 opacity-80">Full Name *</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Manjot Singh"
                    className="w-full px-3 py-2.5 rounded-xl border border-forest/20 dark:border-white/15 bg-white/70 dark:bg-white/5 focus:outline-none focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 opacity-80">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 rounded-xl border border-forest/20 dark:border-white/15 bg-white/70 dark:bg-white/5 focus:outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 opacity-80">Email Address *</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-forest/20 dark:border-white/15 bg-white/70 dark:bg-white/5 focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 opacity-80">Street / Flat Address *</label>
                <input
                  type="text"
                  required
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  placeholder="House No., Street, Landmark"
                  className="w-full px-3 py-2.5 rounded-xl border border-forest/20 dark:border-white/15 bg-white/70 dark:bg-white/5 focus:outline-none focus:border-forest"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium mb-1 opacity-80">City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="New Delhi"
                    className="w-full px-3 py-2.5 rounded-xl border border-forest/20 dark:border-white/15 bg-white/70 dark:bg-white/5 focus:outline-none focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 opacity-80">State</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Delhi"
                    className="w-full px-3 py-2.5 rounded-xl border border-forest/20 dark:border-white/15 bg-white/70 dark:bg-white/5 focus:outline-none focus:border-forest"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-medium mb-1 opacity-80">PIN Code *</label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="110001"
                    className="w-full px-3 py-2.5 rounded-xl border border-forest/20 dark:border-white/15 bg-white/70 dark:bg-white/5 focus:outline-none focus:border-forest"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-forest text-cream font-bold text-xs shadow-lg hover:bg-earth transition-colors mt-2"
              >
                Proceed to Payment →
              </button>
            </form>
          )}

          {/* STEP 2: Payment Method */}
          {step === 'payment' && (
            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <p className="font-bold text-forest dark:text-sage-soft uppercase tracking-wider text-[11px]">
                  2. Select Payment Method
                </p>
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-[11px] text-earth font-semibold hover:underline"
                >
                  ← Edit Address
                </button>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'Razorpay', label: 'Razorpay / UPI', icon: FiZap },
                  { id: 'UPI', label: 'Direct QR', icon: FiSmartphone },
                  { id: 'Card', label: 'Card', icon: FiCreditCard },
                  { id: 'CashOnDelivery', label: 'Cash (COD)', icon: FiTruck },
                ].map((m) => {
                  const Icon = m.icon;
                  const active = form.paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setForm({ ...form, paymentMethod: m.id })}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                        active
                          ? 'border-forest bg-forest text-cream shadow-md'
                          : 'border-forest/20 dark:border-white/10 hover:border-forest/50'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="font-semibold text-[10px] leading-tight">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Razorpay Gateway Option */}
              {form.paymentMethod === 'Razorpay' && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <FiZap size={16} className="text-emerald-600" />
                    <span className="font-bold text-xs">Official Razorpay Gateway Active</span>
                  </div>
                  <p className="text-[11px] opacity-80 leading-relaxed">
                    Pay securely via UPI (Google Pay, PhonePe, Paytm), NetBanking, or Credit/Debit Cards with instant bank verification.
                  </p>
                </div>
              )}

              {/* Direct UPI Option */}
              {form.paymentMethod === 'UPI' && (
                <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-forest/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-forest dark:text-cream">Scan QR or enter UPI ID</p>
                      <p className="text-[10px] opacity-70">Supports GPay, PhonePe, Paytm, BHIM</p>
                    </div>
                    <div className="w-12 h-12 bg-forest/10 dark:bg-white/10 rounded-lg flex items-center justify-center font-mono text-[10px] text-forest dark:text-cream font-bold border border-forest/20">
                      UPI QR
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium mb-1 opacity-80">UPI ID / VPA</label>
                    <input
                      type="text"
                      name="upiId"
                      value={form.upiId}
                      onChange={handleChange}
                      placeholder="mobile@upi or username@okaxis"
                      className="w-full px-3 py-2.5 rounded-xl border border-forest/20 dark:border-white/15 bg-white dark:bg-black/20 focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>
              )}

              {/* Card Option */}
              {form.paymentMethod === 'Card' && (
                <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-forest/15 space-y-3">
                  <div>
                    <label className="block font-medium mb-1 opacity-80">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={handleChange}
                      placeholder="4242 •••• •••• 4242"
                      className="w-full px-3 py-2.5 rounded-xl border border-forest/20 dark:border-white/15 bg-white dark:bg-black/20 focus:outline-none focus:border-forest"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1 opacity-80">Expiry</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={form.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2.5 rounded-xl border border-forest/20 dark:border-white/15 bg-white dark:bg-black/20 focus:outline-none focus:border-forest"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1 opacity-80">CVV</label>
                      <input
                        type="password"
                        name="cardCvv"
                        maxLength={4}
                        value={form.cardCvv}
                        onChange={handleChange}
                        placeholder="•••"
                        className="w-full px-3 py-2.5 rounded-xl border border-forest/20 dark:border-white/15 bg-white dark:bg-black/20 focus:outline-none focus:border-forest"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cash On Delivery Option */}
              {form.paymentMethod === 'CashOnDelivery' && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200">
                  <p className="font-bold text-xs flex items-center gap-1.5 mb-1">
                    <FiTruck size={15} /> Cash on Delivery Selected
                  </p>
                  <p className="text-[11px] opacity-80">
                    Pay {formatPrice(total)} with cash or UPI at the time of delivery to your doorstep.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[10px] opacity-60 text-center pt-1">
                <FiLock size={12} /> 256-bit SSL encrypted secure checkout
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-forest text-cream font-bold text-xs shadow-lg hover:bg-earth transition-colors disabled:opacity-50"
              >
                {loading ? 'Connecting Payment...' : `Pay ${formatPrice(total)} & Confirm Order`}
              </button>
            </form>
          )}

          {/* STEP 3: Order Success Screen */}
          {step === 'success' && orderResult && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <FiCheckCircle size={36} />
              </div>

              <div>
                <h3 className="font-display font-bold text-xl text-forest dark:text-cream">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs opacity-70 mt-1">
                  Thank you for supporting mindful zero-waste dining.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-forest/10 dark:border-white/10 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="opacity-60">Order Number:</span>
                  <span className="font-mono font-bold text-forest dark:text-cream">
                    {orderResult.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Payment Method:</span>
                  <span className="font-semibold">{orderResult.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Amount Paid:</span>
                  <span className="font-bold text-earth">{formatPrice(orderResult.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Shipping To:</span>
                  <span className="font-medium truncate max-w-[200px]">
                    {orderResult.customer?.name} ({orderResult.customer?.address?.city})
                  </span>
                </div>
              </div>

              <button
                onClick={resetAndClose}
                className="w-full py-3 rounded-full bg-forest text-cream font-bold text-xs shadow-md hover:bg-earth transition-colors"
              >
                Done / Continue Shopping
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
