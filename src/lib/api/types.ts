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
  timeout?: number; // Timeout in milliseconds
}

// User Types
export type UserRole = 'UMKM' | 'Admin' | 'Buyer' | 'Forwarder';

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

// ==================== Country Types ====================

export interface Country {
  country_code: string;
  country_name: string;
  region: string;
  regulations_count?: number;
  flag?: string;
}

export interface CountryRegulation {
  id: number;
  country_code: string;
  rule_key: string;
  rule_value: string;
  description: string;
  category: 'Ingredient' | 'Specification' | 'Packaging' | 'Labeling' | 'Other';
}

export interface CountryDetail extends Country {
  regulations: CountryRegulation[];
  regulations_by_category: {
    [category: string]: CountryRegulation[];
  };
}

// ==================== Export Analysis Types ====================

export type ComplianceSeverity = 'critical' | 'major' | 'minor';
export type StatusGrade = 'Ready' | 'Warning' | 'Critical';

export interface ComplianceIssue {
  id: number;
  type: string;
  severity: ComplianceSeverity;
  description: string;
  your_value?: string;
  required_value?: string;
  category: 'Ingredient' | 'Specification' | 'Packaging' | 'Labeling' | 'Other';
}

// Product Snapshot Type (captured at analysis time)
export interface ProductSnapshot {
  id: number;
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
  snapshot_created_at: string;
  updated_at?: string;
}

// Regulation Recommendations Types
export interface RegulationSection {
  summary: string;
  key_points: string[];
  details?: string;
}

export interface RegulationRecommendations {
  overview: RegulationSection;
  prohibited_items: RegulationSection;
  import_restrictions: RegulationSection;
  certifications: RegulationSection;
  labeling_requirements: RegulationSection;
  customs_procedures: RegulationSection;
  testing_inspection: RegulationSection;
  intellectual_property: RegulationSection;
  shipping_logistics: RegulationSection;
  timeline_costs: RegulationSection;
}

export interface RegulationRecommendationsResponse {
  analysis_id: number;
  country_code: string;
  product_name: string;
  from_cache: boolean;
  recommendations: RegulationRecommendations;
}

export interface ExportAnalysis {
  id: number;
  product: number; // Backend uses 'product' not 'product_id'
  product_id?: number; // Alias for backward compatibility
  product_name: string;
  product_category?: string;
  product_material?: string;
  product_packaging?: string;
  target_country_code: string;
  country_name: string;
  country_region?: string;
  readiness_score: number;
  status_grade: StatusGrade;
  compliance_issues: ComplianceIssue[];
  recommendations: string;
  analyzed_at: string;
  created_at: string;
  updated_at: string;
  // NEW: Snapshot fields
  product_snapshot?: ProductSnapshot;
  snapshot_product_name?: string;
  product_changed?: boolean;
  regulation_recommendations_cache?: RegulationRecommendations | null;
}

export interface CreateExportAnalysisRequest {
  product_id: number;
  target_country_code: string;
}

export interface CompareCountriesRequest {
  product_id: number;
  country_codes: string[]; // Max 5
}

export interface CompareCountriesResponse {
  analyses: ExportAnalysis[];
  common_issues?: ComplianceIssue[];
}

// ==================== Costing Types ====================

export interface Costing {
  id: number;
  product_id: number;
  product_name?: string;
  cogs_per_unit: number | string; // IDR (can be string from API)
  packing_cost: number | string; // IDR (can be string from API)
  target_margin_percent: number | string; // Can be string from API
  // Backend uses "recommended_" prefix
  recommended_exw_price: number | string | null;
  recommended_fob_price: number | string | null;
  recommended_cif_price: number | string | null;
  // Legacy field names (for backward compatibility)
  exw_price_usd?: number;
  fob_price_usd?: number;
  cif_price_usd?: number;
  exw_price_idr?: number;
  fob_price_idr?: number;
  cif_price_idr?: number;
  // Container info
  container_20ft_capacity: number; // Backend uses this name
  container_capacity_20ft?: number; // Legacy
  container_utilization_percent?: number; // May not be in response
  optimization_notes?: string;
  // Exchange rate (may not be in response)
  exchange_rate?: number;
  exchange_rate_source?: string;
  exchange_rate_timestamp?: string;
  calculated_at: string;
  created_at: string;
  updated_at: string;
  // Breakdown components (may not be in response)
  price_breakdown?: {
    cogs: number;
    packing: number;
    margin: number;
    trucking?: number;
    document?: number;
    freight?: number;
    insurance?: number;
  };
}

export interface CreateCostingRequest {
  product_id: number;
  cogs_per_unit: number;
  packing_cost: number;
  target_margin_percent: number;
  exchange_rate?: number; // Optional, will use current if not provided
}

export interface UpdateCostingRequest {
  cogs_per_unit: number;
  packing_cost: number;
  target_margin_percent: number;
  exchange_rate?: number;
}

export interface CurrencySettings {
  current_rate: number;
  rate_source: string;
  rate_timestamp: string;
  manual_rate?: number;
}

