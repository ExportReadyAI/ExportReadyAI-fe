/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * API Endpoints
 * Define all your API endpoints here
 */
export const API_ENDPOINTS = {
  // Auth endpoints (if needed in future)
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  
  // Add your Django API endpoints here
  // Example:
  // users: {
  //   list: '/users',
  //   detail: (id: string) => `/users/${id}`,
  //   create: '/users',
  //   update: (id: string) => `/users/${id}`,
  //   delete: (id: string) => `/users/${id}`,
  // },
} as const;


