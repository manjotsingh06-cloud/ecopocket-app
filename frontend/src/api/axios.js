import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecopocket_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Centralize 401 handling — bounce to login if the token is invalid/expired
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ecopocket_token');
      localStorage.removeItem('ecopocket_user');
    }
    return Promise.reject(err);
  }
);

export default api;
