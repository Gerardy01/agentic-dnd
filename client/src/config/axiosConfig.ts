import axios from 'axios';
import useTokenStore from '@/stores/useTokenStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor: attach access token
axiosPrivate.interceptors.request.use(
  (config) => {
    const accessToken = useTokenStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto-refresh on 401
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/token')
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const res = await axiosPrivate.get('/token');
      const newAccessToken = res.data?.data?.accessToken ? res.data.data.accessToken : '';

      useTokenStore.getState().setAccessToken(newAccessToken);
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

      return axiosPrivate(originalRequest);
    } catch (err) {
      useTokenStore.getState().removeAccessToken();
      if (!['/login', '/register', '/verification'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  }
);
