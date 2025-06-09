import axios from 'axios';

// ✅ Για τώρα, hardcode το Railway URL
const axiosInstance = axios.create({
  baseURL: 'https://web-production-a6b6e.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;