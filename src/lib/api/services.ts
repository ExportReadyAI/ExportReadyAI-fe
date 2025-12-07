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
  Country,
  CountryDetail,
  ExportAnalysis,
  CreateExportAnalysisRequest,
  CompareCountriesRequest,
  CompareCountriesResponse,
  Costing,
  CreateCostingRequest,
  UpdateCostingRequest,
  CurrencySettings,
  BuyerRequest,
  CreateBuyerRequestRequest,
  UpdateBuyerRequestRequest,
  UpdateBuyerRequestStatusRequest,
  MatchedUMKM,
  ForwarderProfile,
  CreateForwarderProfileRequest,
  UpdateForwarderProfileRequest,
  ForwarderReview,
  CreateForwarderReviewRequest,
  UpdateForwarderReviewRequest,
  ForwarderStatistics,
  BuyerProfile,
  CreateBuyerProfileRequest,
  UpdateBuyerProfileRequest,
  EducationalModule,
  EducationalArticle,
  CreateEducationalModuleRequest,
  UpdateEducationalModuleRequest,
  CreateEducationalArticleRequest,
  UpdateEducationalArticleRequest,
  MarketIntelligence,
  CreateMarketIntelligenceRequest,
  ProductPricing,
  CreateProductPricingRequest,
  Catalog,
  CreateCatalogRequest,
  UpdateCatalogRequest,
  CatalogImage,
  CreateCatalogImageRequest,
  UpdateCatalogImageRequest,
  VariantType,
  VariantOption,
  PredefinedVariantType,
  CreateVariantTypeRequest,
  UpdateVariantTypeRequest,
  CreateVariantOptionRequest,
  UpdateVariantOptionRequest,
  AIDescriptionResponse,
  GenerateAIDescriptionRequest,
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

  // AI Market Intelligence
  getMarketIntelligence: (id: string | number) =>
    get<MarketIntelligence>(API_ENDPOINTS.products.marketIntelligence(id)),

  createMarketIntelligence: (id: string | number, data?: CreateMarketIntelligenceRequest) =>
    post<MarketIntelligence>(API_ENDPOINTS.products.marketIntelligence(id), data || {}),

  // AI Pricing
  getPricing: (id: string | number) =>
    get<ProductPricing>(API_ENDPOINTS.products.pricing(id)),

  createPricing: (id: string | number, data: CreateProductPricingRequest) =>
    post<ProductPricing>(API_ENDPOINTS.products.pricing(id), data),

  // AI Catalog Description - generates export description, technical specs, safety info
  generateCatalogDescription: (id: string | number, data?: { is_food_product?: boolean }) =>
    post<AIDescriptionResponse>(
      API_ENDPOINTS.products.catalogDescription(id),
      data || {},
      { timeout: 120000 } // 2 minutes for AI processing
    ),
};

// ==================== Country Services ====================

export const countryService = {
  list: (params?: { region?: string; search?: string }) =>
    get<Country[]>(API_ENDPOINTS.countries.list, { params }),
  
  get: (code: string) =>
    get<CountryDetail>(API_ENDPOINTS.countries.detail(code)),
};

// ==================== Export Analysis Services ====================

export const exportAnalysisService = {
  list: (params?: {
    page?: number;
    limit?: number;
    country_code?: string;
    score_min?: number;
    score_max?: number;
    search?: string;
  }) =>
    get<ExportAnalysis[] | PaginatedResponse<ExportAnalysis>>(
      API_ENDPOINTS.exportAnalysis.list,
      { params }
    ),
  
  get: (id: string | number) =>
    get<ExportAnalysis>(API_ENDPOINTS.exportAnalysis.detail(id)),
  
  create: (data: CreateExportAnalysisRequest) =>
    post<ExportAnalysis>(
      API_ENDPOINTS.exportAnalysis.create,
      data,
      {
        timeout: 300000, // 5 minutes (300 seconds) for AI processing
      }
    ),
  
  delete: (id: string | number) =>
    del<{ message: string }>(API_ENDPOINTS.exportAnalysis.delete(id)),
  
  reanalyze: (id: string | number) =>
    post<ExportAnalysis>(
      API_ENDPOINTS.exportAnalysis.reanalyze(id),
      undefined,
      {
        timeout: 300000, // 5 minutes for AI processing
      }
    ),
  
  compare: (data: CompareCountriesRequest) =>
    post<CompareCountriesResponse>(API_ENDPOINTS.exportAnalysis.compare, data),
};

