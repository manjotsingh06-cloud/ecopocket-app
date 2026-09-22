import { useEffect, useState } from 'react';
import Reveal from '../components/ui/Reveal';
import ProductCard from '../components/ui/ProductCard';
import api from '../api/axios';
import { PRODUCTS } from '../data/products';
import { FiSearch, FiSliders, FiX, FiRefreshCw } from 'react-icons/fi';

const CATEGORIES = ['All', ...new Set(PRODUCTS.map((product) => product.category))];
const FABRICS = ['All', 'Organic Cotton', 'Hemp', 'Linen', 'Recycled Cotton'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [fabric, setFabric] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');

  const hasActiveFilters = category !== 'All' || fabric !== 'All' || search !== '';

  const resetFilters = () => {
    setCategory('All');
    setFabric('All');
    setSearch('');
    setSort('-createdAt');
  };

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== 'All') params.category = category;
    if (fabric !== 'All') params.fabric = fabric;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    api.get('/products', { params })
      .then((res) => setProducts(res.data.products || []))
      .catch(() => {
        const query = search.trim().toLowerCase();
        const filtered = PRODUCTS.filter((product) =>
          (category === 'All' || product.category === category)
          && (fabric === 'All' || product.fabric === fabric)
          && (!query || `${product.name} ${product.description}`.toLowerCase().includes(query))
        ).sort((a, b) => {
          if (sort === 'price') return a.price - b.price;
          if (sort === '-price') return b.price - a.price;
          if (sort === '-ecoScore') return b.ecoScore - a.ecoScore;
          return Number(b._id) - Number(a._id);
        });
        setProducts(filtered);
      })
      .finally(() => setLoading(false));
  }, [category, fabric, search, sort]);

  return (
    <div className="page-shell pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <p className="eyebrow text-xs font-display font-semibold tracking-widest uppercase text-earth mb-3">
            <span className="w-5 h-[2px] bg-earth inline-block mr-2" /> Our Sustainable Collection
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-forest dark:text-sage-soft">
            Everyday essentials, thoughtfully made
          </h1>
          <p className="mt-4 text-sm leading-relaxed opacity-75">
            Explore handcrafted reusable kitchen & dining pockets designed for everyday zero-waste living.
          </p>
        </Reveal>

        <div className="glass surface-shadow rounded-3xl p-5 sm:p-6 mb-8 border border-forest/10 dark:border-white/10">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <label className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-forest/5 dark:bg-white/5 border border-forest/10 dark:border-white/10 focus-within:border-sage transition-all">
                <FiSearch className="text-earth shrink-0" size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pockets, fabrics, patterns..."
                  className="bg-transparent text-sm w-full focus:outline-none placeholder:opacity-50"
                />
                {search && (
                  <button type="button" onClick={() => setSearch('')} aria-label="Clear search" className="text-earth hover:opacity-75">
                    <FiX size={16} />
                  </button>
                )}
              </label>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-semibold px-4 py-3 rounded-2xl bg-forest/5 dark:bg-white/5 border border-forest/10 dark:border-white/10">
                <FiSliders className="text-earth" size={15} />
                <span className="opacity-70">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort products"
                  className="bg-transparent text-xs font-semibold text-forest dark:text-sage-soft focus:outline-none cursor-pointer"
                >
                  <option value="-createdAt">Newest Arrival</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-ecoScore">Highest Eco Score</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-3.5 py-3 rounded-2xl text-xs font-semibold text-earth border border-earth/20 hover:bg-earth/10 transition-colors"
                >
                  <FiRefreshCw size={13} /> Reset Filters
                </button>
              )}
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-forest/10 dark:border-white/10 space-y-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`text-xs px-4 py-1.5 rounded-full border font-medium transition-all ${
                      category === c
                        ? 'bg-forest text-cream border-forest shadow-sm'
                        : 'border-forest/20 dark:border-white/20 opacity-75 hover:opacity-100 hover:bg-forest/5'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-2">Fabric Material</p>
              <div className="flex flex-wrap gap-2">
                {FABRICS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFabric(f)}
                    className={`text-xs px-4 py-1.5 rounded-full border font-medium transition-all ${
                      fabric === f
                        ? 'bg-earth text-cream border-earth shadow-sm'
                        : 'border-forest/20 dark:border-white/20 opacity-75 hover:opacity-100 hover:bg-earth/5'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-medium opacity-70">
              Showing <span className="font-bold text-forest dark:text-sage-soft">{products.length}</span> handcrafted items
            </p>
            {hasActiveFilters && (
              <span className="text-xs text-earth font-medium">Filters Applied</span>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/4] rounded-3xl skeleton-shimmer border border-forest/10 dark:border-white/10" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto my-12">
            <p className="font-display font-semibold text-lg text-forest dark:text-sage-soft mb-2">No matching products found</p>
            <p className="text-xs opacity-70 mb-6">Try adjusting your search terms or clearing selected category filters.</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-full bg-forest text-cream text-xs font-semibold hover:bg-earth transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <Reveal key={p._id || p.slug} delay={(i % 6) * 0.05}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

