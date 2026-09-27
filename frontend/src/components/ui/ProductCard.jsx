import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiHeart } from 'react-icons/fi';
import { formatPrice } from '../../data/products';

export default function ProductCard({ product }) {
  const img = product.images?.[0]?.url || '/images/products/quilted-sandwich-pocket.jpg';
  const [imageFailed, setImageFailed] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const ecoScore = product.ecoScore ?? 85;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
      <Link
        to={`/products/${product.slug}`}
        className="group block rounded-2xl overflow-hidden glass border border-forest/15 dark:border-white/10 transition-all duration-300 shadow-sm hover:shadow-xl hover:border-forest/30 dark:hover:border-white/20"
      >
        {/* High-Resolution Clean Product Frame */}
        <div className="aspect-[4/3] sm:aspect-square relative overflow-hidden bg-forest/5 dark:bg-white/5">
          <img
            src={imageFailed ? '/images/products/quilted-sandwich-pocket.jpg' : img}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />

          {/* Minimalist Eco Badge */}
          <span className="absolute top-3.5 left-3.5 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-cream/95 dark:bg-forest-deep/90 text-forest dark:text-cream shadow-sm backdrop-blur-sm border border-forest/15 dark:border-white/10">
            🌿 Eco {ecoScore}
          </span>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            aria-label="Wishlist"
            className={`absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center bg-cream/90 dark:bg-forest-deep/80 shadow-sm transition-all hover:scale-110 ${
              isWishlisted ? 'text-red-500' : 'text-forest dark:text-cream'
            }`}
          >
            <FiHeart size={14} className={isWishlisted ? 'fill-red-500' : ''} />
          </button>
        </div>

        {/* Clean Editorial Typography (Squarespace Style) */}
        <div className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] uppercase tracking-widest font-bold text-earth">
                {product.category}
              </span>
              <span className="text-[10px] font-medium text-forest/60 dark:text-cream/60">
                {product.fabric}
              </span>
            </div>

            <h3 className="font-display font-semibold text-base leading-snug text-forest dark:text-cream group-hover:text-earth transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="mt-4 pt-3 border-t border-forest/10 dark:border-white/10 flex items-center justify-between">
            <span className="font-display font-bold text-base text-forest dark:text-cream">
              {formatPrice(product.price)}
            </span>

            <span className="text-xs font-semibold text-forest dark:text-cream flex items-center gap-1 group-hover:text-earth transition-colors">
              View <FiArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
