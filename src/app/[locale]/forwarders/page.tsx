"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { forwarderService } from "@/lib/api/services"
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
  Truck, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Star,
  Globe,
  Package,
  Edit,
} from "lucide-react"
import type { ForwarderProfile } from "@/lib/api/types"

export default function ForwardersPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin, isUMKM, isForwarder } = useAuthStore()
  const [forwarders, setForwarders] = useState<ForwarderProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [destinationCountry, setDestinationCountry] = useState<string>("")
  const [serviceType, setServiceType] = useState<string>("")
  const [minRating, setMinRating] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("rating")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [mounted, setMounted] = useState(false)

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

    fetchForwarders()
  }, [mounted, router, page, destinationCountry, serviceType, minRating, sortBy, isAuthenticated])

  const fetchForwarders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = {
        page,
        limit: 12,
        sort: sortBy,
      }

      if (destinationCountry) {
        params.destination_country = destinationCountry
      }

      if (serviceType) {
        params.service_type = serviceType
      }

      if (minRating) {
        params.min_rating = Number(minRating)
      }

      const response = await forwarderService.list(params)

      let forwardersData: ForwarderProfile[] = []
      let totalCountValue = 0
      let totalPagesValue = 1

      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        forwardersData = Array.isArray((response as any).data) ? (response as any).data : []
      } else if (Array.isArray(response)) {
        forwardersData = response
      } else if (response && typeof response === 'object' && 'results' in response) {
        forwardersData = (response as any).results || []
        totalCountValue = (response as any).count || 0
        totalPagesValue = Math.ceil(totalCountValue / 12) || 1
      }

      // Filter by search term client-side if needed
      if (searchTerm) {
        forwardersData = forwardersData.filter(f => 
          f.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.service_types.some(st => st.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      }

      setForwarders(forwardersData)
      setTotalCount(totalCountValue || forwardersData.length)
      setTotalPages(totalPagesValue || 1)
    } catch (err: any) {
      console.error("Error fetching forwarders:", err)
      setError(err.response?.data?.message || err.message || "Gagal memuat data forwarders")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) {
    return null
  }

  const serviceTypes = Array.from(new Set(forwarders.flatMap(f => f.service_types))).filter(Boolean)

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6366F1] shadow-[0_4px_0_0_#4f46e5]">
                <Truck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Forwarder Directory
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Temukan forwarder terpercaya untuk pengiriman ekspor Anda
                </p>
              </div>
            </div>
            {isForwarder() && (
              <Button 
                size="lg"
                onClick={() => router.push("/forwarders/my-profile")}
                className="shadow-[0_4px_0_0_#4f46e5]"
              >
                <Plus className="mr-2 h-5 w-5" />
                Profil Saya
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari forwarder..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setPage(1)
                    fetchForwarders()
                  }}
                  className="pl-10 rounded-2xl border-2 border-[#e0f2fe]"
                />
              </div>
              <Input
                placeholder="Negara tujuan (contoh: JP)"
                value={destinationCountry}
                onChange={(e) => {
                  setDestinationCountry(e.target.value)
                  setPage(1)
                }}
                className="rounded-2xl border-2 border-[#e0f2fe]"
              />
              <Select 
                value={serviceType} 
                onChange={(e) => { setServiceType(e.target.value); setPage(1) }}
                className="rounded-2xl border-2 border-[#e0f2fe]"
              >
                <option value="">Semua Layanan</option>
                {serviceTypes.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </Select>
              <Select 
                value={minRating} 
                onChange={(e) => { setMinRating(e.target.value); setPage(1) }}
                className="rounded-2xl border-2 border-[#e0f2fe]"
              >
                <option value="">Semua Rating</option>
                <option value="4">4.0+</option>
                <option value="3">3.0+</option>
                <option value="2">2.0+</option>
              </Select>
              <Select 
                value={sortBy} 
                onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
                className="rounded-2xl border-2 border-[#e0f2fe]"
              >
                <option value="rating">Rating Tertinggi</option>
                <option value="reviews">Review Terbanyak</option>
                <option value="name">Nama A-Z</option>
              </Select>
            </div>
          </Card>

          {/* Forwarder Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#0284C7] border-t-transparent"></div>
              <p className="mt-4 text-[#0284C7] font-medium">Memuat data...</p>
            </div>
          ) : forwarders.length === 0 ? (
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-12 shadow-[0_4px_0_0_#e0f2fe] text-center">
              <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0C4A6E] mb-2">
                Belum ada forwarder
              </h3>
              <p className="text-gray-500">
                Tidak ada forwarder yang sesuai dengan filter Anda
              </p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {forwarders.map((forwarder) => (
                  <Card 
                    key={forwarder.id} 
                    className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] hover:shadow-[0_6px_0_0_#6366F1] transition-all cursor-pointer"
                    onClick={() => router.push(`/forwarders/${forwarder.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-extrabold text-[#0C4A6E] mb-2">
                            {forwarder.company_name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(Number(forwarder.average_rating) || 0)
                                      ? 'text-[#F59E0B] fill-[#F59E0B]'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-bold text-[#0C4A6E]">
                              {Number(forwarder.average_rating) > 0 ? Number(forwarder.average_rating).toFixed(1) : '0.0'}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({forwarder.total_reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Globe className="h-4 w-4 text-[#0284C7]" />
                          <span className="font-medium">Routes:</span>
                          <span className="text-xs">
                            {forwarder.specialization_routes.slice(0, 3).join(', ')}
                            {forwarder.specialization_routes.length > 3 && '...'}
                          </span>
                        </div>
                        <div className="flex items-start gap-1 text-sm text-gray-600">
                          <Package className="h-4 w-4 text-[#6366F1] mt-0.5" />
                          <div className="flex-1">
                            <span className="font-medium">Services: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {forwarder.service_types.slice(0, 2).map((st, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {st}
                                </Badge>
                              ))}
                              {forwarder.service_types.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{forwarder.service_types.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-2xl"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/forwarders/${forwarder.id}`)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Menampilkan {((page - 1) * 12) + 1} - {Math.min(page * 12, totalCount)} dari {totalCount} forwarder
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
    </div>
  )
}

