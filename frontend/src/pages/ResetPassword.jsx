import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import api from '../api/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      if (res.data.token) {
        localStorage.setItem('ecopocket_token', res.data.token);
        setStatus('Password updated — redirecting to login…');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setStatus(err.response?.data?.message || 'That reset link is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-24 min-h-[70vh] flex items-center justify-center px-6">
      <Reveal className="w-full max-w-sm glass rounded-2xl p-8">
        <h1 className="font-display font-bold text-2xl text-forest dark:text-sage-soft mb-6">Set a new password</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input required type="password" minLength={8} placeholder="New password (min 8 characters)" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full py-3 rounded-full bg-forest text-cream font-semibold text-sm hover:bg-earth transition-colors disabled:opacity-60">
            {loading ? 'Updating…' : 'Update Password'}
          </button>
          {status && <p className="text-xs opacity-70">{status}</p>}
        </form>
      </Reveal>
    </div>
  );
}
