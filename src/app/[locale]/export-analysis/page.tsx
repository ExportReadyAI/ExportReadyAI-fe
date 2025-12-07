"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { exportAnalysisService, countryService, productService } from "@/lib/api/services"
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
  FileText, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Globe,
  Filter
} from "lucide-react"
import { NoProductModal } from "@/components/shared/NoProductModal"
import { ProductNotEnrichedModal } from "@/components/shared/ProductNotEnrichedModal"
import type { ExportAnalysis, Country } from "@/lib/api/types"

export default function ExportAnalysisPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [analyses, setAnalyses] = useState<ExportAnalysis[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [scoreMin, setScoreMin] = useState<string>("")
  const [scoreMax, setScoreMax] = useState<string>("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [mounted, setMounted] = useState(false)
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

    fetchCountries()
    fetchAnalyses()
  }, [mounted, router, page, searchTerm, countryFilter, scoreMin, scoreMax])

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

  const fetchAnalyses = async () => {
    try {
      setLoading(true)
      setError(null) // Clear previous errors
      const params: any = {
        page,
        limit: 10,
      }

      if (searchTerm) {
        params.search = searchTerm
      }

      if (countryFilter !== "all") {
        params.country_code = countryFilter
      }

      if (scoreMin) {
        params.score_min = Number(scoreMin)
      }

      if (scoreMax) {
        params.score_max = Number(scoreMax)
      }

      const response = await exportAnalysisService.list(params)

      let analysesData: ExportAnalysis[] = []
      let totalCountValue = 0
      let totalPagesValue = 1

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          const apiResponse = response as any
          if (Array.isArray(apiResponse.data)) {
            analysesData = apiResponse.data
            totalCountValue = apiResponse.pagination?.count || analysesData.length
            totalPagesValue = apiResponse.pagination?.total_pages || 1
          } else if (apiResponse.data && 'results' in apiResponse.data) {
            analysesData = apiResponse.data.results || []
            totalCountValue = apiResponse.data.count || analysesData.length
            const limit = params.limit || 10
            totalPagesValue = Math.ceil(totalCountValue / limit)
          } else if (apiResponse.data && 'data' in apiResponse.data) {
            analysesData = apiResponse.data.data
            totalCountValue = apiResponse.data.pagination?.count || analysesData.length
            totalPagesValue = apiResponse.data.pagination?.total_pages || 1
          }
        } else if ('results' in response) {
          const djangoResponse = response as any
          analysesData = Array.isArray(djangoResponse.results) ? djangoResponse.results : []
          totalCountValue = djangoResponse.count || analysesData.length
          const limit = params.limit || 10
          totalPagesValue = Math.ceil(totalCountValue / limit)
        } else if (Array.isArray(response)) {
          analysesData = response
          totalCountValue = response.length
        }
      }

      setAnalyses(analysesData)
      setTotalPages(totalPagesValue)
      setTotalCount(totalCountValue)
    } catch (err: any) {
      console.error("Export Analysis Error:", err)
      setError(err.response?.data?.message || err.response?.data?.detail || "Terjadi kesalahan saat memuat data")
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score < 50) return "#EF4444" // Red
    if (score <= 75) return "#F59E0B" // Amber
    return "#22C55E" // Green
  }

  const getScoreLabel = (score: number) => {
    if (score < 50) return "Not Ready"
    if (score <= 75) return "Need Improvement"
    return "Ready"
  }

  const handleCreateAnalysis = async () => {
    try {
      // Check if user has any products - get more to check enrichment
      const response = await productService.list({ limit: 100 })
      
      let productsData: any[] = []
      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          productsData = Array.isArray((response as any).data) 
            ? (response as any).data 
            : (response as any).data?.results || []
        } else if ('results' in response) {
          productsData = (response as any).results || []
        } else if (Array.isArray(response)) {
          productsData = response
        }
      }

      if (productsData.length === 0) {
        setNoProductModalOpen(true)
        return
      }

      // Check if any product is enriched
      const hasEnrichedProduct = productsData.some(p => p.is_enriched)
      if (!hasEnrichedProduct) {
        setNotEnrichedModalOpen(true)
        return
      }

      // If validation passes, go to create page
      router.push("/export-analysis/create")
    } catch (err) {
      console.error("Error checking products:", err)
      // If error, still allow to proceed
      router.push("/export-analysis/create")
    }
  }

  const getStatusBadgeVariant = (grade: string) => {
    if (grade === "Ready") return "success"
    if (grade === "Warning") return "accent"
    return "destructive"
  }

  if (!mounted || loading) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token && mounted) {
      return null
    }
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F9FF]">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#0284C7] shadow-[0_6px_0_0_#065985] animate-bounce">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-bold text-[#0C4A6E]">Memuat analisis...</p>
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
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0284C7] shadow-[0_4px_0_0_#065985]">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Analisis Ekspor
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Kelola analisis kelayakan ekspor produk Anda
                </p>
              </div>
            </div>
            {!isAdmin() && (
              <Button 
                size="lg"
                onClick={handleCreateAnalysis}
                className="shadow-[0_4px_0_0_#065985]"
              >
                <Plus className="mr-2 h-5 w-5" />
                Buat Analisis Baru
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-[#0284C7]" />
              <h3 className="font-bold text-[#0C4A6E]">Filter & Pencarian</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#7DD3FC]" />
                <Input
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12"
                />
              </div>
              <Select
                value={countryFilter}
                onChange={(e) => {
                  setCountryFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">Semua Negara</option>
                {countries.map((country) => (
                  <option key={country.country_code} value={country.country_code}>
                    {country.country_name}
                  </option>
                ))}
              </Select>
              <Input
                type="number"
                placeholder="Score Min (0-100)"
                min="0"
                max="100"
                value={scoreMin}
                onChange={(e) => {
                  setScoreMin(e.target.value)
                  setPage(1)
                }}
              />
              <Input
                type="number"
                placeholder="Score Max (0-100)"
                min="0"
                max="100"
                value={scoreMax}
                onChange={(e) => {
                  setScoreMax(e.target.value)
                  setPage(1)
                }}
              />
            </div>
          </div>

          {/* Table */}
          {analyses.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-12 shadow-[0_4px_0_0_#e0f2fe] text-center">
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-[#F0F9FF] mb-6">
                <FileText className="h-10 w-10 text-[#7DD3FC]" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0C4A6E] mb-2">
                Belum Ada Analisis 📊
              </h3>
              <p className="text-[#0284C7] font-medium mb-6 max-w-md mx-auto">
                Mulai dengan membuat analisis ekspor untuk produk Anda.
              </p>
              {!isAdmin() && (
                <Button 
                  size="lg"
                  onClick={() => router.push("/export-analysis/create")}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Buat Analisis Pertama
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
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Negara Tujuan</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Score</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Status</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Dianalisis</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyses.map((analysis, index) => (
                        <tr 
                          key={analysis.id} 
                          className="border-b border-[#e0f2fe] hover:bg-[#F0F9FF] transition-colors"
                        >
                          <td className="p-4 font-bold text-[#0C4A6E]">
                            {(page - 1) * 10 + index + 1}
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-[#0C4A6E]">{analysis.product_name}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-[#0284C7]" />
                              <span className="font-medium text-[#0C4A6E]">{analysis.country_name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="flex h-10 w-10 items-center justify-center rounded-full font-extrabold text-white"
                                style={{ backgroundColor: getScoreColor(analysis.readiness_score) }}
                              >
                                {analysis.readiness_score}
                              </div>
                              <span className="text-sm font-medium" style={{ color: getScoreColor(analysis.readiness_score) }}>
                                {getScoreLabel(analysis.readiness_score)}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={getStatusBadgeVariant(analysis.status_grade) as any}>
                              {analysis.status_grade}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-[#0284C7] font-medium">
                            {new Date(analysis.analyzed_at).toLocaleDateString("id-ID")}
                          </td>
                          <td className="p-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/export-analysis/${analysis.id}`)}
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
                      Menampilkan <span className="font-bold">{analyses.length}</span> dari <span className="font-bold">{totalCount}</span> analisis
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

          {/* Modals */}
          <NoProductModal
            open={noProductModalOpen}
            onOpenChange={setNoProductModalOpen}
          />

          <ProductNotEnrichedModal
            open={notEnrichedModalOpen}
            onOpenChange={setNotEnrichedModalOpen}
          />
        </div>
      </main>
    </div>
  )
}


