/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
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
  // Authentication endpoints
  auth: {
    register: '/auth/register/',
    login: '/auth/login/',
    me: '/auth/me/',
    refresh: '/auth/token/refresh/',
  },
  
  // Business Profile endpoints
  businessProfile: {
    list: '/business-profile/',
    create: '/business-profile/',
    detail: (id: string | number) => `/business-profile/${id}/`,
    update: (id: string | number) => `/business-profile/${id}/`,
    certifications: (id: string | number) => `/business-profile/${id}/certifications/`,
    dashboardSummary: '/business-profile/dashboard/summary/',
  },
  
  // User Management endpoints (Admin)
  users: {
    list: '/users/',
    detail: (id: string | number) => `/users/${id}/`,
    delete: (id: string | number) => `/users/${id}/`,
  },
  
  // Product endpoints
  products: {
    list: '/products/',
    create: '/products/',
    detail: (id: string | number) => `/products/${id}/`,
    update: (id: string | number) => `/products/${id}/`,
    delete: (id: string | number) => `/products/${id}/`,
    enrich: (id: string | number) => `/products/${id}/enrich/`,
  },
} as const;