// ==================== Costing Services ====================

export const costingService = {
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: 'fob_price' | 'created_at';
    sort_order?: 'asc' | 'desc';
  }) =>
    get<Costing[] | PaginatedResponse<Costing>>(
      API_ENDPOINTS.costing.list,
      { params }
    ),
  
  get: (id: string | number) =>
    get<Costing>(API_ENDPOINTS.costing.detail(id)),
  
  create: (data: CreateCostingRequest) =>
    post<Costing>(API_ENDPOINTS.costing.create, data),
  
  update: (id: string | number, data: UpdateCostingRequest) =>
    put<Costing>(API_ENDPOINTS.costing.update(id), data),
  
  delete: (id: string | number) =>
    del<{ message: string }>(API_ENDPOINTS.costing.delete(id)),
  
  getCurrencySettings: () =>
    get<CurrencySettings>(API_ENDPOINTS.costing.currencySettings),
};

// ==================== Buyer Request Services (Module 6A) ====================

export const buyerRequestService = {
  list: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    destination_country?: string;
  }) =>
    get<BuyerRequest[] | { results: BuyerRequest[]; count: number; next?: string; previous?: string }>(
      API_ENDPOINTS.buyerRequests.list,
      { params }
    ),
  
  get: (id: string | number) =>
    get<BuyerRequest>(API_ENDPOINTS.buyerRequests.detail(id)),
  
  create: (data: CreateBuyerRequestRequest) =>
    post<BuyerRequest>(API_ENDPOINTS.buyerRequests.create, data),
  
  update: (id: string | number, data: UpdateBuyerRequestRequest) =>
    put<BuyerRequest>(API_ENDPOINTS.buyerRequests.update(id), data),
  
  updateStatus: (id: string | number, data: UpdateBuyerRequestStatusRequest) =>
    patch<BuyerRequest>(API_ENDPOINTS.buyerRequests.updateStatus(id), data),
  
  delete: (id: string | number) =>
    del<{ message: string }>(API_ENDPOINTS.buyerRequests.delete(id)),
  
  getMatchedUMKM: (id: string | number) =>
    get<MatchedUMKM[]>(API_ENDPOINTS.buyerRequests.matchedUMKM(id)),
};

// ==================== Forwarder Services (Module 6B) ====================

export const forwarderService = {
  list: (params?: {
    page?: number;
    limit?: number;
    destination_country?: string;
    service_type?: string;
    min_rating?: number;
    sort?: 'rating' | 'reviews' | 'name';
  }) =>
    get<ForwarderProfile[] | { results: ForwarderProfile[]; count: number; next?: string; previous?: string }>(
      API_ENDPOINTS.forwarders.list,
      { params }
    ),
  
  get: (id: string | number) =>
    get<ForwarderProfile>(API_ENDPOINTS.forwarders.detail(id)),
  
  getMyProfile: () =>
    get<ForwarderProfile>(API_ENDPOINTS.forwarders.profileMe),
  
  createProfile: (data: CreateForwarderProfileRequest) =>
    post<ForwarderProfile>(API_ENDPOINTS.forwarders.profile, data),
  
  updateProfile: (id: string | number, data: UpdateForwarderProfileRequest) =>
    put<ForwarderProfile>(API_ENDPOINTS.forwarders.profileUpdate(id), data),
  
  createReview: (forwarderId: string | number, data: CreateForwarderReviewRequest) =>
    post<ForwarderReview>(API_ENDPOINTS.forwarders.createReview(forwarderId), data),
  
  updateReview: (forwarderId: string | number, reviewId: string | number, data: UpdateForwarderReviewRequest) =>
    put<ForwarderReview>(API_ENDPOINTS.forwarders.updateReview(forwarderId, reviewId), data),
  
  deleteReview: (forwarderId: string | number, reviewId: string | number) =>
    del<{ message: string }>(API_ENDPOINTS.forwarders.deleteReview(forwarderId, reviewId)),
  
  getRecommendations: (params: { destination_country: string }) =>
    get<ForwarderProfile[]>(API_ENDPOINTS.forwarders.recommendations, { params }),
  
  getStatistics: (id: string | number) =>
    get<ForwarderStatistics>(API_ENDPOINTS.forwarders.statistics(id)),
};

