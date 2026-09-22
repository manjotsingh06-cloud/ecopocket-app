import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../components/ui/Reveal';
import ProductCard from '../components/ui/ProductCard';
import api from '../api/axios';
import { PRODUCTS, formatPrice } from '../data/products';
import { FiArrowLeft, FiCheck, FiShield, FiTruck, FiHeart, FiShoppingBag, FiMinus, FiPlus, FiFeather, FiCreditCard } from 'react-icons/fi';
import CheckoutModal from '../components/checkout/CheckoutModal';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [addedToast, setAddedToast] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setActiveImgIndex(0);
    api.get(`/products/${slug}`)
      .then((res) => { setProduct(res.data.product); setSimilar(res.data.similar || []); })
      .catch(() => {
        const fallbackProduct = PRODUCTS.find((item) => item.slug === slug) || null;
        setProduct(fallbackProduct);
        setSimilar(fallbackProduct ? PRODUCTS.filter((item) => item.category === fallbackProduct.category && item.slug !== slug).slice(0, 4) : []);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="pt-40 pb-24 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
        <div className="aspect-square rounded-3xl skeleton-shimmer" />
        <div className="space-y-6">
          <div className="h-6 w-24 rounded-full skeleton-shimmer" />
          <div className="h-10 w-3/4 rounded-xl skeleton-shimmer" />
          <div className="h-8 w-1/3 rounded-xl skeleton-shimmer" />
          <div className="h-24 w-full rounded-2xl skeleton-shimmer" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-40 pb-24 text-center">
        <p className="opacity-70 mb-4 font-display text-lg">We couldn't find that product — it may not be seeded in the database yet.</p>
        <Link to="/products" className="px-6 py-3 rounded-full bg-forest text-cream font-semibold text-sm">Back to products</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [{ url: null }];
  const currentImg = images[activeImgIndex]?.url;

  return (
    <div className="page-shell pt-28 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-earth hover:text-forest dark:hover:text-sage-soft mb-8 transition-colors"
        >
          <FiArrowLeft size={16} /> Back to catalog
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Gallery View */}
          <Reveal className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden glass surface-shadow border border-forest/10 dark:border-white/10 flex items-center justify-center bg-sage-soft/30 dark:bg-white/5">
              {currentImg ? (
                <img
                  src={currentImg}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                <svg viewBox="0 0 200 200" className="w-44 h-44 text-sage">
                  <path d="M25 90 Q100 30 175 90 L175 150 Q100 175 25 150 Z" fill="currentColor" fillOpacity="0.5" stroke="#1F3D2B" strokeWidth="2.5" />
                </svg>
              )}

              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                🌿 Eco Score {product.ecoScore}/100
              </span>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Wishlist"
                className={`absolute top-4 right-4 w-10 h-10 rounded-full glass shadow-md flex items-center justify-center transition-colors ${
                  isWishlisted ? 'text-red-500 bg-white/90 dark:bg-black/80' : 'text-forest dark:text-cream'
                }`}
              >
                <FiHeart size={18} className={isWishlisted ? 'fill-red-500' : ''} />
              </button>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImgIndex === idx ? 'border-forest ring-2 ring-forest/20' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Reveal>

          {/* Details Column */}
          <Reveal delay={0.1}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold tracking-widest uppercase text-earth px-3 py-1 rounded-full bg-earth/10">
                {product.category}
              </span>
              {product.fabric && (
                <span className="text-xs font-medium opacity-70">
                  {product.fabric} fabric
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl text-forest dark:text-sage-soft mb-3">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-display font-bold text-forest dark:text-sage-soft">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                In Stock & Ready to Ship
              </span>
            </div>

            <p className="opacity-80 leading-relaxed mb-6 text-sm">
              {product.description}
            </p>

            {/* Quantity Selector & Add to Pocket CTA */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-forest/20 dark:border-white/20 rounded-full px-3 py-2 glass">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 text-forest dark:text-sage-soft hover:opacity-75"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1 text-forest dark:text-sage-soft hover:opacity-75"
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsCheckoutOpen(true)}
                  className="flex-1 py-3.5 px-6 rounded-full bg-earth text-cream font-bold text-sm shadow-lg shadow-earth/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <FiCreditCard size={18} /> Buy Now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAddToCart}
                  className="py-3.5 px-5 rounded-full border border-forest/30 dark:border-white/20 text-forest dark:text-cream font-semibold text-sm hover:bg-forest/5 transition-all flex items-center justify-center gap-2"
                >
                  <FiShoppingBag size={18} /> Add to Bag
                </motion.button>
              </div>

              {/* Added Toast Notification */}
              <AnimatePresence>
                {addedToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3.5 rounded-2xl bg-emerald-900 text-emerald-100 text-xs font-medium flex items-center gap-2 shadow-md"
                  >
                    <FiCheck size={16} className="text-emerald-400 shrink-0" />
                    <span>Added {quantity} x <strong>{product.name}</strong> to your pocket bag!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Interactive Detail Tabs */}
            <div className="glass rounded-2xl p-5 border border-forest/10 dark:border-white/10 mb-6">
              <div className="flex border-b border-forest/10 dark:border-white/10 pb-3 gap-6 text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-1 transition-colors ${activeTab === 'specs' ? 'text-earth border-b-2 border-earth' : 'opacity-50 hover:opacity-100'}`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-1 transition-colors ${activeTab === 'care' ? 'text-earth border-b-2 border-earth' : 'opacity-50 hover:opacity-100'}`}
                >
                  Care & Wash
                </button>
                <button
                  onClick={() => setActiveTab('impact')}
                  className={`pb-1 transition-colors ${activeTab === 'impact' ? 'text-earth border-b-2 border-earth' : 'opacity-50 hover:opacity-100'}`}
                >
                  Impact
                </button>
              </div>

              <div className="pt-4 text-xs leading-relaxed opacity-85">
                {activeTab === 'specs' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div><span className="opacity-50 block">Fabric:</span> <strong>{product.fabric || 'Organic Cotton'}</strong></div>
                    <div><span className="opacity-50 block">Quilt Pattern:</span> <strong>{product.quiltingPattern || 'Diamond'}</strong></div>
                    <div><span className="opacity-50 block">Composition:</span> <strong>{product.materialComposition || '100% Unbleached Fiber'}</strong></div>
                    <div><span className="opacity-50 block">Eco Score:</span> <strong>{product.ecoScore}/100</strong></div>
                  </div>
                )}

                {activeTab === 'care' && (
                  <p>{product.careInstructions || 'Machine wash cold with mild detergent on gentle cycle. Tumble dry low or air dry to preserve fabric longevity.'}</p>
                )}

                {activeTab === 'impact' && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-forest dark:text-sage-soft font-semibold">
                      <FiFeather className="text-emerald-500" /> Prevents up to 500 single-use plastic bags per year.
                    </p>
                    <p>Woven using certified organic non-toxic dyes and zero synthetic liners.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-medium opacity-80">
              <span className="flex items-center gap-2"><FiTruck className="text-earth" /> Free shipping on orders over $40</span>
              <span className="flex items-center gap-2"><FiShield className="text-earth" /> 30-day eco guarantee</span>
            </div>
          </Reveal>
        </div>

        {similar.length > 0 && (
          <div className="mt-24 pt-12 border-t border-forest/10 dark:border-white/10">
            <h2 className="font-display font-bold text-2xl text-forest dark:text-sage-soft mb-8">You might also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.map((p) => (
                <ProductCard key={p._id || p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Checkout Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={product}
        quantity={quantity}
      />
    </div>
  );
}

