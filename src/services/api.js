import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5005/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to dynamically inject the JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aura_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to clean up error messaging
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(message);
  }
);

export default API;
