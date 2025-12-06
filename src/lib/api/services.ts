/**
 * API Services
 * Reusable API service functions
 */

import apiClient from './client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  ApiResponse,
  ApiRequestConfig,
  User,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  BusinessProfile,
  CreateBusinessProfileRequest,
  UpdateBusinessProfileRequest,
  UpdateCertificationsRequest,
  DashboardSummaryUMKM,
  DashboardSummaryAdmin,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  EnrichProductResponse,
  ManualOverrideRequest,
  PaginatedResponse,
} from './types';

/**
 * Generic GET request
 */
export async function get<T>(
  url: string,
  config?: ApiRequestConfig
): Promise<ApiResponse<T> | T> {
  const response = await apiClient.get<ApiResponse<T> | T>(url, config);
  // If response.data has 'success' property, it's our ApiResponse format
  // Otherwise, it might be direct Django REST Framework response
  return response.data;
}

/**
 * Generic POST request
 */
export async function post<T, D = any>(
  url: string,
  data?: D,
  config?: ApiRequestConfig
): Promise<ApiResponse<T>> {
  const response = await apiClient.post<ApiResponse<T>>(url, data, config);
  return response.data;
}

/**
 * Generic PUT request
 */
export async function put<T, D = any>(
  url: string,
  data?: D,
  config?: ApiRequestConfig
): Promise<ApiResponse<T>> {
  const response = await apiClient.put<ApiResponse<T>>(url, data, config);
  return response.data;
}

/**
 * Generic PATCH request
 */
export async function patch<T, D = any>(
  url: string,
  data?: D,
  config?: ApiRequestConfig
): Promise<ApiResponse<T>> {
  const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
  return response.data;
}

/**
 * Generic DELETE request
 */
export async function del<T>(
  url: string,
  config?: ApiRequestConfig
): Promise<ApiResponse<T>> {
  const response = await apiClient.delete<ApiResponse<T>>(url, config);
  return response.data;
}

// ==================== Authentication Services ====================

export const authService = {
  register: (data: RegisterRequest) =>
    post<User>(API_ENDPOINTS.auth.register, data),
  
  login: (data: LoginRequest) =>
    post<LoginResponse>(API_ENDPOINTS.auth.login, data),
  
  getMe: () => get<User>(API_ENDPOINTS.auth.me),
  
  refreshToken: (refresh: string) =>
    post<{ access: string }>(API_ENDPOINTS.auth.refresh, { refresh }),
};

// ==================== Business Profile Services ====================

export const businessProfileService = {
  list: (params?: { page?: number; limit?: number; user_id?: number }) =>
    get<BusinessProfile[] | BusinessProfile>(
      API_ENDPOINTS.businessProfile.list,
      { params }
    ),
  
  get: (id: string | number) =>
    get<BusinessProfile>(API_ENDPOINTS.businessProfile.detail(id)),
  
  create: (data: CreateBusinessProfileRequest) =>
    post<BusinessProfile>(API_ENDPOINTS.businessProfile.create, data),
  
  update: (id: string | number, data: UpdateBusinessProfileRequest) =>
    put<BusinessProfile>(API_ENDPOINTS.businessProfile.update(id), data),
  
  updateCertifications: (id: string | number, data: UpdateCertificationsRequest) =>
    patch<BusinessProfile>(API_ENDPOINTS.businessProfile.certifications(id), data),
  
  getDashboardSummary: () =>
    get<DashboardSummaryUMKM | DashboardSummaryAdmin>(
      API_ENDPOINTS.businessProfile.dashboardSummary
    ),
};

// ==================== User Management Services (Admin) ====================

export const userService = {
  list: (params?: { page?: number; limit?: number; role?: string; search?: string }) =>
    get<User[]>(API_ENDPOINTS.users.list, { params }),
  
  get: (id: string | number) =>
    get<User>(API_ENDPOINTS.users.detail(id)),
  
  delete: (id: string | number) =>
    del<{ message: string }>(API_ENDPOINTS.users.delete(id)),
};

// ==================== Product Services ====================

export const productService = {
  list: (params?: { page?: number; limit?: number; category_id?: number; search?: string }) =>
    get<Product[] | { results: Product[]; count: number; next?: string; previous?: string }>(API_ENDPOINTS.products.list, { params }),
  
  get: (id: string | number) =>
    get<Product>(API_ENDPOINTS.products.detail(id)),
  
  create: (data: CreateProductRequest) =>
    post<Product>(API_ENDPOINTS.products.create, data),
  
  update: (id: string | number, data: UpdateProductRequest) =>
    put<Product>(API_ENDPOINTS.products.update(id), data),
  
  delete: (id: string | number) =>
    del<{ message: string }>(API_ENDPOINTS.products.delete(id)),
  
  enrich: (id: string | number) =>
    post<EnrichProductResponse>(API_ENDPOINTS.products.enrich(id)),
  
  manualOverride: (id: string | number, data: ManualOverrideRequest) =>
    patch<Product>(API_ENDPOINTS.products.detail(id), {
      enrichment: data,
    }),
};


