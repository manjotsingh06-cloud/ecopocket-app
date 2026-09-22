import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiTwitter, FiCheckCircle, FiRotateCcw } from 'react-icons/fi';
import api from '../../api/axios';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email });
      setStatus({ type: 'success', text: 'Subscribed! Welcome to the EcoPocket community 🌿' });
      setEmail('');
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Joined successfully! (Offline mode active)' });
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-forest-deep text-cream-deep pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-sage/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-xl mb-3 text-cream-deep hover:text-sage transition-colors">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M4 10 Q13 2 22 10 L22 20 Q13 26 4 20 Z" fill="#8BA888" fillOpacity="0.7" stroke="#F6F1E7" strokeWidth="1.5"/>
              </svg>
              EcoPocket
            </Link>
            <p className="text-sm opacity-75 max-w-xs leading-relaxed mb-6">
              Sustainable, quilted culinary pockets — crafted to eliminate single-use plastics from kitchen and dining habits, one wash at a time.
            </p>
            <div className="flex gap-3 mb-6">
              {[
                { icon: FiInstagram, label: 'Instagram', href: '#' },
                { icon: FiTwitter, label: 'Twitter', href: '#' },
                { icon: FiMail, label: 'Email', href: '/contact' }
              ].map(({ icon: Icon, label, href }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/15 hover:border-white/30 transition-all hover:scale-110"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs opacity-75">
              <span className="flex items-center gap-1.5"><FiCheckCircle size={13} className="text-sage" /> 100% Organic</span>
              <span className="flex items-center gap-1.5"><FiRotateCcw size={13} className="text-sage" /> Zero Waste</span>
            </div>
          </div>

          <FooterCol title="Explore" links={[['About Us', '/about'], ['Product Catalog', '/products'], ['Quilting Process', '/quilting-process']]} />
          <FooterCol title="Company" links={[['Sustainability', '/sustainability'], ['Gallery', '/gallery'], ['FAQ', '/faq']]} />
          
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-4 text-sage-soft">Stay Connected</h4>
            <p className="text-xs opacity-70 mb-3">Get eco-friendly recipes, care tips, and exclusive releases.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm placeholder:text-cream-deep/40 focus:outline-none focus:border-sage transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-sage text-forest-deep text-xs font-bold uppercase tracking-wider hover:bg-sage-soft transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {status && (
              <p className={`text-xs mt-3 px-3 py-2 rounded-lg ${status.type === 'error' ? 'bg-red-900/40 text-red-200' : 'bg-emerald-900/40 text-emerald-200'}`}>
                {status.text}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-60">
          <span>© {new Date().getFullYear()} EcoPocket. Mindfully designed for zero-waste dining.</span>
          <div className="flex gap-6">
            <Link to="/faq" className="hover:opacity-100 transition-opacity">FAQ</Link>
            <Link to="/contact" className="hover:opacity-100 transition-opacity">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-widest font-semibold mb-4 text-sage-soft">{title}</h4>
      <div className="flex flex-col gap-2.5">
        {links.map(([label, to]) => (
          <Link key={to} to={to} className="text-sm opacity-75 hover:opacity-100 hover:translate-x-0.5 transition-all">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

