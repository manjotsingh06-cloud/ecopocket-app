import { useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from '../components/ui/Reveal';
import api from '../api/axios';
import { formatPrice } from '../data/products';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin } from 'react-icons/fi';

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await api.get(`/orders/${orderNumber.trim().toUpperCase()}`);
      setOrder(res.data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'No order found with this tracking number. Please verify.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Order Placed', desc: 'Order received & verified', status: 'done', icon: FiCheckCircle },
    { title: 'Handcrafted & Packed', desc: 'Stitched with zero-plastic packaging', status: 'current', icon: FiPackage },
    { title: 'In Transit', desc: 'Handed to carbon-neutral courier', status: 'pending', icon: FiTruck },
    { title: 'Delivered', desc: 'Delivered to your doorstep', status: 'pending', icon: FiMapPin },
  ];

  return (
    <div className="pt-36 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-display font-semibold tracking-widest uppercase text-earth mb-2">Track & Trace</p>
          <h1 className="font-display font-bold text-4xl text-forest dark:text-sage-soft">Track Your EcoPocket Order</h1>
          <p className="text-xs opacity-70 mt-2">Enter your order tracking number (e.g. EP-123456789) to view real-time shipping status.</p>
        </Reveal>

        {/* Tracking Search Form */}
        <Reveal delay={0.05}>
          <form onSubmit={handleTrack} className="glass rounded-2xl p-3 sm:p-4 mb-10 flex gap-2 border border-forest/15 shadow-md">
            <div className="relative flex-1 flex items-center">
              <FiSearch className="absolute left-4 text-earth" size={18} />
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter order number (e.g. EP-123456)"
                className="w-full pl-11 pr-4 py-3 bg-transparent text-xs sm:text-sm focus:outline-none uppercase font-mono font-bold tracking-wider placeholder:normal-case placeholder:font-normal placeholder:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-forest text-cream font-bold text-xs shadow hover:bg-earth transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </Reveal>

        {error && (
          <div className="p-4 rounded-2xl bg-red-100 dark:bg-red-950/50 border border-red-200 text-red-700 dark:text-red-300 text-xs text-center mb-8">
            {error}
          </div>
        )}

        {/* Order Details Card */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header info */}
            <div className="glass rounded-3xl p-6 sm:p-8 border border-forest/15 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-forest/10 dark:border-white/10">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-earth">Tracking Order</span>
                  <h3 className="font-mono font-bold text-xl text-forest dark:text-cream">{order.orderNumber}</h3>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs self-start sm:self-auto border border-emerald-300">
                  <FiClock size={13} /> Status: {order.orderStatus || 'Processing'}
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  const isDone = idx === 0;
                  const isCurrent = idx === 1;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border flex flex-col justify-between ${
                        isDone || isCurrent
                          ? 'border-forest/20 bg-forest/5 dark:bg-white/5'
                          : 'border-forest/10 dark:border-white/5 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Icon size={18} className={isDone ? 'text-[#4F9D69]' : isCurrent ? 'text-earth' : 'opacity-40'} />
                        <span className="text-[10px] font-bold opacity-60">Step {idx + 1}</span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-forest dark:text-cream leading-tight mb-1">{s.title}</p>
                        <p className="text-[10px] opacity-70 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ordered Items summary */}
              <div className="pt-4 border-t border-forest/10 dark:border-white/10">
                <p className="text-xs font-bold uppercase tracking-wider text-forest dark:text-sage-soft mb-3">
                  Items in Shipment
                </p>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-forest/10 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || '/images/products/quilted-sandwich-pocket.jpg'}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-forest/10"
                        />
                        <div>
                          <p className="font-bold text-forest dark:text-cream">{item.name}</p>
                          <p className="text-[10px] opacity-70">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-earth">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-4 border-t border-forest/10 dark:border-white/10 flex flex-col sm:flex-row justify-between text-xs gap-4">
                <div>
                  <p className="font-bold opacity-60 text-[10px] uppercase tracking-wider mb-1">Destination</p>
                  <p className="font-medium text-forest dark:text-cream">
                    {order.customer?.name}
                  </p>
                  <p className="opacity-70 text-[11px]">
                    {order.customer?.address?.street}, {order.customer?.address?.city}, {order.customer?.address?.pincode}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="font-bold opacity-60 text-[10px] uppercase tracking-wider mb-1">Payment</p>
                  <p className="font-medium text-forest dark:text-cream">{order.paymentMethod} ({order.paymentStatus})</p>
                  <p className="text-earth font-bold text-sm mt-0.5">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

