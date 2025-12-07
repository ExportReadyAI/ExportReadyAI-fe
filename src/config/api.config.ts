/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 120000, // 120 seconds (2 minutes)
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
    // AI Features
    marketIntelligence: (id: string | number) => `/products/${id}/ai/market-intelligence/`,
    pricing: (id: string | number) => `/products/${id}/ai/pricing/`,
    catalogDescription: (id: string | number) => `/products/${id}/ai/catalog-description/`,
  },
  
  // Country endpoints
  countries: {
    list: '/countries/',
    detail: (code: string) => `/countries/${code}/`,
  },
  
  // Export Analysis endpoints
  exportAnalysis: {
    list: '/export-analysis/',
    create: '/export-analysis/create/',
    detail: (id: string | number) => `/export-analysis/${id}/`,
    delete: (id: string | number) => `/export-analysis/${id}/`,
    reanalyze: (id: string | number) => `/export-analysis/${id}/reanalyze/`,
    compare: '/export-analysis/compare/',
    regulationRecommendations: (id: string | number) => `/export-analysis/${id}/regulation-recommendations/`,
  },
  
  // Costing endpoints
  costing: {
    list: '/costings/',
    create: '/costings/',
    detail: (id: string | number) => `/costings/${id}/`,
    update: (id: string | number) => `/costings/${id}/`,
    delete: (id: string | number) => `/costings/${id}/`,
    currencySettings: '/costings/currency-settings/',
  },
  
  // Buyer Request endpoints (Module 6A)
  buyerRequests: {
    list: '/buyer-requests/',
    create: '/buyer-requests/',
    detail: (id: string | number) => `/buyer-requests/${id}/`,
    update: (id: string | number) => `/buyer-requests/${id}/`,
    updateStatus: (id: string | number) => `/buyer-requests/${id}/status/`,
    delete: (id: string | number) => `/buyer-requests/${id}/`,
    matchedUMKM: (id: string | number) => `/buyer-requests/${id}/matched-umkm/`,
    matchedCatalogs: (id: string | number) => `/buyer-requests/${id}/matched-catalogs/`,
  },
  
  // Forwarder endpoints (Module 6B)
  forwarders: {
    list: '/forwarders/',
    profile: '/forwarders/profile/',
    profileMe: '/forwarders/profile/me/',
    profileUpdate: (id: string | number) => `/forwarders/profile/${id}/`,
    detail: (id: string | number) => `/forwarders/${id}/`,
    createReview: (id: string | number) => `/forwarders/${id}/reviews/`,
    updateReview: (forwarderId: string | number, reviewId: string | number) => `/forwarders/${forwarderId}/reviews/${reviewId}/`,
    deleteReview: (forwarderId: string | number, reviewId: string | number) => `/forwarders/${forwarderId}/reviews/${reviewId}/delete/`,
    recommendations: '/forwarders/recommendations/',
    statistics: (id: string | number) => `/forwarders/${id}/statistics/`,
  },
  
  // Buyer Profile endpoints (Module 6C)
  buyers: {
    list: '/buyers/',
    profile: '/buyers/profile/',
    profileMe: '/buyers/profile/me/',
    profileUpdate: (id: string | number) => `/buyers/profile/${id}/`,
    detail: (id: string | number) => `/buyers/${id}/`,
  },
  
  // Educational Materials endpoints (Module 7)
  educational: {
    modules: {
      list: '/educational/modules/',
      create: '/educational/modules/',
      detail: (id: string | number) => `/educational/modules/${id}/`,
      update: (id: string | number) => `/educational/modules/${id}/`,
      delete: (id: string | number) => `/educational/modules/${id}/`,
    },
    articles: {
      list: '/educational/articles/',
      create: '/educational/articles/',
      detail: (id: string | number) => `/educational/articles/${id}/`,
      update: (id: string | number) => `/educational/articles/${id}/`,
      delete: (id: string | number) => `/educational/articles/${id}/`,
      uploadFile: (id: string | number) => `/educational/articles/${id}/upload-file/`,
    },
  },

  // Catalog endpoints
  catalogs: {
    list: '/catalogs/',
    create: '/catalogs/',
    detail: (id: string | number) => `/catalogs/${id}/`,
    update: (id: string | number) => `/catalogs/${id}/`,
    delete: (id: string | number) => `/catalogs/${id}/`,
    // Forwarder-specific
    forwarderList: '/catalogs/forwarder/',
    // Images
    images: (catalogId: string | number) => `/catalogs/${catalogId}/images/`,
    imageDetail: (catalogId: string | number, imageId: string | number) => `/catalogs/${catalogId}/images/${imageId}/`,
    // Variant Types & Options
    variantTypes: (catalogId: string | number) => `/catalogs/${catalogId}/variant-types/`,
    variantTypeDetail: (catalogId: string | number, typeId: string | number) => `/catalogs/${catalogId}/variant-types/${typeId}/`,
    variantOptions: (catalogId: string | number, typeId: string | number) => `/catalogs/${catalogId}/variant-types/${typeId}/options/`,
    variantOptionDetail: (catalogId: string | number, typeId: string | number, optionId: string | number) => `/catalogs/${catalogId}/variant-types/${typeId}/options/${optionId}/`,
    // Public
    publicList: '/catalogs/public/',
    publicDetail: (id: string | number) => `/catalogs/public/${id}/`,
  },
} as const;


