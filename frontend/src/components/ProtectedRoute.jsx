import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, sessionVerified } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly) {
    // Never trust a role that came from localStorage. Wait until the server has
    // confirmed the session (fresh login or /auth/me) before rendering anything.
    if (!sessionVerified) return null;
    if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  }
  return children;
}
