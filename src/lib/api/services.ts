/**
 * API Services
 * Reusable API service functions
 */

import apiClient from './client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { ApiResponse, ApiRequestConfig } from './types';

/**
 * Generic GET request
 */
export async function get<T>(
  url: string,
  config?: ApiRequestConfig
): Promise<ApiResponse<T>> {
  const response = await apiClient.get<ApiResponse<T>>(url, config);
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

// Example service functions for your Django backend
// Uncomment and modify as needed:

/*
export const userService = {
  getUsers: () => get(API_ENDPOINTS.users.list),
  getUser: (id: string) => get(API_ENDPOINTS.users.detail(id)),
  createUser: (data: any) => post(API_ENDPOINTS.users.create, data),
  updateUser: (id: string, data: any) => put(API_ENDPOINTS.users.update(id), data),
  deleteUser: (id: string) => del(API_ENDPOINTS.users.delete(id)),
};
*/


