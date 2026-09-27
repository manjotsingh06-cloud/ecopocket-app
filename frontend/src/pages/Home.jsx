import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../components/ui/Reveal';
import ProductCard from '../components/ui/ProductCard';
import StatCounter from '../components/ui/StatCounter';
import api from '../api/axios';
import { PRODUCTS, formatPrice } from '../data/products';
import { FiArrowRight, FiCheckCircle, FiHeart, FiFeather, FiShield, FiZap, FiTruck, FiRefreshCw, FiAward } from 'react-icons/fi';

const HERO_IMAGE = '/images/products/quilted-sandwich-pocket.jpg';
const CATEGORY_SHOWCASE = [
  { title: 'Lunch & Bento', desc: 'Quilted rolls, totes & thermal wraps for office & outdoor meals.', img: '/images/products/artisan-bento-roll.jpg', link: '/products' },
  { title: 'Produce & Market', desc: 'Heavy-duty farmers carryalls and breathable mesh sets.', img: '/images/products/zero-waste-market-tote.jpg', link: '/products' },
  { title: 'Kitchen & Table', desc: 'Heat-retaining casserole covers, tea cozies & bread bags.', img: '/images/products/insulated-casserole-cover.jpg', link: '/products' },
];

const CURATED_LIST = PRODUCTS;

