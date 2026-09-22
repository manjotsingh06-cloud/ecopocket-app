import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut, FiGrid, FiChevronDown, FiFeather } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/quilting-process', label: 'Process' },
  { to: '/sustainability', label: 'Sustainability' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/track-order', label: 'Track Order' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#FAF7F2]/90 dark:bg-[#10251B]/95 backdrop-blur-md border-b border-[#496653]/20 dark:border-[#496653] shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-xl tracking-tight text-[#10251B] dark:text-[#F7F3EA] group">
          <motion.div whileHover={{ rotate: 15 }} transition={{ type: 'spring', stiffness: 300 }}>
            <svg width="28" height="28" viewBox="0 0 26 26" fill="none" className="text-[#4F9D69] group-hover:text-[#C96B45] transition-colors">
              <path d="M4 10 Q13 2 22 10 L22 20 Q13 26 4 20 Z" fill="currentColor" fillOpacity="0.55" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
          </motion.div>
          <span>Eco<span className="text-[#C96B45]">Pocket</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative px-3.5 py-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'font-semibold text-[#10251B] bg-[#193528]/10 dark:text-[#A8C3A0] dark:bg-[#193528]'
                    : 'text-[#10251B]/80 hover:text-[#C96B45] hover:bg-[#193528]/5 dark:text-[#D8D9CC] dark:hover:text-[#A8C3A0] dark:hover:bg-[#193528]/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 rounded-full border border-[#496653]/30 dark:border-[#496653] pointer-events-none"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9, rotate: 180 }}
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-forest/15 dark:border-white/15 hover:bg-sage/20 text-forest dark:text-sage-soft transition-colors"
          >
            {dark ? <FiSun size={17} /> : <FiMoon size={17} />}
          </motion.button>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-forest/20 dark:border-white/20 hover:bg-forest/5 dark:hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-forest text-cream flex items-center justify-center font-display font-semibold text-xs shadow-sm">
                  {user.name?.[0]?.toUpperCase() || <FiUser size={14} />}
                </div>
                <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                  {user.name?.split(' ')[0]}
                </span>
                <FiChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 glass rounded-2xl p-2 shadow-xl border border-forest/10 dark:border-white/10 z-50"
                  >
                    <div className="px-3 py-2 border-b border-forest/10 dark:border-white/10 mb-1">
                      <p className="text-xs font-semibold text-forest dark:text-sage-soft truncate">{user.name}</p>
                      <p className="text-[11px] opacity-60 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium hover:bg-forest/8 dark:hover:bg-white/10 transition-colors"
                    >
                      <FiGrid size={15} /> Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium hover:bg-forest/8 dark:hover:bg-white/10 transition-colors text-earth"
                      >
                        <FiFeather size={15} /> Admin Portal
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors mt-1"
                    >
                      <FiLogOut size={15} /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-forest/20 dark:border-white/20 text-xs font-semibold hover:bg-sage/20 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4.5 py-2 rounded-full bg-forest text-cream text-xs font-semibold hover:bg-earth shadow-md shadow-forest/10 transition-all hover:scale-105"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center border border-forest/15 dark:border-white/15"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-forest/10 dark:border-white/10 glass"
          >
            <div className="flex flex-col px-6 py-5 gap-3 text-sm font-medium">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `py-2 px-3 rounded-xl transition-colors ${isActive ? 'bg-forest/10 font-bold text-forest dark:bg-white/15 dark:text-sage-soft' : 'opacity-80'}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              {!user ? (
                <div className="flex items-center gap-3 pt-3 border-t border-forest/10 dark:border-white/10">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-full border border-forest/20 text-xs font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-full bg-forest text-cream text-xs font-semibold"
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div className="pt-2 border-t border-forest/10 dark:border-white/10">
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 py-2 text-xs font-semibold text-earth"
                  >
                    <FiGrid size={15} /> Dashboard ({user.name})
                  </Link>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
