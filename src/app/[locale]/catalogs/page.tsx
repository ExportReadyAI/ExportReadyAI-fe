"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { catalogService, productService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Eye,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  DollarSign,
  Package,
  Sparkles,
  Globe,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react"
import type { Catalog, Product } from "@/lib/api/types"

export default function CatalogsPage() {
  const router = useRouter()
  const { isAdmin } = useAuthStore()
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

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

    fetchCatalogs()
  }, [mounted, router, page])

  const fetchCatalogs = async () => {
    try {
      setLoading(true)
      const response = await catalogService.list({ page, limit: 12 })

      let catalogsData: Catalog[] = []
      let count = 0
      let pages = 1

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          const data = (response as any).data
          if (Array.isArray(data)) {
            catalogsData = data
            count = data.length
          } else if (data?.results) {
            catalogsData = data.results
            count = data.count || 0
            pages = Math.ceil(count / 12)
          }
        } else if ('results' in response) {
          catalogsData = (response as any).results || []
          count = (response as any).count || 0
          pages = Math.ceil(count / 12)
        } else if (Array.isArray(response)) {
          catalogsData = response
          count = response.length
        }
      }

      setCatalogs(catalogsData)
      setTotalCount(count)
      setTotalPages(pages)
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat katalog")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus katalog ini?")) return

    try {
      setDeleting(id)
      await catalogService.delete(id)
      fetchCatalogs()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menghapus katalog")
    } finally {
      setDeleting(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  if (!mounted || loading) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token && mounted) {
      return null
    }
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F9FF]">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#8B5CF6] shadow-[0_6px_0_0_#6d28d9] animate-bounce">
            <BookMarked className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-bold text-[#0C4A6E]">Memuat katalog...</p>
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
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0C4A6E] flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B5CF6] shadow-[0_4px_0_0_#6d28d9]">
                  <BookMarked className="h-6 w-6 text-white" />
                </div>
                Katalog Ekspor
              </h1>
              <p className="text-[#0284C7] font-medium mt-2">
                Kelola katalog produk untuk ekspor dengan deskripsi AI
              </p>
            </div>
            {!isAdmin() && (
              <Button
                size="lg"
                onClick={() => router.push("/catalogs/create")}
                className="bg-[#8B5CF6] hover:bg-[#7c3aed] shadow-[0_4px_0_0_#6d28d9]"
              >
                <Plus className="mr-2 h-5 w-5" />
                Buat Katalog
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {catalogs.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-12 shadow-[0_4px_0_0_#e0f2fe] text-center">
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-[#F0F9FF] mb-6">
                <BookMarked className="h-10 w-10 text-[#7DD3FC]" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0C4A6E] mb-2">
                Belum Ada Katalog
              </h3>
              <p className="text-[#0284C7] font-medium mb-6 max-w-md mx-auto">
                Buat katalog ekspor pertama Anda dengan deskripsi yang dioptimalkan oleh AI.
              </p>
              {!isAdmin() && (
                <Button
                  size="lg"
                  onClick={() => router.push("/catalogs/create")}
                  className="bg-[#8B5CF6] hover:bg-[#7c3aed] shadow-[0_4px_0_0_#6d28d9]"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Buat Katalog Pertama
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Catalogs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {catalogs.map((catalog) => (
                  <div
                    key={catalog.id}
                    className="bg-white rounded-3xl border-2 border-[#e0f2fe] overflow-hidden shadow-[0_4px_0_0_#e0f2fe] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_0_0_#e0f2fe] group"
                  >
                    {/* Image or Placeholder */}
                    <div className="relative h-40 bg-gradient-to-br from-[#8B5CF6] to-[#6d28d9]">
                      {catalog.primary_image ? (
                        <img
                          src={catalog.primary_image}
                          alt={catalog.display_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="h-16 w-16 text-white/50" />
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge
                          className={catalog.is_published
                            ? "bg-[#22C55E] text-white border-0"
                            : "bg-[#F59E0B] text-white border-0"
                          }
                        >
                          {catalog.is_published ? (
                            <>
                              <Globe className="h-3 w-3 mr-1" />
                              Published
                            </>
                          ) : (
                            "Draft"
                          )}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-extrabold text-[#0C4A6E] truncate mb-2">
                        {catalog.display_name}
                      </h3>

                      {catalog.marketing_description && (
                        <p className="text-sm text-[#0284C7] line-clamp-2 mb-3">
                          {catalog.marketing_description}
                        </p>
                      )}

                      {/* Info Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          <DollarSign className="h-3 w-3 mr-1" />
                          EXW {formatPrice(catalog.base_price_exw)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Package className="h-3 w-3 mr-1" />
                          MOQ: {catalog.min_order_quantity} {catalog.unit_type}
                        </Badge>
                        {catalog.variant_count && catalog.variant_count > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {catalog.variant_count} Varian
                          </Badge>
                        )}
                      </div>

                      {/* AI Description Status */}
                      {catalog.export_description ? (
                        <div className="flex items-center gap-2 text-xs text-[#22C55E] mb-4">
                          <Sparkles className="h-4 w-4" />
                          <span className="font-medium">AI Description Ready</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#7DD3FC] mb-4">
                          <Sparkles className="h-4 w-4" />
                          <span className="font-medium italic">Belum ada AI description</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          variant="outline"
                          onClick={() => router.push(`/catalogs/${catalog.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Detail
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => router.push(`/catalogs/${catalog.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(catalog.id)}
                          disabled={deleting === catalog.id}
                        >
                          {deleting === catalog.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_4px_0_0_#e0f2fe] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm font-medium text-[#0C4A6E]">
                    Menampilkan <span className="font-bold">{catalogs.length}</span> dari{" "}
                    <span className="font-bold">{totalCount}</span> katalog
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
                                ? "bg-[#8B5CF6] text-white shadow-[0_3px_0_0_#6d28d9]"
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
        </div>
      </main>
    </div>
  )
}
