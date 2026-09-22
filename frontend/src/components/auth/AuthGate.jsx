import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { useAuth } from '../../context/AuthContext';

export default function AuthGate() {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const switchMode = (next) => {
    setMode(next);
    setError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res =
      mode === 'login'
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password);
    if (!res.success) setError(res.message);
    // On success, user state updates and Home re-renders to show the index content.
  };

  return (
    <div className="pt-40 pb-24 min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-[15%] w-72 h-72 rounded-full bg-sage/25 blur-3xl" />
        <div className="absolute bottom-10 right-[10%] w-80 h-80 rounded-full bg-earth/15 blur-3xl" />
      </div>

      <Reveal className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <p className="eyebrow flex items-center justify-center gap-2 text-xs font-display font-semibold tracking-widest uppercase text-earth mb-3">
            <span className="w-6 h-[2px] bg-earth inline-block" /> EcoPocket
          </p>
          <h1 className="font-display font-bold text-4xl lg:text-5xl text-forest dark:text-sage-soft">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm opacity-60 mt-3 max-w-sm mx-auto">
            {mode === 'login'
              ? 'Log in to explore eco-friendly culinary pockets.'
              : 'Sign up to browse, order, and save your favorites.'}
          </p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-xl">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-forest/5 dark:bg-white/5 mb-6">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`py-2.5 rounded-full text-sm font-semibold transition-colors ${
                mode === 'login' ? 'bg-forest text-cream' : 'text-forest/70 dark:text-sage-soft/70'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`py-2.5 rounded-full text-sm font-semibold transition-colors ${
                mode === 'register' ? 'bg-forest text-cream' : 'text-forest/70 dark:text-sage-soft/70'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === 'register' && (
              <input
                required
                placeholder="Full name"
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            )}
            <input
              required
              type="email"
              placeholder="Email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              required
              type="password"
              minLength={mode === 'register' ? 8 : undefined}
              placeholder={mode === 'register' ? 'Password (min 8 characters)' : 'Password'}
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              disabled={loading}
              className="w-full py-3 rounded-full bg-forest text-cream font-semibold text-sm hover:bg-earth transition-colors disabled:opacity-60"
            >
              {loading
                ? mode === 'login'
                  ? 'Logging in…'
                  : 'Creating account…'
                : mode === 'login'
                  ? 'Log In'
                  : 'Sign Up'}
            </button>
          </form>

          <div className="flex justify-between text-xs mt-5 opacity-70">
            {mode === 'login' ? (
              <Link to="/forgot-password" className="underline">Forgot password?</Link>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="underline cursor-pointer"
            >
              {mode === 'login' ? 'Create account' : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
