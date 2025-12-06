/**
 * API Types
 * Common types for API requests and responses
 */

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface ApiRequestConfig {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// User Types
export type UserRole = 'UMKM' | 'Admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access?: string;
  refresh?: string;
  tokens?: {
    access: string;
    refresh: string;
  };
  user: User;
}

// Business Profile Types
export type Certification = 'Halal' | 'ISO' | 'HACCP' | 'SVLK';

export interface BusinessProfile {
  id: number;
  user_id: number;
  company_name: string;
  address: string;
  production_capacity_per_month: string;
  year_established: number;
  certifications: Certification[];
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessProfileRequest {
  company_name: string;
  address: string;
  production_capacity_per_month: number | string;
  year_established: number;
}

export interface UpdateBusinessProfileRequest extends CreateBusinessProfileRequest {}

export interface UpdateCertificationsRequest {
  certifications: Certification[];
}

// Dashboard Types
export interface DashboardSummaryUMKM {
  product_count: number;
  analysis_count: number;
  costing_count: number;
  has_business_profile: boolean;
}

export interface DashboardSummaryAdmin {
  total_users: number;
  total_products: number;
  total_analysis: number;
  has_business_profile: boolean;
}

// Product Types
export interface ProductCategory {
  id: number;
  name: string;
  name_en?: string;
}

export interface ProductDimensions {
  l: number;
  w: number;
  h: number;
}

export interface QualitySpecs {
  [key: string]: any;
}

export interface ProductEnrichment {
  id: number;
  product_id: number;
  hs_code_recommendation: string;
  sku_generated: string;
  name_english_b2b: string;
  description_english_b2b: string;
  marketing_highlights: string[];
  last_updated_ai: string | null;
  is_manually_edited: boolean;
}

export interface Product {
  id: number;
  user_id: number;
  business_profile_id: number;
  name_local: string;
  category_id: number;
  category?: ProductCategory;
  description_local: string;
  material_composition: string;
  production_technique: string;
  finishing_type: string;
  quality_specs: QualitySpecs;
  durability_claim: string;
  packaging_type: string;
  dimensions_l_w_h: ProductDimensions;
  weight_net: string;
  weight_gross: string;
  enrichment?: ProductEnrichment | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name_local: string;
  category_id: number;
  description_local: string;
  material_composition: string;
  production_technique: string;
  finishing_type: string;
  quality_specs: QualitySpecs;
  durability_claim: string;
  packaging_type: string;
  dimensions_l_w_h: ProductDimensions;
  weight_net: string;
  weight_gross: string;
}

export interface UpdateProductRequest extends CreateProductRequest {}

export interface EnrichProductResponse {
  hs_code_recommendation: string;
  sku_generated: string;
  name_english_b2b: string;
  description_english_b2b: string;
  marketing_highlights: string[];
}

export interface ManualOverrideRequest {
  hs_code_recommendation?: string;
  sku_generated?: string;
  description_english_b2b?: string;
}


