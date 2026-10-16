import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiCalendar, FiArrowRight, FiBookOpen } from 'react-icons/fi';
import Reveal from '../components/ui/Reveal';
import api from '../api/axios';
import { BLOGS, getBlogImage } from '../data/blogs';

const CATEGORIES = [
  'All',
  'Sustainable Living',
  'Textile Innovation',
  'Eco Friendly Fashion',
  'Quilting Techniques',
  'Zero Waste Dining',
];

export default function Blog() {
  // Initialize with curated articles so the page loads instantly without waiting for network
  const [blogs, setBlogs] = useState(BLOGS);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const params = category !== 'All' ? { category } : {};

    api
      .get('/blogs', { params })
      .then((res) => {
        if (!isMounted) return;
        const fetched = res.data.blogs || [];
        if (fetched.length > 0) {
          // Merge fetched blogs with fallback cover images
          const merged = fetched.map((b) => ({
            ...b,
            coverImage: {
              url: b.coverImage?.url || getBlogImage(b.slug),
            },
          }));
          setBlogs(merged);
        }
      })
      .catch(() => {
        // Keep fallback data active on network error
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category]);

  // Filter client-side for immediate responsiveness when clicking categories
  const filteredBlogs = useMemo(() => {
    if (category === 'All') return blogs;
    return blogs.filter((b) => b.category === category);
  }, [blogs, category]);

  const featured = filteredBlogs[0];
  const gridArticles = filteredBlogs.slice(1);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FAF7F2] dark:bg-[#0A1610] text-[#1D3325] dark:text-[#E8F0EA] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/8 dark:bg-white/10 text-earth font-display font-semibold text-xs tracking-wider uppercase mb-4">
            <FiBookOpen size={13} />
            <span>The Culinary Journal</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-forest dark:text-cream tracking-tight mb-4 leading-tight">
            Stories on Sustainable Living & Craft
          </h1>
          <p className="text-sm sm:text-base opacity-75 max-w-xl mx-auto leading-relaxed">
            Thoughtful essays on zero-waste kitchens, natural textile innovation, and traditional quilting craftsmanship.
          </p>
        </Reveal>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                category === c
                  ? 'bg-forest text-cream dark:bg-cream dark:text-forest shadow-md shadow-forest/10 scale-105'
                  : 'bg-white/80 dark:bg-white/5 border border-forest/15 dark:border-white/15 opacity-80 hover:opacity-100 hover:border-forest/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Featured Editorial Post */}
        {featured && (
          <Reveal className="mb-14">
            <Link
              to={`/blog/${featured.slug}`}
              className="group block bg-white dark:bg-[#11241B] rounded-3xl overflow-hidden border border-forest/10 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="grid lg:grid-cols-12 gap-0 items-stretch">
                <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-forest/5">
                  <img
                    src={featured.coverImage?.url || getBlogImage(featured.slug)}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.src = '/images/journal/why-zero-waste-dining-starts-in-the-kitchen-drawer.jpg';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-forest dark:text-cream shadow-sm">
                      Featured Story
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-earth uppercase tracking-wider mb-3">
                      <span>{featured.category}</span>
                      <span className="w-1 h-1 rounded-full bg-earth opacity-60"></span>
                      <span className="flex items-center gap-1 font-normal opacity-75">
                        <FiClock size={12} />
                        {featured.readTime || '4 min read'}
                      </span>
                    </div>

                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-forest dark:text-cream group-hover:text-earth transition-colors mb-4 leading-snug">
                      {featured.title}
                    </h2>

                    <p className="text-sm opacity-75 leading-relaxed line-clamp-3 mb-6">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-forest/10 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs opacity-70">
                      <FiCalendar size={13} />
                      <span>{featured.date || 'Recent Issue'}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest dark:text-cream group-hover:translate-x-1 transition-transform">
                      Read Article <FiArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Remaining Articles Grid */}
        {gridArticles.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridArticles.map((b, i) => {
              const imageUrl = b.coverImage?.url || getBlogImage(b.slug);
              return (
                <Reveal key={b._id || b.slug} delay={(i % 3) * 0.08}>
                  <Link
                    to={`/blog/${b.slug}`}
                    className="group flex flex-col h-full bg-white dark:bg-[#11241B] rounded-2xl overflow-hidden border border-forest/10 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-forest/5">
                      <img
                        src={imageUrl}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/images/journal/why-zero-waste-dining-starts-in-the-kitchen-drawer.jpg';
                        }}
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-forest dark:text-cream">
                        {b.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] opacity-65 mb-2.5">
                          <span className="flex items-center gap-1">
                            <FiClock size={11} /> {b.readTime || '4 min read'}
                          </span>
                          <span>•</span>
                          <span>{b.date || 'Recent Issue'}</span>
                        </div>

                        <h3 className="font-display font-bold text-lg text-forest dark:text-cream group-hover:text-earth transition-colors mb-2.5 leading-snug">
                          {b.title}
                        </h3>

                        <p className="text-xs sm:text-sm opacity-70 leading-relaxed line-clamp-2">
                          {b.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 mt-5 border-t border-forest/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-forest dark:text-cream">
                        <span className="opacity-70 font-normal">By {b.author?.name || b.author || 'EcoPocket'}</span>
                        <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-earth">
                          Read <FiArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}

        {filteredBlogs.length === 0 && (
          <div className="text-center py-20 bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-forest/20">
            <p className="text-base opacity-75 mb-4">No stories found in this category.</p>
            <button
              onClick={() => setCategory('All')}
              className="text-xs font-semibold px-4 py-2 rounded-full bg-forest text-cream hover:bg-earth transition-colors"
            >
              View All Articles
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
