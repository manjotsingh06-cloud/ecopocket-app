import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import api from '../api/axios';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying…');

  useEffect(() => {
    api.get(`/auth/verify-email/${token}`)
      .then((res) => setStatus(res.data.message))
      .catch((err) => setStatus(err.response?.data?.message || 'Verification link is invalid or expired.'));
  }, [token]);

  return (
    <div className="pt-40 pb-24 min-h-[70vh] flex items-center justify-center px-6 text-center">
      <Reveal className="glass rounded-2xl p-10 max-w-sm">
        <h1 className="font-display font-bold text-xl text-forest dark:text-sage-soft mb-3">Email verification</h1>
        <p className="text-sm opacity-70 mb-6">{status}</p>
        <Link to="/login" className="text-sm font-semibold text-earth underline">Go to login</Link>
      </Reveal>
    </div>
  );
}
