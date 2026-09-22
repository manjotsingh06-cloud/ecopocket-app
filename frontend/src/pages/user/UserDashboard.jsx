import { useState } from 'react';
import Reveal from '../../components/ui/Reveal';
import ProductCard from '../../components/ui/ProductCard';
import { useAuth } from '../../context/AuthContext';
import { PRODUCTS } from '../../data/products';
import { FiUser, FiBookmark, FiHeart, FiMail, FiMessageSquare, FiSettings, FiLogOut, FiCheckCircle, FiShield } from 'react-icons/fi';

const TABS = [
  { id: 'Profile', label: 'My Profile', icon: FiUser },
  { id: 'Saved Products', label: 'Saved Items', icon: FiBookmark },
  { id: 'Wishlist', label: 'Wishlist', icon: FiHeart },
  { id: 'Newsletter', label: 'Newsletter', icon: FiMail },
  { id: 'Feedback', label: 'Feedback', icon: FiMessageSquare },
  { id: 'Settings', label: 'Settings', icon: FiSettings },
];

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('Profile');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [newsletterOpt, setNewsletterOpt] = useState(user?.newsletterSubscribed ?? true);

  const sampleSaved = PRODUCTS.slice(0, 2);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setFeedbackText('');
    setTimeout(() => setFeedbackSent(false), 4000);
  };

  return (
    <div className="page-shell pt-32 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="flex items-center justify-between mb-10 flex-wrap gap-4 border-b border-forest/10 dark:border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-forest text-cream font-display font-bold text-xl flex items-center justify-center shadow-lg shadow-forest/20">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-earth">Account Dashboard</p>
              <h1 className="font-display font-bold text-3xl text-forest dark:text-sage-soft">Welcome back, {user?.name?.split(' ')[0]}</h1>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full border border-forest/20 dark:border-white/20 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors"
          >
            <FiLogOut size={15} /> Log out
          </button>
        </Reveal>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* TAB SIDEBAR */}
          <Reveal delay={0.05} className="glass rounded-3xl p-3 h-fit border border-forest/10 dark:border-white/10 space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 text-xs font-semibold px-4 py-3 rounded-2xl transition-all ${
                  tab === id
                    ? 'bg-forest text-cream shadow-md'
                    : 'opacity-70 hover:opacity-100 hover:bg-forest/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </Reveal>

          {/* MAIN TAB CONTENT */}
          <Reveal delay={0.1} className="glass rounded-3xl p-8 min-h-[400px] border border-forest/10 dark:border-white/10">
            {tab === 'Profile' && (
              <div className="space-y-6 max-w-md">
                <h3 className="font-display font-bold text-xl text-forest dark:text-sage-soft mb-4">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name" value={user?.name} />
                  <Field label="Email Address" value={user?.email} />
                  <Field label="Role" value={user?.role || 'Member'} />
                  <Field label="Account Status" value="Active 🌿" />
                </div>
                <div className="p-4 rounded-2xl bg-forest/5 dark:bg-white/5 border border-forest/10 dark:border-white/10 flex items-center gap-3">
                  <FiShield size={20} className="text-earth shrink-0" />
                  <p className="text-xs opacity-75">Your personal data is encrypted and used solely for EcoPocket account features.</p>
                </div>
              </div>
            )}

            {tab === 'Saved Products' && (
              <div>
                <h3 className="font-display font-bold text-xl text-forest dark:text-sage-soft mb-4">Saved Products</h3>
                <p className="text-xs opacity-70 mb-6">Quickly access items you've bookmarked during your browsing session.</p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {sampleSaved.map((p) => (
                    <ProductCard key={p._id || p.slug} product={p} />
                  ))}
                </div>
              </div>
            )}

            {tab === 'Wishlist' && (
              <div>
                <h3 className="font-display font-bold text-xl text-forest dark:text-sage-soft mb-4">My Wishlist</h3>
                <p className="text-xs opacity-70 mb-6">Heart any item in our catalog to save it to your personal wishlist.</p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {PRODUCTS.slice(2, 4).map((p) => (
                    <ProductCard key={p._id || p.slug} product={p} />
                  ))}
                </div>
              </div>
            )}

            {tab === 'Newsletter' && (
              <div className="space-y-4 max-w-md">
                <h3 className="font-display font-bold text-xl text-forest dark:text-sage-soft mb-2">Newsletter Preferences</h3>
                <p className="text-xs opacity-75 leading-relaxed">
                  Receive our monthly EcoPocket Digest with zero-waste recipes, care guides, and exclusive discounts.
                </p>
                <label className="flex items-center gap-3 p-4 rounded-2xl bg-forest/5 dark:bg-white/5 border border-forest/10 dark:border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletterOpt}
                    onChange={(e) => setNewsletterOpt(e.target.checked)}
                    className="accent-forest w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-semibold">Subscribed to EcoPocket Newsletter</span>
                </label>
              </div>
            )}

            {tab === 'Feedback' && (
              <div className="max-w-md space-y-4">
                <h3 className="font-display font-bold text-xl text-forest dark:text-sage-soft mb-1">Share Your Experience</h3>
                <p className="text-xs opacity-75">We love hearing how EcoPocket fits into your daily zero-waste routine!</p>

                {feedbackSent ? (
                  <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
                    <FiCheckCircle size={18} className="text-emerald-400" />
                    Thank you! Your feedback has been received.
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <textarea
                      rows={5}
                      required
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Tell us what you love or how we can improve..."
                      className="input text-xs"
                    />
                    <button
                      type="submit"
                      className="px-7 py-3 rounded-full bg-forest text-cream text-xs font-bold uppercase tracking-wider hover:bg-earth transition-colors"
                    >
                      Submit Feedback
                    </button>
                  </form>
                )}
              </div>
            )}

            {tab === 'Settings' && (
              <div className="max-w-md space-y-4">
                <h3 className="font-display font-bold text-xl text-forest dark:text-sage-soft mb-2">Account Settings</h3>
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl border border-forest/10 dark:border-white/10 flex justify-between items-center">
                    <div>
                      <p className="font-bold">Password & Security</p>
                      <p className="opacity-60">Manage account authentication</p>
                    </div>
                    <button className="px-3.5 py-1.5 rounded-full border border-forest/20 font-semibold hover:bg-forest/5">Update</button>
                  </div>

                  <div className="p-4 rounded-2xl border border-forest/10 dark:border-white/10 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-red-600 dark:text-red-400">Delete Account</p>
                      <p className="opacity-60">Permanently remove profile data</p>
                    </div>
                    <button className="px-3.5 py-1.5 rounded-full border border-red-500/30 text-red-600 font-semibold hover:bg-red-50">Delete</button>
                  </div>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="p-3.5 rounded-2xl bg-forest/5 dark:bg-white/5 border border-forest/10 dark:border-white/10">
      <p className="text-[10px] uppercase font-bold tracking-wider opacity-50 mb-1">{label}</p>
      <p className="text-xs font-bold text-forest dark:text-sage-soft">{value || 'N/A'}</p>
    </div>
  );
}