export default function Home() {
  const [products, setProducts] = useState(CURATED_LIST);
  const [weeklyLunches, setWeeklyLunches] = useState(5);

  useEffect(() => {
    api.get('/products?limit=24').then((res) => {
      if (res.data.products?.length) setProducts(res.data.products);
    }).catch(() => {});
  }, []);

  const bagsSavedPerYear = weeklyLunches * 52 * 2;
  const wasteSavedKg = ((weeklyLunches * 52 * 5) / 1000).toFixed(1);

  return (
    <div className="page-shell text-forest dark:text-cream transition-colors duration-300">
      
      {/* 1. EDITORIAL HERO SECTION (Squarespace Style) */}
      <section className="relative pt-36 sm:pt-44 pb-20 sm:pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 dark:bg-white/10 text-xs font-semibold tracking-wider uppercase text-earth">
                <FiFeather size={14} /> Mindfully Designed Zero-Waste Living
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display font-semibold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.06]">
                Modern culinary <br />
                <span className="italic font-serif font-normal text-earth">textiles for</span> mindful dining.
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="text-base sm:text-lg text-forest/85 dark:text-cream/80 max-w-xl font-normal leading-relaxed">
                Handcrafted culinary pockets and insulated food wraps crafted with GOTS-certified organic cotton and natural hemp. Designed to replace thousands of single-use plastic bags forever.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-8 py-4 rounded-full bg-forest text-cream dark:bg-cream dark:text-forest font-semibold text-sm hover:opacity-90 transition-all shadow-md flex items-center gap-2.5 group"
                >
                  Shop the Collection <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/quilting-process"
                  className="px-8 py-4 rounded-full border border-forest/30 dark:border-white/30 text-sm font-semibold hover:bg-forest/5 dark:hover:bg-white/5 transition-all text-forest dark:text-cream"
                >
                  The Quilting Craft
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="pt-6 border-t border-forest/10 dark:border-white/10 flex items-center gap-6 sm:gap-8 text-xs font-medium text-forest/80 dark:text-cream/70">
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-sage" /> 500+ Wash Cycles</span>
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-sage" /> Zero Microplastics</span>
                <span className="flex items-center gap-1.5"><FiCheckCircle className="text-sage" /> Plastic-Free Shipping</span>
              </div>
            </Reveal>
          </div>

          {/* Hero Illustration Showcase */}
          <Reveal delay={0.15} className="lg:col-span-5 relative">
            <div className="relative aspect-square rounded-[36px] overflow-hidden shadow-2xl ring-1 ring-forest-border bg-gradient-to-br from-forest via-forest-deep to-forest-deep p-8 flex flex-col justify-between group">
              <div className="flex justify-between items-start z-10">
                <span className="bg-forest-deep/90 border border-forest-border rounded-full px-4 py-2 text-xs font-bold text-cream shadow-md">
                  ✨ Hand-Quilted Design
                </span>
                <span className="w-10 h-10 rounded-full bg-forest-deep/90 border border-forest-border flex items-center justify-center text-cream">
                  <FiHeart size={18} />
                </span>
              </div>

              <div className="relative my-auto flex items-center justify-center">
                <motion.svg
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                  viewBox="0 0 400 400"
                  className="w-72 h-72 drop-shadow-2xl"
                >
                  <defs>
                    <pattern id="diamondPat" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M15 0 L30 15 L15 30 L0 15 Z" fill="none" stroke="rgba(216,217,204,0.25)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="400" height="400" fill="url(#diamondPat)" rx="20" />
                  <path d="M80 120 Q200 40 320 120 L320 280 Q200 360 80 280 Z" fill="#FAF7F2" stroke="#163024" strokeWidth="3" />
                  <path d="M120 160 Q200 110 280 160" fill="none" stroke="#3E8055" strokeWidth="2.5" strokeDasharray="4 4" />
                </motion.svg>
              </div>

              <div className="bg-forest-deep/90 border border-forest-border rounded-2xl p-4 text-xs font-medium shadow-xl flex items-center justify-between z-10">
                <div>
                  <p className="font-bold text-cream">Organic Cotton Pocket</p>
                  <p className="text-cream/70">Over 500+ wash cycles certified</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-sage text-white font-bold text-[11px]">Eco Score 95</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION MARQUEE STRIP */}
      <section className="py-7 border-y border-forest/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <FiAward size={20} className="text-earth" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-forest dark:text-cream">Artisan Crafted</h4>
            <p className="text-xs text-forest/70 dark:text-cream/60">Small batch hand-stitched</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <FiRefreshCw size={20} className="text-earth" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-forest dark:text-cream">Lifetime Washable</h4>
            <p className="text-xs text-forest/70 dark:text-cream/60">500+ machine wash guarantee</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <FiTruck size={20} className="text-earth" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-forest dark:text-cream">Plastic-Free Delivery</h4>
            <p className="text-xs text-forest/70 dark:text-cream/60">Recycled craft paper packages</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <FiShield size={20} className="text-earth" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-forest dark:text-cream">Safe & Food-Grade</h4>
            <p className="text-xs text-forest/70 dark:text-cream/60">Chemical-free botanical dyes</p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY VISUAL STORYTELLING TILES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-earth mb-2">Curated Spaces</p>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-forest dark:text-cream">Pockets for every rhythm of life</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {CATEGORY_SHOWCASE.map((cat, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <Link to={cat.link} className="group block space-y-4">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-forest/5 border border-forest/10 dark:border-white/10 relative">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 inset-x-6 text-white">
                    <h3 className="font-display font-bold text-xl mb-1 flex items-center justify-between">
                      {cat.title}
                      <FiArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-xs text-white/85 line-clamp-2">{cat.desc}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4. CURATED SHOPPING CATALOG */}
      <section className="py-24 bg-white/70 dark:bg-white/[0.02] border-y border-forest/10 dark:border-white/10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-earth mb-1">Our Collection</p>
              <h2 className="font-display font-semibold text-3xl sm:text-4xl text-forest dark:text-cream">Featured Essentials</h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-earth hover:opacity-80 transition-opacity"
            >
              Explore all 24 designs <FiArrowRight />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <ProductCard key={p._id || p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE ENVIRONMENTAL IMPACT CALCULATOR */}
      <section className="py-28 px-6 max-w-5xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-14 glass border border-forest/15 dark:border-white/10 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-earth">Zero-Waste Calculator</span>
              <h2 className="font-display font-semibold text-3xl sm:text-4xl leading-snug text-forest dark:text-cream">
                Your small daily habit, amplified.
              </h2>
              <p className="text-sm text-forest/80 dark:text-cream/70 leading-relaxed">
                By taking your lunch in an EcoPocket instead of single-use foil or plastic bags, you create real environmental change.
              </p>

              <div className="pt-4 space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-forest dark:text-cream">Packed meals per week:</span>
                  <span className="text-base text-earth font-bold">{weeklyLunches} meals</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={weeklyLunches}
                  onChange={(e) => setWeeklyLunches(Number(e.target.value))}
                  className="w-full accent-earth cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-forest/60 dark:text-cream/50 font-medium">
                  <span>1 lunch</span>
                  <span>7 lunches</span>
                  <span>14 lunches</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-forest-deep text-cream flex flex-col justify-between shadow-lg">
                <FiFeather size={24} className="text-sage-soft mb-4" />
                <div>
                  <p className="text-3xl sm:text-4xl font-display font-bold text-sage-soft">{bagsSavedPerYear}</p>
                  <p className="text-xs text-cream/75 mt-1 font-medium">Plastic bags avoided / year</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-forest/15 dark:border-white/10 flex flex-col justify-between shadow-lg">
                <FiShield size={24} className="text-earth mb-4" />
                <div>
                  <p className="text-3xl sm:text-4xl font-display font-bold text-earth">{wasteSavedKg} kg</p>
                  <p className="text-xs text-forest/75 dark:text-cream/70 mt-1 font-medium">Landfill waste prevented</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
