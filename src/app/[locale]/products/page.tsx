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
import { Plus, Search, Eye, Package, ChevronLeft, ChevronRight, Sparkles, Rocket } from "lucide-react"
import { ProductDetailModal } from "@/components/shared/ProductDetailModal"
import type { Product } from "@/lib/api/types"
import { CATEGORIES, getCategoryName } from "@/lib/constants/categories"

export default function ProductsPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin, user } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  // Wait for component to mount and Zustand to hydrate
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    if (!mounted) return // Wait for mount

    // Check localStorage for token (most reliable check)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    // If no token in localStorage, definitely not authenticated
    if (!token) {
      console.log("No token found, redirecting to login")
      router.push("/login")
      return
    }

    // Token exists - proceed with fetching
    console.log("Token found, fetching products...")
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

      console.log("Products API Response (raw):", JSON.stringify(response, null, 2)) // Debug log

      let productsData: Product[] = []
      let totalCount = 0
      let totalPages = 1

      // Check if response has success property (our ApiResponse format)
      if (response && typeof response === 'object' && 'success' in response) {
        const apiResponse = response as any
        if (apiResponse.success) {
          // Check if response.data is an array
          if (Array.isArray(apiResponse.data)) {
            productsData = apiResponse.data
            totalCount = apiResponse.data.length
          } 
          // Check if response.data has results (Django pagination wrapped)
          else if (apiResponse.data && typeof apiResponse.data === 'object' && 'results' in apiResponse.data) {
            productsData = apiResponse.data.results || []
            totalCount = apiResponse.data.count || 0
            const limit = params.limit || 12
            totalPages = Math.ceil(totalCount / limit)
          }
          // Check pagination object
          if (apiResponse.pagination) {
            totalCount = apiResponse.pagination.count || totalCount
            totalPages = apiResponse.pagination.total_pages || totalPages
          }
        } else {
          setError(apiResponse.message || "Gagal memuat daftar produk")
          return
        }
      }
      // Check if response is direct Django REST Framework format (most common)
      else if (response && typeof response === 'object' && 'results' in response) {
        const djangoResponse = response as any
        productsData = Array.isArray(djangoResponse.results) ? djangoResponse.results : []
        totalCount = djangoResponse.count || productsData.length
        const limit = params.limit || 12
        totalPages = Math.ceil(totalCount / limit)
      }
      // Fallback: treat as array if it's an array
      else if (Array.isArray(response)) {
        productsData = response
        totalCount = response.length
      }
      else {
        console.error("Unknown response structure:", response)
        setError("Format response tidak dikenali. Check console untuk detail.")
        return
      }

      console.log("✅ Parsed successfully - Products:", productsData.length, "items") // Debug log
      console.log("✅ Total count:", totalCount, "Total pages:", totalPages) // Debug log

      setProducts(productsData)
      setTotalPages(totalPages)
      setTotalCount(totalCount)
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

  // Show loading while mounting or if no token
  if (!mounted || loading) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token && mounted) {
      return null
    }
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F9FF]">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#F59E0B] shadow-[0_6px_0_0_#d97706] animate-bounce">
            <Package className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-bold text-[#0C4A6E]">Memuat produk...</p>
        </div>
      </div>
    )
  }

  // Check authentication one more time before rendering
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0C4A6E] flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F59E0B] shadow-[0_4px_0_0_#d97706]">
                  <Package className="h-6 w-6 text-white" />
                </div>
                Produk Saya
              </h1>
              <p className="text-[#0284C7] font-medium mt-2">
                Kelola dan analisis produk ekspor Anda
              </p>
            </div>
            {!isAdmin() && (
              <Button 
                size="lg"
                onClick={() => router.push("/products/create")}
                className="shadow-[0_4px_0_0_#065985]"
              >
                <Plus className="mr-2 h-5 w-5" />
                Tambah Produk
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="mb-6 bg-[#f0fdf4] border-[#22c55e] text-[#166534]">
              <AlertDescription className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                {successMessage}
              </AlertDescription>
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
            /* Empty State */
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-12 shadow-[0_4px_0_0_#e0f2fe] text-center">
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-[#F0F9FF] mb-6">
                <Package className="h-10 w-10 text-[#7DD3FC]" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0C4A6E] mb-2">
                Belum Ada Produk 📦
              </h3>
              <p className="text-[#0284C7] font-medium mb-6 max-w-md mx-auto">
                Mulai dengan menambahkan produk pertama Anda untuk dianalisis oleh AI kami.
              </p>
              {!isAdmin() && (
                <Button 
                  size="lg"
                  onClick={() => router.push("/products/create")}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Tambah Produk Pertama
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
                            {product.category?.name || getCategoryName(product.category_id)}
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
                      
                      {/* AI Results Preview */}
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
                          AI belum dijalankan
                        </p>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 pt-3 border-t-2 border-[#e0f2fe]">
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                          setSelectedProductId(product.id)
                          setDetailModalOpen(true)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </Button>
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

          <ProductDetailModal
            productId={selectedProductId}
            open={detailModalOpen}
            onOpenChange={(open) => {
              setDetailModalOpen(open)
              if (!open) {
                setSelectedProductId(null)
              }
            }}
            onProductUpdated={() => {
              fetchProducts() // Refresh list after update
            }}
            onProductDeleted={() => {
              setSuccessMessage("✅ Produk berhasil dihapus!")
              fetchProducts() // Refresh list after delete
            }}
          />
        </div>
      </main>
    </div>
  )
}