// ==================== Buyer Profile Services (Module 6C) ====================

export const buyerProfileService = {
  list: (params?: {
    page?: number;
    limit?: number;
    product_category?: string;
    source_country?: string;
    business_type?: string;
    search?: string;
    sort?: 'company_name' | 'created_at';
  }) =>
    get<BuyerProfile[] | { results: BuyerProfile[]; count: number; next?: string; previous?: string } | ApiResponse<BuyerProfile[]>>(
      API_ENDPOINTS.buyers.list,
      { params }
    ),
  
  get: (id: string | number) =>
    get<BuyerProfile>(API_ENDPOINTS.buyers.detail(id)),
  
  getMyProfile: () =>
    get<BuyerProfile>(API_ENDPOINTS.buyers.profileMe),
  
  createProfile: (data: CreateBuyerProfileRequest) =>
    post<BuyerProfile>(API_ENDPOINTS.buyers.profile, data),
  
  updateProfile: (id: string | number, data: UpdateBuyerProfileRequest) =>
    put<BuyerProfile>(API_ENDPOINTS.buyers.profileUpdate(id), data),
};

// Educational Materials Service (Module 7)
export const educationalService = {
  // Modules
  modules: {
    list: (params?: { page?: number; limit?: number }) =>
      get<EducationalModule[] | ApiResponse<EducationalModule[]>>(
        API_ENDPOINTS.educational.modules.list,
        { params }
      ),
    get: (id: string | number) =>
      get<EducationalModule>(API_ENDPOINTS.educational.modules.detail(id)),
    create: (data: CreateEducationalModuleRequest) =>
      post<EducationalModule>(API_ENDPOINTS.educational.modules.create, data),
    update: (id: string | number, data: UpdateEducationalModuleRequest) =>
      put<EducationalModule>(API_ENDPOINTS.educational.modules.update(id), data),
    delete: (id: string | number) =>
      apiClient.delete(API_ENDPOINTS.educational.modules.delete(id)),
  },
  // Articles
  articles: {
    list: (params?: { module_id?: number; page?: number; limit?: number }) =>
      get<EducationalArticle[] | ApiResponse<EducationalArticle[]>>(
        API_ENDPOINTS.educational.articles.list,
        { params }
      ),
    get: (id: string | number) =>
      get<EducationalArticle>(API_ENDPOINTS.educational.articles.detail(id)),
    create: (data: CreateEducationalArticleRequest) =>
      post<EducationalArticle>(API_ENDPOINTS.educational.articles.create, data),
    update: (id: string | number, data: UpdateEducationalArticleRequest) =>
      put<EducationalArticle>(API_ENDPOINTS.educational.articles.update(id), data),
    delete: (id: string | number) =>
      apiClient.delete(API_ENDPOINTS.educational.articles.delete(id)),
    uploadFile: (id: string | number, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      // Don't set Content-Type header - axios interceptor will handle it automatically for FormData
      // The browser will set Content-Type with boundary automatically
      return apiClient.post<ApiResponse<EducationalArticle>>(
        API_ENDPOINTS.educational.articles.uploadFile(id),
        formData
      );
    },
  },
};

// ==================== Catalog Services ====================

