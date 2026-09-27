import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ecopocket_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // True only once the *server* has confirmed the current session's identity/role
  // (a fresh login/register/change-password response or a successful /auth/me).
  // Admin UI must never be rendered from localStorage-only data.
  const [sessionVerified, setSessionVerified] = useState(false);

  // Validate the stored session against the backend on startup so stale/invalid
  // tokens are cleared and the UI reflects the true auth state.
  useEffect(() => {
    const token = localStorage.getItem('ecopocket_token');
    if (!token) {
      // A stored user without a token is stale or forged — never trust it for gating.
      if (localStorage.getItem('ecopocket_user')) {
        localStorage.removeItem('ecopocket_user');
        setUser(null);
      }
      return;
    }
    api.get('/auth/me')
      .then((res) => {
        const data = res.data?.user || res.data;
        if (data) {
          localStorage.setItem('ecopocket_user', JSON.stringify(data));
          setUser(data);
          setSessionVerified(true);
        }
      })
      .catch((err) => {
        // A required password change must NOT destroy the session (403 + code).
        if (err.response?.data?.code === 'PASSWORD_CHANGE_REQUIRED') {
          setUser((u) => {
            const flagged = { ...(u || {}), mustChangePassword: true };
            if (u) localStorage.setItem('ecopocket_user', JSON.stringify(flagged));
            return flagged;
          });
          // The token is valid and identity is confirmed — only the password needs to change.
          setSessionVerified(true);
          return;
        }
        // Only clear session if server explicitly returns 401/403 Invalid Token
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('ecopocket_token');
          localStorage.removeItem('ecopocket_user');
          setUser(null);
          setSessionVerified(false);
        }
      });
  }, []);

  const persist = (token, userData) => {
    localStorage.setItem('ecopocket_token', token);
    localStorage.setItem('ecopocket_user', JSON.stringify(userData));
    setUser(userData);
    // Login/register/change-password responses are server-issued — trust their role.
    setSessionVerified(true);
  };

  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      persist(data.token, data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true); setError(null);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      persist(data.token, data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true); setError(null);
    try {
      const { data } = await api.post('/auth/change-password', { currentPassword, newPassword });
      persist(data.token, data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to change password.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ecopocket_token');
    localStorage.removeItem('ecopocket_user');
    setUser(null);
    setSessionVerified(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, changePassword, sessionVerified, mustChangePassword: user?.mustChangePassword || false, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
