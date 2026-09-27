import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await register(form.name, form.email, form.password);
    if (res.success) navigate('/dashboard');
    else setError(res.message);
  };

  return (
    <div className="page-shell pt-40 pb-24 min-h-[75vh] flex items-center justify-center px-6">
      <Reveal className="w-full max-w-sm glass rounded-3xl p-8 border border-forest/15 dark:border-white/10 shadow-xl">
        <h1 className="font-display font-bold text-2xl text-forest dark:text-cream mb-1">Create your account</h1>
        <p className="text-xs text-forest/75 dark:text-cream/70 mb-6">Join EcoPocket for orders, wishlists, and more.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input required placeholder="Full name" className="input text-xs" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Email Address" className="input text-xs" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required type="password" minLength={8} placeholder="Password (min 8 characters)" className="input text-xs" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-xs text-red-500 font-medium px-1">{error}</p>}
          <button disabled={loading} className="w-full py-3.5 rounded-full bg-earth text-cream font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-60 shadow-md">
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
        <p className="text-xs mt-6 text-forest/70 dark:text-cream/70">Already have an account? <Link to="/login" className="hover:text-earth font-semibold underline">Log in</Link></p>
      </Reveal>
    </div>
  );
}
