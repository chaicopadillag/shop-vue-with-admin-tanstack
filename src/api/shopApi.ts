import axios, { type InternalAxiosRequestConfig } from 'axios';

const shopApi = axios.create({
  baseURL: import.meta.env.VITE_SHOP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

shopApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { shopApi };
