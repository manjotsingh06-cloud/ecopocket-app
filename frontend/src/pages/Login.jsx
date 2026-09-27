import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(form.email, form.password);
    if (res.success) navigate('/dashboard');
    else setError(res.message);
  };

  return (
    <div className="page-shell pt-40 pb-24 min-h-[75vh] flex items-center justify-center px-6">
      <Reveal className="w-full max-w-sm glass rounded-3xl p-8 border border-forest/15 dark:border-white/10 shadow-xl">
        <h1 className="font-display font-bold text-2xl text-forest dark:text-cream mb-1">Welcome back</h1>
        <p className="text-xs text-forest/75 dark:text-cream/70 mb-6">Log in to your EcoPocket account.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input required type="email" placeholder="Email Address" className="input text-xs" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required type="password" placeholder="Password" className="input text-xs" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-xs text-red-500 font-medium px-1">{error}</p>}
          <button disabled={loading} className="w-full py-3.5 rounded-full bg-earth text-cream font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-60 shadow-md">
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>
        <div className="flex justify-between text-xs mt-6 text-forest/70 dark:text-cream/70">
          <Link to="/forgot-password" className="hover:text-earth underline">Forgot password?</Link>
          <Link to="/register" className="hover:text-earth font-semibold underline">Create account</Link>
        </div>
      </Reveal>
    </div>
  );
}