export const catalogService = {
  // Catalog CRUD
  list: (params?: { page?: number; limit?: number }) =>
    get<Catalog[] | { results: Catalog[]; count: number }>(
      API_ENDPOINTS.catalogs.list,
      { params }
    ),

  get: (id: string | number) =>
    get<Catalog>(API_ENDPOINTS.catalogs.detail(id)),

  create: (data: CreateCatalogRequest) =>
    post<Catalog>(API_ENDPOINTS.catalogs.create, data),

  update: (id: string | number, data: UpdateCatalogRequest) =>
    put<Catalog>(API_ENDPOINTS.catalogs.update(id), data),

  delete: (id: string | number) =>
    del<{ message: string }>(API_ENDPOINTS.catalogs.delete(id)),

  // Images
  listImages: (catalogId: string | number) =>
    get<CatalogImage[]>(API_ENDPOINTS.catalogs.images(catalogId)),

  // Add image via URL
  addImage: (catalogId: string | number, data: CreateCatalogImageRequest) =>
    post<CatalogImage>(API_ENDPOINTS.catalogs.images(catalogId), data),

  // Add image via file upload
  uploadImage: (catalogId: string | number, file: File, options?: { alt_text?: string; is_primary?: boolean }) => {
    const formData = new FormData();
    formData.append('image', file);
    if (options?.alt_text) formData.append('alt_text', options.alt_text);
    if (options?.is_primary !== undefined) formData.append('is_primary', String(options.is_primary));
    return apiClient.post<ApiResponse<CatalogImage>>(
      API_ENDPOINTS.catalogs.images(catalogId),
      formData
    );
  },

  updateImage: (catalogId: string | number, imageId: string | number, data: UpdateCatalogImageRequest) =>
    put<CatalogImage>(API_ENDPOINTS.catalogs.imageDetail(catalogId, imageId), data),

  deleteImage: (catalogId: string | number, imageId: string | number) =>
    del<{ message: string }>(API_ENDPOINTS.catalogs.imageDetail(catalogId, imageId)),

  // Variant Types
  listVariantTypes: (catalogId: string | number) =>
    get<{ data: VariantType[]; predefined_types: PredefinedVariantType[] }>(API_ENDPOINTS.catalogs.variantTypes(catalogId)),

  addVariantType: (catalogId: string | number, data: CreateVariantTypeRequest) =>
    post<VariantType>(API_ENDPOINTS.catalogs.variantTypes(catalogId), data),

  updateVariantType: (catalogId: string | number, typeId: string | number, data: UpdateVariantTypeRequest) =>
    put<VariantType>(API_ENDPOINTS.catalogs.variantTypeDetail(catalogId, typeId), data),

  deleteVariantType: (catalogId: string | number, typeId: string | number) =>
    del<{ message: string }>(API_ENDPOINTS.catalogs.variantTypeDetail(catalogId, typeId)),

  // Variant Options
  listVariantOptions: (catalogId: string | number, typeId: string | number) =>
    get<VariantOption[]>(API_ENDPOINTS.catalogs.variantOptions(catalogId, typeId)),

  addVariantOption: (catalogId: string | number, typeId: string | number, data: CreateVariantOptionRequest) =>
    post<VariantOption>(API_ENDPOINTS.catalogs.variantOptions(catalogId, typeId), data),

  updateVariantOption: (catalogId: string | number, typeId: string | number, optionId: string | number, data: UpdateVariantOptionRequest) =>
    put<VariantOption>(API_ENDPOINTS.catalogs.variantOptionDetail(catalogId, typeId, optionId), data),

  deleteVariantOption: (catalogId: string | number, typeId: string | number, optionId: string | number) =>
    del<{ message: string }>(API_ENDPOINTS.catalogs.variantOptionDetail(catalogId, typeId, optionId)),

  // Public endpoints
  listPublic: () =>
    get<Catalog[]>(API_ENDPOINTS.catalogs.publicList),

  getPublic: (id: string | number) =>
    get<Catalog>(API_ENDPOINTS.catalogs.publicDetail(id)),
};


