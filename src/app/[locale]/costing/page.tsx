"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { costingService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Plus, 
  Search, 
  Eye, 
  Calculator, 
  ChevronLeft, 
  ChevronRight,
  Package,
  ArrowUpDown
} from "lucide-react"
import type { Costing } from "@/lib/api/types"

export default function CostingPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [costings, setCostings] = useState<Costing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<string>("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
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
    if (!token) {
      router.push("/login")
      return
    }

    fetchCostings()
  }, [mounted, router, page, searchTerm, sortBy, sortOrder])

  const fetchCostings = async () => {
    try {
      setLoading(true)
      const params: any = {
        page,
        limit: 10,
        sort_by: sortBy,
        sort_order: sortOrder,
      }

      if (searchTerm) {
        params.search = searchTerm
      }

      const response = await costingService.list(params)

      let costingsData: Costing[] = []
      let totalCountValue = 0
      let totalPagesValue = 1

      if (response && typeof response === 'object') {
        const responseData = response as any
        
        // Check for Django REST Framework pagination format (results, count, next, previous)
        if ('results' in responseData && Array.isArray(responseData.results)) {
          costingsData = responseData.results
          totalCountValue = responseData.count || costingsData.length
          // Calculate total pages from count and limit
          const limit = params.limit || 10
          totalPagesValue = Math.ceil(totalCountValue / limit) || 1
        }
        // Check for wrapped response with success field
        else if ('success' in responseData && responseData.success) {
          if (Array.isArray(responseData.data)) {
            costingsData = responseData.data
            totalCountValue = responseData.pagination?.count || costingsData.length
            totalPagesValue = responseData.pagination?.total_pages || 1
          } else if (responseData.data && 'results' in responseData.data) {
            costingsData = responseData.data.results
            totalCountValue = responseData.data.count || costingsData.length
            const limit = params.limit || 10
            totalPagesValue = Math.ceil(totalCountValue / limit) || 1
          } else if (responseData.data && 'data' in responseData.data) {
            costingsData = responseData.data.data
            totalCountValue = responseData.data.pagination?.count || costingsData.length
            totalPagesValue = responseData.data.pagination?.total_pages || 1
          }
        }
        // Check if response is directly an array
        else if (Array.isArray(response)) {
          costingsData = response
          totalCountValue = response.length
        }
      }

      setCostings(costingsData)
      setTotalPages(totalPagesValue)
      setTotalCount(totalCountValue)
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number | string | null | undefined, currency: "USD" | "IDR" = "USD") => {
    if (amount === null || amount === undefined) {
      return "N/A"
    }
    
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
    
    if (isNaN(numAmount)) {
      return "N/A"
    }
    
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(numAmount)
    } else {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(numAmount)
    }
  }

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  if (!mounted || loading) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token && mounted) {
      return null
    }
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F9FF]">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#22C55E] shadow-[0_6px_0_0_#16a34a] animate-bounce">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-bold text-[#0C4A6E]">Memuat costing...</p>
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
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#22C55E] shadow-[0_4px_0_0_#16a34a]">
                <Calculator className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Kalkulator Costing
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Hitung harga ekspor produk Anda
                </p>
              </div>
            </div>
            {!isAdmin() && (
              <Button 
                size="lg"
                onClick={() => router.push("/costing/create")}
                className="shadow-[0_4px_0_0_#16a34a]"
              >
                <Plus className="mr-2 h-5 w-5" />
                Buat Costing Baru
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search & Sort */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
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
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setPage(1)
                }}
                className="w-full sm:w-48"
              >
                <option value="created_at">Tanggal Dibuat</option>
                <option value="fob_price">FOB Price</option>
              </Select>
              <Button
                variant="outline"
                onClick={toggleSort}
                className="w-full sm:w-auto"
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {sortOrder === "asc" ? "Naik" : "Turun"}
              </Button>
            </div>
          </div>

          {/* Table */}
          {costings.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-12 shadow-[0_4px_0_0_#e0f2fe] text-center">
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-[#F0F9FF] mb-6">
                <Calculator className="h-10 w-10 text-[#7DD3FC]" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0C4A6E] mb-2">
                Belum Ada Costing 💰
              </h3>
              <p className="text-[#0284C7] font-medium mb-6 max-w-md mx-auto">
                Mulai dengan membuat kalkulasi costing untuk produk Anda.
              </p>
              {!isAdmin() && (
                <Button 
                  size="lg"
                  onClick={() => router.push("/costing/create")}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Buat Costing Pertama
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] overflow-hidden shadow-[0_4px_0_0_#e0f2fe]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#F0F9FF] border-b-2 border-[#e0f2fe]">
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">No</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Produk</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">COGS</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">FOB Price</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Container</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Dihitung</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costings.map((costing, index) => (
                        <tr 
                          key={costing.id} 
                          className="border-b border-[#e0f2fe] hover:bg-[#F0F9FF] transition-colors"
                        >
                          <td className="p-4 font-bold text-[#0C4A6E]">
                            {(page - 1) * 10 + index + 1}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-[#0284C7]" />
                              <span className="font-medium text-[#0C4A6E]">
                                {costing.product_name || `Product ID: ${costing.product_id}`}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-[#0C4A6E]">
                              {formatCurrency(
                                typeof costing.cogs_per_unit === 'string' 
                                  ? parseFloat(costing.cogs_per_unit) 
                                  : costing.cogs_per_unit,
                                "IDR"
                              )}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-extrabold text-[#22C55E] text-lg">
                              {formatCurrency(
                                typeof costing.recommended_fob_price !== 'undefined' 
                                  ? costing.recommended_fob_price 
                                  : costing.fob_price_usd
                              )}
                            </span>
                            {costing.exchange_rate && (
                              <p className="text-xs text-[#7DD3FC]">
                                {formatCurrency(
                                  (typeof costing.recommended_fob_price !== 'undefined' 
                                    ? parseFloat(String(costing.recommended_fob_price)) 
                                    : (costing.fob_price_usd || 0)) * (costing.exchange_rate || 16000),
                                  "IDR"
                                )}
                              </p>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0C4A6E]">
                                {costing.container_20ft_capacity ?? costing.container_capacity_20ft ?? 0}
                              </span>
                              <span className="text-sm text-[#7DD3FC]">unit</span>
                            </div>
                            {costing.container_utilization_percent && (
                              <p className="text-xs text-[#7DD3FC]">
                                {costing.container_utilization_percent}% utilized
                              </p>
                            )}
                          </td>
                          <td className="p-4 text-sm text-[#0284C7] font-medium">
                            {new Date(costing.calculated_at).toLocaleDateString("id-ID")}
                          </td>
                          <td className="p-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/costing/${costing.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Detail
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t-2 border-[#e0f2fe] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-medium text-[#0C4A6E]">
                      Menampilkan <span className="font-bold">{costings.length}</span> dari <span className="font-bold">{totalCount}</span> costing
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Sebelumnya
                      </Button>
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
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

