import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setStatus(res.data.message);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-24 min-h-[70vh] flex items-center justify-center px-6">
      <Reveal className="w-full max-w-sm glass rounded-2xl p-8">
        <h1 className="font-display font-bold text-2xl text-forest dark:text-sage-soft mb-1">Reset your password</h1>
        <p className="text-sm opacity-60 mb-6">We'll email you a link to set a new password.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input required type="email" placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button disabled={loading} className="w-full py-3 rounded-full bg-forest text-cream font-semibold text-sm hover:bg-earth transition-colors disabled:opacity-60">
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
          {status && <p className="text-xs opacity-70">{status}</p>}
        </form>
        <Link to="/login" className="text-xs mt-5 inline-block underline opacity-70">Back to login</Link>
      </Reveal>
    </div>
  );
}
