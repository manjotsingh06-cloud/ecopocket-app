import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecopocket_token');
  if (token) {
    if (config.headers && typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Centralize 401 handling — clear storage and dispatch an event so React state updates
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ecopocket_token');
      localStorage.removeItem('ecopocket_user');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ecopocket_auth_expired'));
      }
    }
    return Promise.reject(err);
  }
);

export default api;
