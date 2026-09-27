import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiLock, FiLoader, FiLogOut, FiX } from 'react-icons/fi';

// Forced password-change gate. Rendered globally while the logged-in user has
// mustChangePassword = true (e.g. the seeded admin still on its default password).
export default function ChangePasswordModal() {
  const { changePassword, logout, loading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from the current one.');
      return;
    }
    const res = await changePassword(currentPassword, newPassword);
    if (!res.success) {
      setError(res.message || 'Failed to change password.');
    }
    // On success the context updates user.mustChangePassword → this modal unmounts on its own.
  };

  const inputCls =
    'w-full px-3.5 py-2.5 rounded-xl border border-forest/20 dark:border-white/15 bg-white/70 dark:bg-white/5 focus:outline-none focus:border-forest text-xs';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-cream dark:bg-forest-deep text-forest dark:text-cream border border-forest/20 dark:border-white/10 rounded-3xl shadow-2xl p-6 space-y-5">
        <div className="flex items-start justify-between border-b border-forest/10 dark:border-white/10 pb-4">
          <div>
            <p className="text-xs font-display font-semibold tracking-widest uppercase text-earth mb-1 flex items-center gap-1.5">
              <FiLock size={13} /> Security required
            </p>
            <h3 className="font-display font-bold text-lg text-forest dark:text-cream">Change your password</h3>
            <p className="text-xs opacity-60 mt-1">
              Your account still uses the published demo password. Pick a new one to continue using the dashboard.
            </p>
          </div>
          <button onClick={logout} title="Log out instead" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 shrink-0">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 opacity-80">Current password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 opacity-80">New password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 opacity-80">Confirm new password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className={inputCls}
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={logout}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-forest/25 dark:border-white/20 text-xs font-semibold hover:bg-forest/5 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <FiLogOut size={13} /> Log out for now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 w-full py-2.5 rounded-full bg-forest text-cream text-xs font-bold shadow hover:bg-earth transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? <><FiLoader className="animate-spin" size={13} /> Updating...</> : 'Update password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}