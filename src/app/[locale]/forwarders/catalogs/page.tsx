"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { catalogService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Search, 
  Eye, 
  Package, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  DollarSign,
  Clock,
  Building2,
  Mail,
  MapPin,
  User,
  Loader2,
} from "lucide-react"
import type { ForwarderCatalog } from "@/lib/api/types"

export default function ForwarderCatalogsPage() {
  const router = useRouter()
  const { isAuthenticated, isForwarder } = useAuthStore()
  const [catalogs, setCatalogs] = useState<ForwarderCatalog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  
  // Filters
  const [search, setSearch] = useState("")
  const [tag, setTag] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [seller, setSeller] = useState("")
  
  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize] = useState(12)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)

  // Extract unique tags and sellers from catalogs
  const allTags = Array.from(new Set(catalogs.flatMap(c => c.tags || []))).filter(Boolean)
  const allSellers = Array.from(new Set(catalogs.map(c => c.seller_name).filter(Boolean)))

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token || !isAuthenticated || !isForwarder()) {
      router.push("/login")
      return
    }

    fetchCatalogs()
  }, [mounted, router, page, search, tag, minPrice, maxPrice, seller, isAuthenticated])

  const fetchCatalogs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = {
        page,
        page_size: pageSize,
      }

      if (search.trim()) {
        params.search = search.trim()
      }
      if (tag.trim()) {
        params.tag = tag.trim()
      }
      if (minPrice.trim()) {
        params.min_price = Number(minPrice)
      }
      if (maxPrice.trim()) {
        params.max_price = Number(maxPrice)
      }
      if (seller.trim()) {
        params.seller = seller.trim()
      }

      const response = await catalogService.listForForwarder(params)

      if (response && typeof response === 'object' && 'results' in response) {
        setCatalogs((response as any).results || [])
        setTotalCount((response as any).count || 0)
        setTotalPages(Math.ceil(((response as any).count || 0) / pageSize))
        setHasNext(!!(response as any).next)
        setHasPrevious(!!(response as any).previous)
      } else {
        setCatalogs([])
        setTotalCount(0)
        setTotalPages(1)
        setHasNext(false)
        setHasPrevious(false)
      }
    } catch (err: any) {
      console.error("Error fetching catalogs:", err)
      setError(
        err.response?.data?.message || 
        err.message || 
        "Gagal memuat katalog"
      )
      setCatalogs([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchCatalogs()
  }

  const handleClearFilters = () => {
    setSearch("")
    setTag("")
    setMinPrice("")
    setMaxPrice("")
    setSeller("")
    setPage(1)
  }

  const getPrimaryImage = (catalog: ForwarderCatalog) => {
    if (catalog.images && catalog.images.length > 0) {
      const primaryImage = catalog.images.find(img => img.is_primary)
      if (primaryImage) {
        return primaryImage.url || primaryImage.image_url || primaryImage.image
      }
      return catalog.images[0].url || catalog.images[0].image_url || catalog.images[0].image
    }
    return catalog.primary_image
  }

  if (!mounted) {
    return null
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
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8B5CF6] shadow-[0_4px_0_0_#7c3aed]">
                <Package className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Katalog Produk
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Lihat semua katalog yang dipublikasikan oleh UMKM
                </p>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-[#6366F1]" />
              <h3 className="font-bold text-[#0C4A6E]">Filter & Pencarian</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Search */}
              <div>
                <label className="text-sm font-bold text-[#0C4A6E] mb-2 block">Cari Katalog</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama katalog..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 rounded-xl border-2 border-[#e0f2fe]"
                  />
                </div>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="text-sm font-bold text-[#0C4A6E] mb-2 block">Tag</label>
                <Select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="rounded-xl border-2 border-[#e0f2fe]"
                >
                  <option value="">Semua Tag</option>
                  {allTags.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>

              {/* Seller Filter */}
              <div>
                <label className="text-sm font-bold text-[#0C4A6E] mb-2 block">UMKM</label>
                <Select
                  value={seller}
                  onChange={(e) => setSeller(e.target.value)}
                  className="rounded-xl border-2 border-[#e0f2fe]"
                >
                  <option value="">Semua UMKM</option>
                  {allSellers.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </div>

              {/* Min Price */}
              <div>
                <label className="text-sm font-bold text-[#0C4A6E] mb-2 block">Harga Min (USD)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="rounded-xl border-2 border-[#e0f2fe]"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="text-sm font-bold text-[#0C4A6E] mb-2 block">Harga Max (USD)</label>
                <Input
                  type="number"
                  placeholder="999999"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="rounded-xl border-2 border-[#e0f2fe]"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                className="bg-[#6366F1] hover:bg-[#4f46e5] shadow-[0_4px_0_0_#4338ca] rounded-xl"
              >
                <Search className="mr-2 h-4 w-4" />
                Cari
              </Button>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="rounded-xl border-2 border-[#e0f2fe]"
              >
                Reset Filter
              </Button>
            </div>
          </Card>

          {/* Results Count */}
          {!loading && (
            <div className="mb-4 text-sm text-[#0284C7] font-medium">
              Menampilkan {catalogs.length} dari {totalCount} katalog
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
            </div>
          )}

          {/* Catalog Grid */}
          {!loading && catalogs.length === 0 && (
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0C4A6E] mb-2">Belum ada katalog</h3>
              <p className="text-gray-500">Tidak ada katalog yang sesuai dengan filter Anda</p>
            </Card>
          )}

          {!loading && catalogs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {catalogs.map((catalog) => {
                const primaryImage = getPrimaryImage(catalog)
                return (
                  <Card
                    key={catalog.id}
                    className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] hover:shadow-[0_6px_0_0_#7DD3FC] transition-all cursor-pointer overflow-hidden flex flex-col h-full"
                    onClick={() => router.push(`/catalogs/${catalog.id}`)}
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-[#F0F9FF] to-[#e0f2fe] overflow-hidden flex-shrink-0">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={catalog.display_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-16 w-16 text-[#7DD3FC]" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-[#22C55E] text-white font-bold">
                          Published
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5 flex flex-col flex-1">
                      {/* Title */}
                      <h3 className="text-lg font-extrabold text-[#0C4A6E] mb-2 line-clamp-2">
                        {catalog.display_name}
                      </h3>

                      {/* Seller Info */}
                      <div className="mb-3 p-3 bg-[#F0F9FF] rounded-xl border border-[#e0f2fe]">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="h-4 w-4 text-[#6366F1]" />
                          <span className="text-sm font-bold text-[#0C4A6E]">{catalog.seller_name}</span>
                        </div>
                        {catalog.seller_address && (
                          <div className="flex items-center gap-2 text-xs text-[#0284C7]">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{catalog.seller_address}</span>
                          </div>
                        )}
                        {catalog.seller_email && (
                          <div className="flex items-center gap-2 text-xs text-[#0284C7] mt-1">
                            <Mail className="h-3 w-3" />
                            <span className="line-clamp-1">{catalog.seller_email}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {catalog.tags && catalog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {catalog.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {catalog.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{catalog.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Pricing & Details */}
                      <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-gradient-to-r from-[#F0F9FF] to-[#e0f2fe] rounded-xl">
                        <div>
                          <div className="text-xs text-[#0284C7] font-bold mb-1 flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            EXW Price
                          </div>
                          <div className="text-[#0C4A6E] font-extrabold">
                            ${Number(catalog.base_price_exw).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-[#0284C7] font-bold mb-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Lead Time
                          </div>
                          <div className="text-[#0C4A6E] font-extrabold">
                            {catalog.lead_time_days} hari
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-[#0284C7] font-bold mb-1 flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            MOQ
                          </div>
                          <div className="text-[#0C4A6E] font-extrabold text-sm">
                            {catalog.min_order_quantity.toLocaleString()} {catalog.unit_type}
                          </div>
                        </div>
                        {catalog.available_stock !== undefined && (
                          <div>
                            <div className="text-xs text-[#0284C7] font-bold mb-1">Stock</div>
                            <div className="text-[#0C4A6E] font-extrabold text-sm">
                              {catalog.available_stock.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* View Button - Always at bottom */}
                      <Button
                        className="w-full bg-[#8B5CF6] hover:bg-[#7c3aed] shadow-[0_4px_0_0_#6d28d9] rounded-xl mt-auto"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/catalogs/${catalog.id}`)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && catalogs.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#0284C7] font-medium">
                Halaman {page} dari {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!hasPrevious || page === 1}
                  className="rounded-xl border-2 border-[#e0f2fe]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={!hasNext || page === totalPages}
                  className="rounded-xl border-2 border-[#e0f2fe]"
                >
                  Selanjutnya
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

