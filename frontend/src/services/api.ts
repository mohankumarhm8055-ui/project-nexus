import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// ── Axios instance ─────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Token helpers ──────────────────────────────────────────────────────────
export const tokenStorage = {
  getAccess: () => localStorage.getItem('nexus_access_token'),
  getRefresh: () => localStorage.getItem('nexus_refresh_token'),
  set: (access: string, refresh: string) => {
    localStorage.setItem('nexus_access_token', access);
    localStorage.setItem('nexus_refresh_token', refresh);
  },
  clear: () => {
    localStorage.removeItem('nexus_access_token');
    localStorage.removeItem('nexus_refresh_token');
  },
};

// ── Request interceptor: attach token ────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: auto-refresh on 401 ───────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      const refreshToken = tokenStorage.getRefresh();
      if (!refreshToken) {
        tokenStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
          .then((token) => { original.headers.Authorization = `Bearer ${token}`; return api(original); });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
        const payload = res.data?.data || res.data;
        const nextAccessToken = payload.token || payload.accessToken;
        const nextRefreshToken = payload.refreshToken;
        tokenStorage.set(nextAccessToken, nextRefreshToken);
        processQueue(null, nextAccessToken);
        original.headers.Authorization = `Bearer ${nextAccessToken}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError);
        tokenStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
