import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiShield, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../data/products';

export default function CartDrawer({ onCheckout }) {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    shippingFee,
    totalAmount,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-screen max-w-md bg-cream dark:bg-forest-deep text-forest dark:text-cream shadow-2xl flex flex-col border-l border-forest/15 dark:border-white/10"
        >
          {/* Header */}
          <div className="p-6 border-b border-forest/10 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-forest text-cream flex items-center justify-center">
                <FiShoppingBag size={18} />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg leading-tight">Your Pocket Bag</h2>
                <p className="text-xs opacity-60 font-medium">{totalItems} {totalItems === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full border border-forest/20 dark:border-white/20 flex items-center justify-center hover:bg-forest/10 dark:hover:bg-white/10 transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>

          {/* Free Shipping Milestone Meter */}
          <div className="px-6 py-3.5 bg-forest/5 dark:bg-white/5 border-b border-forest/10 dark:border-white/10 text-xs">
            {amountNeeded > 0 ? (
              <p className="mb-2 font-medium">
                Add <strong className="text-earth">{formatPrice(amountNeeded)}</strong> more for <strong>Free Carbon-Neutral Delivery</strong>
              </p>
            ) : (
              <p className="mb-2 font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <FiTruck size={14} /> You've unlocked Free Zero-Waste Shipping! 🌿
              </p>
            )}
            <div className="w-full h-2 rounded-full bg-forest/15 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sage to-earth transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-forest/10 dark:bg-white/10 flex items-center justify-center text-forest dark:text-sage-soft">
                  <FiShoppingBag size={30} />
                </div>
                <h3 className="font-display font-semibold text-lg">Your bag is empty</h3>
                <p className="text-xs opacity-70 max-w-xs leading-relaxed">
                  Start your zero-waste lifestyle with our handcrafted, washable culinary fabric pockets.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 rounded-full bg-forest text-cream font-bold text-xs hover:bg-earth transition-colors shadow-md"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-3.5 rounded-2xl glass border border-forest/10 dark:border-white/10 flex gap-3.5 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-forest/10 dark:border-white/10 shrink-0 bg-white"
                    />

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-display font-semibold text-xs leading-snug hover:text-earth transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[11px] font-bold text-forest dark:text-sage-soft mt-0.5">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2.5 mt-2">
                        <div className="inline-flex items-center border border-forest/20 dark:border-white/20 rounded-lg overflow-hidden bg-white/50 dark:bg-black/20">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-forest/10 dark:hover:bg-white/10 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="px-2 text-xs font-bold min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-forest/10 dark:hover:bg-white/10 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>

                        <span className="text-[11px] opacity-60">
                          = {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors shrink-0"
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer Order Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-forest/10 dark:border-white/10 glass space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between opacity-75">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between opacity-75">
                  <span>Zero-Waste Shipping</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span> : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-forest/10 dark:border-white/10 text-forest dark:text-cream">
                  <span>Total Amount</span>
                  <span className="font-mono text-base text-earth">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="px-3.5 py-3 rounded-2xl border border-forest/20 dark:border-white/20 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    if (onCheckout) onCheckout();
                  }}
                  className="flex-1 py-3 px-6 rounded-2xl bg-forest text-cream hover:bg-earth font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  Checkout Now ({formatPrice(totalAmount)})
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-[10px] opacity-60">
                <span className="flex items-center gap-1"><FiShield size={12} /> 100% Secure Checkout</span>
                <span>•</span>
                <span>Plastic-Free Packing</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

