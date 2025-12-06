"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { productService, countryService, exportAnalysisService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Package, 
  Globe, 
  Rocket, 
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Download
} from "lucide-react"
import type { Product, Country, ExportAnalysis } from "@/lib/api/types"

export default function CompareCountriesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [comparisonResults, setComparisonResults] = useState<ExportAnalysis[]>([])
  const [loading, setLoading] = useState(false)
  const [comparing, setComparing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    fetchProducts()
    fetchCountries()
  }, [isAuthenticated, router])

  const fetchProducts = async () => {
    try {
      const response = await productService.list({ limit: 100 })
      
      let productsData: Product[] = []
      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          productsData = Array.isArray((response as any).data) 
            ? (response as any).data 
            : (response as any).data?.results || []
        } else if (Array.isArray(response)) {
          productsData = response
        } else if ('results' in response) {
          productsData = (response as any).results || []
        }
      }

      const enrichedProducts = productsData.filter(p => p.enrichment && p.enrichment.hs_code_recommendation)
      setProducts(enrichedProducts)
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat produk")
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await countryService.list()
      
      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        setCountries((response as any).data || [])
      } else if (Array.isArray(response)) {
        setCountries(response)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat negara")
    }
  }

  const toggleCountry = (countryCode: string) => {
    setSelectedCountries((prev) => {
      if (prev.includes(countryCode)) {
        return prev.filter((c) => c !== countryCode)
      } else {
        if (prev.length >= 5) {
          setError("Maksimal 5 negara dapat dipilih")
          return prev
        }
        return [...prev, countryCode]
      }
    })
    setError(null)
  }

  const handleCompare = async () => {
    if (!selectedProductId || selectedCountries.length < 2) {
      setError("Pilih minimal 2 negara untuk dibandingkan")
      return
    }

    setComparing(true)
    setError(null)

    try {
      const response = await exportAnalysisService.compare({
        product_id: Number(selectedProductId),
        country_codes: selectedCountries,
      })

      if (response.success && response.data) {
        const analyses = (response.data as any).analyses || response.data
        setComparisonResults(Array.isArray(analyses) ? analyses : [])
      } else {
        setError(response.message || "Gagal membandingkan negara")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setComparing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score < 50) return "#EF4444"
    if (score <= 75) return "#F59E0B"
    return "#22C55E"
  }

  const getHighestScore = () => {
    if (comparisonResults.length === 0) return -1
    return Math.max(...comparisonResults.map(a => a.readiness_score))
  }

  const highestScore = getHighestScore()

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#0284C7] hover:text-[#0369a1] font-bold mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Kembali
            </button>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8B5CF6] shadow-[0_4px_0_0_#7c3aed]">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Bandingkan Negara
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Bandingkan kelayakan ekspor ke beberapa negara sekaligus
                </p>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Select Product */}
          <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[#0284C7]" />
                Step 1: Pilih Produk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="product">Produk *</Label>
                <Select
                  id="product"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  disabled={comparing}
                >
                  <option value="">-- Pilih Produk --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name_local}
                    </option>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Select Countries */}
          <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#22C55E]" />
                Step 2: Pilih Negara (Maksimal 5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {countries.map((country) => {
                  const isSelected = selectedCountries.includes(country.country_code)
                  return (
                    <button
                      key={country.country_code}
                      type="button"
                      onClick={() => toggleCountry(country.country_code)}
                      disabled={comparing || (!isSelected && selectedCountries.length >= 5)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${
                        isSelected
                          ? "border-[#22C55E] bg-[#f0fdf4] shadow-[0_4px_0_0_#bbf7d0]"
                          : "border-[#e0f2fe] bg-white hover:border-[#7DD3FC] hover:bg-[#F0F9FF]"
                      } ${(!isSelected && selectedCountries.length >= 5) ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />
                        )}
                        <div className="flex-1">
                          <p className={`font-bold ${isSelected ? "text-[#166534]" : "text-[#0C4A6E]"}`}>
                            {country.country_name}
                          </p>
                          <p className={`text-xs ${isSelected ? "text-[#22C55E]" : "text-[#7DD3FC]"}`}>
                            {country.country_code}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              {selectedCountries.length > 0 && (
                <div className="mt-4 bg-[#F0F9FF] rounded-2xl p-3">
                  <p className="text-sm font-bold text-[#0284C7] mb-2">
                    {selectedCountries.length} negara dipilih:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountries.map((code) => {
                      const country = countries.find(c => c.country_code === code)
                      return (
                        <Badge key={code} variant="success">
                          {country?.country_name || code}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compare Button */}
          <div className="mb-6">
            <Button
              size="lg"
              onClick={handleCompare}
              disabled={!selectedProductId || selectedCountries.length < 2 || comparing}
              className="w-full"
            >
              {comparing ? (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 animate-spin" />
                  <span>Membandingkan...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  <span>Bandingkan</span>
                </div>
              )}
            </Button>
          </div>

          {/* Comparison Results */}
          {comparisonResults.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-[#0C4A6E]">
                  Hasil Perbandingan
                </h2>
                <Button variant="secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>

              {/* Comparison Table */}
              <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] overflow-hidden shadow-[0_4px_0_0_#e0f2fe]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#F0F9FF] border-b-2 border-[#e0f2fe]">
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Negara</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Score</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Status</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Critical Issues</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Rekomendasi</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonResults.map((analysis) => {
                        const isHighest = analysis.readiness_score === highestScore
                        const criticalIssues = analysis.compliance_issues?.filter(i => i.severity === 'critical') || []
                        return (
                          <tr
                            key={analysis.id}
                            className={`border-b border-[#e0f2fe] transition-colors ${
                              isHighest ? "bg-[#f0fdf4] hover:bg-[#dcfce7]" : "hover:bg-[#F0F9FF]"
                            }`}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-[#0284C7]" />
                                <span className="font-bold text-[#0C4A6E]">{analysis.country_name}</span>
                                {isHighest && (
                                  <Badge variant="success" className="text-xs">
                                    ⭐ Terbaik
                                  </Badge>
                                )}
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
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={analysis.status_grade === "Ready" ? "success" : analysis.status_grade === "Warning" ? "accent" : "destructive"}>
                                {analysis.status_grade}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-[#0C4A6E]">
                                {criticalIssues.length}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="text-sm text-[#0C4A6E] line-clamp-2">
                                {analysis.recommendations?.substring(0, 100)}...
                              </p>
                            </td>
                            <td className="p-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/export-analysis/${analysis.id}`)}
                              >
                                Detail
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Common Issues */}
              {comparisonResults.length > 1 && (
                <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                      Common Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#7DD3FC]">
                      Issues yang muncul di semua negara yang dibandingkan akan ditampilkan di sini.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


