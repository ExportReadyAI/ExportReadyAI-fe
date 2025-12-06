/**
 * API Client
 * Axios instance with interceptors for request/response handling
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { apiConfig } from '@/config/api.config';

/**
 * Create axios instance with default config
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

/**
 * Request Interceptor
 * Add authentication token and other headers
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("API Request with token:", config.url, token.substring(0, 20) + "...") // Debug log
    } else {
      console.warn("API Request without token:", config.url) // Debug log
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle errors globally
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle different error status codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.error("401 Unauthorized - Request URL:", error.config?.url) // Debug log
          console.error("401 Unauthorized - Token in localStorage:", localStorage.getItem('token') ? "EXISTS" : "NOT FOUND") // Debug log
          
          if (typeof window !== 'undefined') {
            // Don't redirect if we're already on login/register page
            const currentPath = window.location.pathname
            if (currentPath !== '/login' && 
                !currentPath.includes('/register') &&
                !currentPath.includes('/login') &&
                !currentPath.includes('/en/login') &&
                !currentPath.includes('/id/login')) {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
            }
          }
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          break;
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;


