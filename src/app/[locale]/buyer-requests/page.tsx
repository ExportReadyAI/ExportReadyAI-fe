"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { buyerRequestService, countryService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Plus, 
  Search, 
  Eye, 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Globe,
  Package,
  TrendingUp,
  Edit,
  Trash2,
} from "lucide-react"
import type { BuyerRequest, Country } from "@/lib/api/types"
import { DeleteBuyerRequestModal } from "@/components/shared/DeleteBuyerRequestModal"

export default function BuyerRequestsPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin, isBuyer, isUMKM } = useAuthStore()
  const [requests, setRequests] = useState<BuyerRequest[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<BuyerRequest | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token || !isAuthenticated) {
      router.push("/login")
      return
    }

    fetchCountries()
    fetchRequests()
  }, [mounted, router, page, searchTerm, statusFilter, categoryFilter, countryFilter, isAuthenticated])

  const fetchCountries = async () => {
    try {
      const response = await countryService.list()
      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        setCountries((response as any).data || [])
      } else if (Array.isArray(response)) {
        setCountries(response)
      }
    } catch (err) {
      console.error("Error fetching countries:", err)
    }
  }

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = {
        page,
        limit: 10,
      }

      if (searchTerm) {
        params.search = searchTerm
      }

      if (statusFilter !== "all") {
        params.status = statusFilter
      }

      if (categoryFilter !== "all") {
        params.category = categoryFilter
      }

      if (countryFilter !== "all") {
        params.destination_country = countryFilter
      }

      const response = await buyerRequestService.list(params)

      let requestsData: BuyerRequest[] = []
      let totalCountValue = 0
      let totalPagesValue = 1

      // Handle different response formats
      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        requestsData = Array.isArray((response as any).data) ? (response as any).data : []
      } else if (Array.isArray(response)) {
        requestsData = response
      } else if (response && typeof response === 'object' && 'results' in response) {
        // Django REST Framework pagination format
        requestsData = (response as any).results || []
        totalCountValue = (response as any).count || 0
        totalPagesValue = Math.ceil(totalCountValue / 10) || 1
      }

      setRequests(requestsData)
      setTotalCount(totalCountValue || requestsData.length)
      setTotalPages(totalPagesValue || 1)
    } catch (err: any) {
      console.error("Error fetching buyer requests:", err)
      setError(err.response?.data?.message || err.message || "Gagal memuat data buyer requests")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedRequest) return
    await fetchRequests()
    setDeleteModalOpen(false)
    setSelectedRequest(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <Badge className="bg-[#22C55E] text-white">Open</Badge>
      case 'Matched':
        return <Badge className="bg-[#0284C7] text-white">Matched</Badge>
      case 'Closed':
        return <Badge className="bg-gray-500 text-white">Closed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (!mounted) {
    return null
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) {
    return null
  }

  // Get unique categories from requests
  const categories = Array.from(new Set(requests.map(r => r.product_category))).filter(Boolean)

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC4899] shadow-[0_4px_0_0_#be185d]">
                <ShoppingCart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Buyer Requests
                </h1>
                <p className="text-[#0284C7] font-medium">
                  {isBuyer() && "Kelola permintaan pembelian Anda"}
                  {isUMKM() && "Temukan peluang ekspor yang sesuai"}
                  {isAdmin() && "Kelola semua permintaan pembelian"}
                </p>
              </div>
            </div>
            {isBuyer() && (
              <Button 
                size="lg"
                onClick={() => router.push("/buyer-requests/create")}
                className="shadow-[0_4px_0_0_#be185d]"
              >
                <Plus className="mr-2 h-5 w-5" />
                Buat Request Baru
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-[#0284C7]" />
              <h3 className="font-bold text-[#0C4A6E]">Filter & Pencarian</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setPage(1)
                  }}
                  className="pl-10 rounded-2xl border-2 border-[#e0f2fe]"
                />
              </div>
              <Select 
                value={statusFilter} 
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                className="rounded-2xl border-2 border-[#e0f2fe]"
              >
                <option value="all">Semua Status</option>
                <option value="Open">Open</option>
                <option value="Matched">Matched</option>
                <option value="Closed">Closed</option>
              </Select>
              <Select 
                value={categoryFilter} 
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
                className="rounded-2xl border-2 border-[#e0f2fe]"
              >
                <option value="all">Semua Kategori</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
              <Select 
                value={countryFilter} 
                onChange={(e) => { setCountryFilter(e.target.value); setPage(1) }}
                className="rounded-2xl border-2 border-[#e0f2fe]"
              >
                <option value="all">Semua Negara</option>
                {countries.map(country => (
                  <option key={country.country_code} value={country.country_code}>
                    {country.country_name}
                  </option>
                ))}
              </Select>
            </div>
          </Card>

          {/* Request List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#0284C7] border-t-transparent"></div>
              <p className="mt-4 text-[#0284C7] font-medium">Memuat data...</p>
            </div>
          ) : requests.length === 0 ? (
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-12 shadow-[0_4px_0_0_#e0f2fe] text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0C4A6E] mb-2">
                Belum ada buyer request
              </h3>
              <p className="text-gray-500 mb-6">
                {isBuyer() && "Mulai dengan membuat buyer request baru"}
                {isUMKM() && "Tidak ada permintaan yang sesuai dengan kemampuan Anda"}
                {isAdmin() && "Belum ada buyer request dalam sistem"}
              </p>
              {isBuyer() && (
                <Button onClick={() => router.push("/buyer-requests/create")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Request Pertama
                </Button>
              )}
            </Card>
          ) : (
            <>
              <div className="grid gap-4 mb-6">
                {requests.map((request) => (
                  <Card 
                    key={request.id} 
                    className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] hover:shadow-[0_6px_0_0_#0284C7] transition-all cursor-pointer"
                    onClick={() => router.push(`/buyer-requests/${request.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Package className="h-5 w-5 text-[#EC4899]" />
                            <h3 className="text-xl font-extrabold text-[#0C4A6E]">
                              {request.product_category}
                            </h3>
                            {getStatusBadge(request.status)}
                            {isUMKM() && request.match_score && (
                              <Badge className="bg-[#F59E0B] text-white">
                                Match: {request.match_score}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {request.spec_requirements}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              <span>{request.destination_country}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>{request.target_volume.toLocaleString()} units</span>
                            </div>
                            {request.keyword_tags && request.keyword_tags.length > 0 && (
                              <div className="flex items-center gap-2">
                                {request.keyword_tags.slice(0, 3).map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/buyer-requests/${request.id}`)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Detail
                          </Button>
                          {isBuyer() && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/buyer-requests/${request.id}/edit`)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedRequest(request)
                                  setDeleteModalOpen(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Menampilkan {((page - 1) * 10) + 1} - {Math.min(page * 10, totalCount)} dari {totalCount} request
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-2xl"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm font-medium text-[#0C4A6E]">
                      Halaman {page} dari {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="rounded-2xl"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      {selectedRequest && (
        <DeleteBuyerRequestModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          request={selectedRequest}
          onSuccess={handleDelete}
        />
      )}
    </div>
  )
}

