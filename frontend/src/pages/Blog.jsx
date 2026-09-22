import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import api from '../api/axios';

const CATEGORIES = ['All', 'Sustainable Living', 'Textile Innovation', 'Eco Friendly Fashion', 'Quilting Techniques', 'Zero Waste Dining'];

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = category !== 'All' ? { category } : {};
    api.get('/blogs', { params }).then((res) => setBlogs(res.data.blogs || [])).catch(() => setBlogs([])).finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-display font-semibold tracking-widest uppercase text-earth mb-3">Journal</p>
          <h1 className="font-display font-bold text-4xl text-forest dark:text-sage-soft">Reading on sustainable living</h1>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${category === c ? 'bg-forest text-cream border-forest' : 'border-forest/20 dark:border-white/20 opacity-75'}`}>
              {c}
            </button>
          ))}
        </div>

        {!loading && blogs.length === 0 && (
          <p className="text-center opacity-60 py-16">No articles published yet — add some from the admin dashboard.</p>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((b, i) => (
            <Reveal key={b._id} delay={(i % 6) * 0.06}>
              <Link to={`/blog/${b.slug}`} className="block glass rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-[16/10] bg-sage-soft/40 dark:bg-white/5 flex items-center justify-center">
                  {b.coverImage?.url ? <img src={b.coverImage.url} className="w-full h-full object-cover" /> : (
                    <svg viewBox="0 0 100 60" className="w-20"><rect width="100" height="60" fill="#8BA888" fillOpacity="0.3" /></svg>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[11px] uppercase tracking-wide text-earth font-semibold mb-2">{b.category}</p>
                  <h3 className="font-display font-semibold text-lg mb-2 leading-snug">{b.title}</h3>
                  <p className="text-sm opacity-70 line-clamp-2">{b.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