// ==================== Module 6: Buyer Requests Types ====================

export type BuyerRequestStatus = 'Open' | 'Matched' | 'Closed';

export interface BuyerRequest {
  id: number;
  buyer_user: number;
  buyer_email?: string;
  buyer_full_name?: string;
  product_category: string;
  hs_code_target?: string;
  spec_requirements: string;
  target_volume: number;
  destination_country: string;
  keyword_tags: string[];
  min_rank_required: number;
  status: BuyerRequestStatus;
  match_score?: number; // For UMKM view
  created_at: string;
  updated_at: string;
}

export interface CreateBuyerRequestRequest {
  product_category: string;
  hs_code_target?: string;
  spec_requirements: string;
  target_volume: number;
  destination_country: string;
  keyword_tags?: string[];
  min_rank_required?: number;
}

export interface UpdateBuyerRequestRequest extends Partial<CreateBuyerRequestRequest> {}

export interface UpdateBuyerRequestStatusRequest {
  status: BuyerRequestStatus;
}

export interface MatchedUMKM {
  umkm_id: number;
  company_name: string;
  email: string;
  contact_info?: string;
  match_score: number;
  base_score?: number;
  spec_match_score?: number;
  capability_score?: number;
  business_profile_id?: number;
}

// ==================== Module 6: Forwarder Types ====================

export interface ForwarderContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
}

export interface ForwarderProfile {
  id: number;
  user_id: number;
  company_name: string;
  contact_info: ForwarderContactInfo;
  specialization_routes: string[]; // Format: ["ID-JP", "ID-US"]
  service_types: string[]; // Format: ["Sea Freight", "Air Freight"]
  average_rating: number; // 1.0-5.0, default 0
  total_reviews: number; // default 0
  created_at: string;
  updated_at: string;
  // Additional fields for detail view
  recent_reviews?: ForwarderReview[];
  rating_distribution?: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}

export interface CreateForwarderProfileRequest {
  company_name: string;
  contact_info: ForwarderContactInfo;
  specialization_routes: string[];
  service_types: string[];
}

export interface UpdateForwarderProfileRequest extends Partial<CreateForwarderProfileRequest> {}

export interface ForwarderReview {
  id: number;
  forwarder_id: number;
  umkm_id: number;
  umkm_name?: string;
  umkm_company?: string;
  rating: number; // 1-5
  review_text?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateForwarderReviewRequest {
  rating: number;
  review_text?: string;
}

export interface UpdateForwarderReviewRequest extends CreateForwarderReviewRequest {}

export interface ForwarderStatistics {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
  total_umkm_partnerships: number;
  recent_review_trend: Array<{
    date: string;
    count: number;
  }>;
}

// ==================== Module 6: Buyer Profile Types ====================

export interface BuyerContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
}

export interface BuyerProfile {
  id: number;
  user_id: number;
  company_name: string;
  company_description?: string;
  contact_info: BuyerContactInfo;
  preferred_product_categories: string[]; // e.g., ["Makanan Olahan", "Kerajinan"]
  preferred_product_categories_description?: string;
  source_countries: string[]; // e.g., ["ID"]
  source_countries_description?: string;
  business_type?: string; // "Importir", "Distributor", "Retailer", "Trading Company"
  business_type_description?: string;
  annual_import_volume?: string; // e.g., "1000-5000 containers"
  annual_import_volume_description?: string;
  total_requests: number; // Computed field
  user_email?: string; // Computed field
  user_full_name?: string; // Computed field
  created_at: string;
  updated_at: string;
}

export interface CreateBuyerProfileRequest {
  company_name: string;
  company_description?: string;
  contact_info: BuyerContactInfo;
  preferred_product_categories: string[];
  preferred_product_categories_description?: string;
  source_countries: string[];
  source_countries_description?: string;
  business_type?: string;
  business_type_description?: string;
  annual_import_volume?: string;
  annual_import_volume_description?: string;
}

export interface UpdateBuyerProfileRequest extends Partial<CreateBuyerProfileRequest> {}

// Educational Materials Types (Module 7)
export interface EducationalArticle {
  id: number;
  module: number;
  title: string;
  content: string; // Markdown supported
  video_url?: string | null;
  file_url?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface EducationalModule {
  id: number;
  title: string;
  description?: string;
  order_index: number;
  article_count?: number;
  articles?: EducationalArticle[];
  created_at: string;
  updated_at: string;
}

export interface CreateEducationalModuleRequest {
  title: string;
  description?: string;
  order_index?: number;
}

export interface UpdateEducationalModuleRequest extends Partial<CreateEducationalModuleRequest> {}

export interface CreateEducationalArticleRequest {
  module_id: number;
  title: string;
  content: string;
  video_url?: string | null;
  file_url?: string | null;
  order_index?: number;
}

export interface UpdateEducationalArticleRequest extends Partial<Omit<CreateEducationalArticleRequest, 'module_id'>> {}


