import axios from 'axios';
import { environment } from './environment';

const axiosInstance = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout for cold starts
});

// Track if we're already handling a logout to prevent multiple redirects
let isHandlingLogout = false;

// Global loading state for backend cold start
let pendingRequests = 0;
const loadingListeners = new Set<(isLoading: boolean) => void>();

export const subscribeToLoading = (callback: (isLoading: boolean) => void): (() => void) => {
  loadingListeners.add(callback);
  return () => { loadingListeners.delete(callback); };
};

const notifyLoadingState = (isLoading: boolean) => {
  loadingListeners.forEach(listener => listener(isLoading));
};

const decrementPendingRequests = () => {
  pendingRequests--;
  if (pendingRequests === 0) {
    notifyLoadingState(false);
  }
};

// Request interceptor to add auth token and track loading
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    pendingRequests++;
    if (pendingRequests === 1) {
      notifyLoadingState(true);
    }

    return config;
  },
  (error) => {
    decrementPendingRequests();
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and loading state
axiosInstance.interceptors.response.use(
  (response) => {
    decrementPendingRequests();
    return response;
  },
  (error) => {
    decrementPendingRequests();

    // Handle 401 unauthorized
    if (error.response?.status === 401 && !isHandlingLogout) {
      isHandlingLogout = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.history.pushState({}, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }

      setTimeout(() => { isHandlingLogout = false; }, 1000);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
