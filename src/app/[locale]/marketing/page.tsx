"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { productService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  Globe,
  BarChart3,
  Loader2
} from "lucide-react"
import { MarketIntelligenceModal } from "@/components/shared/MarketIntelligenceModal"
import { PricingModal } from "@/components/shared/PricingModal"
import { NoProductModal } from "@/components/shared/NoProductModal"
import { ProductNotEnrichedModal } from "@/components/shared/ProductNotEnrichedModal"
import type { Product } from "@/lib/api/types"

const CATEGORIES = [
  { id: 1, name: "Makanan Olahan" },
  { id: 2, name: "Kerajinan Tangan" },
  { id: 3, name: "Tekstil" },
]

type TabType = "intelligence" | "pricing"

export default function MarketingPage() {
  const router = useRouter()
  const { isAdmin } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("intelligence")

  // Modal states
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [selectedProductName, setSelectedProductName] = useState<string>("")
  const [intelligenceModalOpen, setIntelligenceModalOpen] = useState(false)
  const [pricingModalOpen, setPricingModalOpen] = useState(false)
  const [noProductModalOpen, setNoProductModalOpen] = useState(false)
  const [notEnrichedModalOpen, setNotEnrichedModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    if (!token) {
      router.push("/login")
      return
    }

    fetchProducts()
  }, [mounted, router, page, searchTerm, categoryFilter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params: any = {
        page,
        limit: 12,
      }

      if (searchTerm) {
        params.search = searchTerm
      }

      if (categoryFilter !== "all") {
        params.category_id = Number(categoryFilter)
      }

      const response = await productService.list(params)

      let productsData: Product[] = []
      let totalCount = 0
      let totalPages = 1

      if (response && typeof response === 'object' && 'success' in response) {
        const apiResponse = response as any
        if (apiResponse.success) {
          if (Array.isArray(apiResponse.data)) {
            productsData = apiResponse.data
            totalCount = apiResponse.data.length
          } else if (apiResponse.data && typeof apiResponse.data === 'object' && 'results' in apiResponse.data) {
            productsData = apiResponse.data.results || []
            totalCount = apiResponse.data.count || 0
            const limit = params.limit || 12
            totalPages = Math.ceil(totalCount / limit)
          }
          if (apiResponse.pagination) {
            totalCount = apiResponse.pagination.count || totalCount
            totalPages = apiResponse.pagination.total_pages || totalPages
          }
        } else {
          setError(apiResponse.message || "Gagal memuat daftar produk")
          return
        }
      } else if (response && typeof response === 'object' && 'results' in response) {
        const djangoResponse = response as any
        productsData = Array.isArray(djangoResponse.results) ? djangoResponse.results : []
        totalCount = djangoResponse.count || productsData.length
        const limit = params.limit || 12
        totalPages = Math.ceil(totalCount / limit)
      } else if (Array.isArray(response)) {
        productsData = response
        totalCount = response.length
      } else {
        setError("Format response tidak dikenali")
        return
      }

      setProducts(productsData)
      setTotalPages(totalPages)
      setTotalCount(totalCount)
      
      // Check if there are no products on first load
      if (page === 1 && productsData.length === 0 && !searchTerm && categoryFilter === "all") {
        setNoProductModalOpen(true)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  const handleOpenIntelligence = (product: Product) => {
    // Check if product is enriched
    if (!product.is_enriched) {
      setSelectedProductId(product.id)
      setSelectedProductName(product.name_local)
      setNotEnrichedModalOpen(true)
      return
    }
    
    setSelectedProductId(product.id)
    setSelectedProductName(product.name_local)
    setIntelligenceModalOpen(true)
  }

  const handleOpenPricing = (product: Product) => {
    // Check if product is enriched
    if (!product.is_enriched) {
      setSelectedProductId(product.id)
      setSelectedProductName(product.name_local)
      setNotEnrichedModalOpen(true)
      return
    }
    
    setSelectedProductId(product.id)
    setSelectedProductName(product.name_local)
    setPricingModalOpen(true)
  }

  if (!mounted || loading) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token && mounted) {
      return null
    }
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F9FF]">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#EC4899] shadow-[0_6px_0_0_#be185d] animate-bounce">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-bold text-[#0C4A6E]">Memuat data marketing...</p>
        </div>
      </div>
    )
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) {
    return null
  }

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-[#0C4A6E] flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EC4899] shadow-[0_4px_0_0_#be185d]">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              Marketing Center
            </h1>
            <p className="text-[#0284C7] font-medium mt-2">
              Dapatkan insight pasar dan rekomendasi harga untuk produk ekspor Anda
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-2 shadow-[0_4px_0_0_#e0f2fe] mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("intelligence")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-200 ${
                  activeTab === "intelligence"
                    ? "bg-[#EC4899] text-white shadow-[0_4px_0_0_#be185d] -translate-y-0.5"
                    : "text-[#0C4A6E] hover:bg-[#F0F9FF]"
                }`}
              >
                <Globe className="h-5 w-5" />
                Market Intelligence
              </button>
              <button
                onClick={() => setActiveTab("pricing")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-200 ${
                  activeTab === "pricing"
                    ? "bg-[#22C55E] text-white shadow-[0_4px_0_0_#15803d] -translate-y-0.5"
                    : "text-[#0C4A6E] hover:bg-[#F0F9FF]"
                }`}
              >
                <DollarSign className="h-5 w-5" />
                Pricing Calculator
              </button>
            </div>
          </div>

          {/* Tab Description */}
          <div className={`rounded-3xl border-2 p-6 mb-6 ${
            activeTab === "intelligence"
              ? "bg-gradient-to-r from-[#fdf2f8] to-[#fce7f3] border-[#fbcfe8]"
              : "bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] border-[#bbf7d0]"
          }`}>
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                activeTab === "intelligence"
                  ? "bg-[#EC4899] shadow-[0_4px_0_0_#be185d]"
                  : "bg-[#22C55E] shadow-[0_4px_0_0_#15803d]"
              }`}>
                {activeTab === "intelligence" ? (
                  <BarChart3 className="h-6 w-6 text-white" />
                ) : (
                  <DollarSign className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0C4A6E]">
                  {activeTab === "intelligence"
                    ? "AI Market Intelligence"
                    : "AI Pricing Calculator"}
                </h2>
                <p className="text-[#0284C7] font-medium mt-1">
                  {activeTab === "intelligence"
                    ? "Analisis AI untuk menemukan negara tujuan ekspor terbaik, tren pasar, dan strategi masuk pasar yang optimal untuk produk Anda."
                    : "Kalkulasi harga EXW, FOB, dan CIF dengan insight AI untuk memastikan harga produk Anda kompetitif di pasar internasional."}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search & Filter Card */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#7DD3FC]" />
                <Input
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12"
                />
              </div>
              <Select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setPage(1)
                }}
                className="w-full sm:w-52"
              >
                <option value="all">Semua Kategori</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </option>
                ))}
              </Select>
              <Button type="submit" variant="secondary">
                <Search className="mr-2 h-4 w-4" />
                Cari
              </Button>
            </form>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-12 shadow-[0_4px_0_0_#e0f2fe] text-center">
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-[#F0F9FF] mb-6">
                <Package className="h-10 w-10 text-[#7DD3FC]" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0C4A6E] mb-2">
                Belum Ada Produk
              </h3>
              <p className="text-[#0284C7] font-medium mb-6 max-w-md mx-auto">
                Tambahkan produk terlebih dahulu untuk mendapatkan insight marketing dari AI.
              </p>
              {!isAdmin() && (
                <Button
                  size="lg"
                  onClick={() => router.push("/products/create")}
                >
                  Tambah Produk
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border-2 border-[#e0f2fe] overflow-hidden shadow-[0_4px_0_0_#e0f2fe] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_0_0_#e0f2fe] group"
                  >
                    {/* Card Header with Category Badge */}
                    <div className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-extrabold text-[#0C4A6E] truncate mb-1">
                            {product.name_local}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {product.category?.name || `Kategori ${product.category_id}`}
                          </Badge>
                        </div>
                        {product.enrichment && (
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B] shadow-[0_2px_0_0_#d97706]">
                            <Sparkles className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="px-5 pb-3">
                      <p className="text-sm text-[#0284C7] line-clamp-2 mb-3">
                        {product.description_local || "Tidak ada deskripsi"}
                      </p>

                      {/* Product Info */}
                      {product.enrichment ? (
                        <div className="flex flex-wrap gap-2">
                          {product.enrichment?.sku_generated && (
                            <Badge variant="outline" className="text-xs">
                              SKU: {product.enrichment.sku_generated}
                            </Badge>
                          )}
                          {product.enrichment?.hs_code_recommendation && (
                            <Badge variant="outline" className="text-xs">
                              HS: {product.enrichment.hs_code_recommendation}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-[#7DD3FC] italic">
                          Belum di-enrich oleh AI
                        </p>
                      )}
                    </div>

                    {/* Card Footer with Action Button */}
                    <div className="p-5 pt-3 border-t-2 border-[#e0f2fe]">
                      {activeTab === "intelligence" ? (
                        <Button
                          className="w-full bg-[#EC4899] hover:bg-[#db2777] shadow-[0_4px_0_0_#be185d] hover:shadow-[0_2px_0_0_#be185d] hover:translate-y-0.5"
                          onClick={() => handleOpenIntelligence(product)}
                        >
                          <Globe className="mr-2 h-4 w-4" />
                          Analisis Pasar
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-[#22C55E] hover:bg-[#16a34a] shadow-[0_4px_0_0_#15803d] hover:shadow-[0_2px_0_0_#15803d] hover:translate-y-0.5"
                          onClick={() => handleOpenPricing(product)}
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          Hitung Harga
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_4px_0_0_#e0f2fe] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm font-medium text-[#0C4A6E]">
                    Menampilkan <span className="font-bold">{products.length}</span> dari <span className="font-bold">{totalCount}</span> produk
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Sebelumnya
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i + 1
                        if (totalPages > 5) {
                          if (page > 3) {
                            pageNum = page - 2 + i
                          }
                          if (pageNum > totalPages) {
                            pageNum = totalPages - 4 + i
                          }
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`h-10 w-10 rounded-xl font-bold text-sm transition-all ${
                              page === pageNum
                                ? "bg-[#0284C7] text-white shadow-[0_3px_0_0_#065985]"
                                : "bg-[#F0F9FF] text-[#0284C7] hover:bg-[#e0f2fe]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Selanjutnya
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Modals */}
          <MarketIntelligenceModal
            productId={selectedProductId}
            productName={selectedProductName}
            open={intelligenceModalOpen}
            onOpenChange={(open) => {
              setIntelligenceModalOpen(open)
              if (!open) {
                setSelectedProductId(null)
                setSelectedProductName("")
              }
            }}
          />

          <PricingModal
            productId={selectedProductId}
            productName={selectedProductName}
            open={pricingModalOpen}
            onOpenChange={(open) => {
              setPricingModalOpen(open)
              if (!open) {
                setSelectedProductId(null)
                setSelectedProductName("")
              }
            }}
          />

          <NoProductModal
            open={noProductModalOpen}
            onOpenChange={setNoProductModalOpen}
          />

          <ProductNotEnrichedModal
            open={notEnrichedModalOpen}
            onOpenChange={setNotEnrichedModalOpen}
            productId={selectedProductId ?? undefined}
            productName={selectedProductName}
          />
        </div>
      </main>
    </div>
  )
}
