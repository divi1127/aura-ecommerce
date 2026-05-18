import axios from 'axios';

let apiBaseURL = import.meta.env.VITE_API_URL || 'https://aura-ecommercebackend-1.onrender.com/api';

// Dynamically guarantee '/api' suffix is present
if (apiBaseURL && !apiBaseURL.endsWith('/api') && !apiBaseURL.endsWith('/api/')) {
  apiBaseURL = apiBaseURL.endsWith('/') ? `${apiBaseURL}api` : `${apiBaseURL}/api`;
}

const API = axios.create({
  baseURL: apiBaseURL,
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
