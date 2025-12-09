import axios from 'axios';
import { environment } from './environment';

const axiosInstance = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're already handling a logout to prevent multiple redirects
let isHandlingLogout = false;

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 if we're not already handling a logout
    if (error.response?.status === 401 && !isHandlingLogout) {
      isHandlingLogout = true;

      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Use history API instead of window.location for SPA behavior
      if (window.location.pathname !== '/login') {
        window.history.pushState({}, '', '/login');
        // Dispatch a popstate event to notify React Router
        window.dispatchEvent(new PopStateEvent('popstate'));
      }

      // Reset flag after a short delay
      setTimeout(() => {
        isHandlingLogout = false;
      }, 1000);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
