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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Package, 
  Globe, 
  Rocket, 
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import type { Product, Country, CountryDetail } from "@/lib/api/types"

export default function CreateExportAnalysisPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<CountryDetail | null>(null)
  const [formData, setFormData] = useState({
    product_id: "",
    target_country_code: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingCountries, setLoadingCountries] = useState(true)

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
      setLoadingProducts(true)
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

      // Filter only products with enrichment
      const enrichedProducts = productsData.filter(p => p.enrichment && p.enrichment.hs_code_recommendation)
      setProducts(enrichedProducts)
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat produk")
    } finally {
      setLoadingProducts(false)
    }
  }

  const fetchCountries = async () => {
    try {
      setLoadingCountries(true)
      const response = await countryService.list()
      
      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        setCountries((response as any).data || [])
      } else if (Array.isArray(response)) {
        setCountries(response)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat negara")
    } finally {
      setLoadingCountries(false)
    }
  }

  const handleProductChange = async (productId: string) => {
    setFormData((prev) => ({ ...prev, product_id: productId }))
    setSelectedProduct(null)
    setErrors((prev) => ({ ...prev, product_id: "" }))

    if (productId) {
      try {
        const product = await productService.get(productId)
        if (product && typeof product === 'object' && 'success' in product && (product as any).success) {
          setSelectedProduct((product as any).data)
        } else {
          setSelectedProduct(product as Product)
        }
      } catch (err) {
        console.error("Error fetching product:", err)
      }
    }
  }

  const handleCountryChange = async (countryCode: string) => {
    setFormData((prev) => ({ ...prev, target_country_code: countryCode }))
    setSelectedCountry(null)
    setErrors((prev) => ({ ...prev, target_country_code: "" }))

    if (countryCode) {
      try {
        const country = await countryService.get(countryCode)
        if (country && typeof country === 'object' && 'success' in country && (country as any).success) {
          setSelectedCountry((country as any).data)
        } else {
          setSelectedCountry(country as CountryDetail)
        }
      } catch (err) {
        console.error("Error fetching country:", err)
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.product_id) {
      newErrors.product_id = "Produk harus dipilih"
    }

    if (!formData.target_country_code) {
      newErrors.target_country_code = "Negara tujuan harus dipilih"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setAnalyzing(true)

    try {
      const response = await exportAnalysisService.create({
        product_id: Number(formData.product_id),
        target_country_code: formData.target_country_code,
      })

      if (response.success && response.data) {
        const analysisId = (response.data as any).id || response.data
        router.push(`/export-analysis/${analysisId}`)
      } else {
        setError(response.message || "Gagal membuat analisis")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Terjadi kesalahan saat membuat analisis"
      )
    } finally {
      setAnalyzing(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8 max-w-4xl">
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
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0284C7] shadow-[0_4px_0_0_#065985]">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Buat Analisis Ekspor
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Analisis kelayakan ekspor produk ke negara tujuan
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Product Selection */}
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#0284C7]" />
                  Pilih Produk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product_id">Produk *</Label>
                  <Select
                    id="product_id"
                    value={formData.product_id}
                    onChange={(e) => handleProductChange(e.target.value)}
                    disabled={loadingProducts || analyzing}
                  >
                    <option value="">-- Pilih Produk --</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name_local} {product.enrichment && "✓"}
                      </option>
                    ))}
                  </Select>
                  {errors.product_id && (
                    <p className="text-sm font-medium text-[#EF4444]">{errors.product_id}</p>
                  )}
                  {products.length === 0 && !loadingProducts && (
                    <Alert variant="warning">
                      <AlertDescription>
                        Tidak ada produk dengan AI enrichment. Silakan enrich produk terlebih dahulu.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {selectedProduct && (
                  <div className="bg-[#F0F9FF] rounded-2xl p-4 border-2 border-[#e0f2fe]">
                    <h4 className="font-bold text-[#0C4A6E] mb-2">Preview Produk</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-bold text-[#0284C7]">Nama:</span> {selectedProduct.name_local}</p>
                      <p><span className="font-bold text-[#0284C7]">Kategori:</span> {selectedProduct.category?.name || "N/A"}</p>
                      {selectedProduct.enrichment && (
                        <>
                          <p><span className="font-bold text-[#0284C7]">HS Code:</span> {selectedProduct.enrichment.hs_code_recommendation}</p>
                          <p><span className="font-bold text-[#0284C7]">SKU:</span> {selectedProduct.enrichment.sku_generated}</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Country Selection */}
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#22C55E]" />
                  Pilih Negara Tujuan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="target_country_code">Negara *</Label>
                  <Select
                    id="target_country_code"
                    value={formData.target_country_code}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    disabled={loadingCountries || analyzing}
                  >
                    <option value="">-- Pilih Negara --</option>
                    {countries.map((country) => (
                      <option key={country.country_code} value={country.country_code}>
                        {country.country_name} ({country.country_code})
                      </option>
                    ))}
                  </Select>
                  {errors.target_country_code && (
                    <p className="text-sm font-medium text-[#EF4444]">{errors.target_country_code}</p>
                  )}
                </div>

                {selectedCountry && (
                  <div className="bg-[#F0F9FF] rounded-2xl p-4 border-2 border-[#e0f2fe]">
                    <h4 className="font-bold text-[#0C4A6E] mb-2">Regulasi Negara</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-bold text-[#0284C7]">Negara:</span> {selectedCountry.country_name}</p>
                      <p><span className="font-bold text-[#0284C7]">Region:</span> {selectedCountry.region}</p>
                      <p><span className="font-bold text-[#0284C7]">Total Regulasi:</span> {selectedCountry.regulations?.length || 0}</p>
                      {selectedCountry.regulations_by_category && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.keys(selectedCountry.regulations_by_category).map((cat) => (
                            <Badge key={cat} variant="outline">
                              {cat}: {selectedCountry.regulations_by_category[cat].length}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.back()}
                disabled={analyzing}
                className="flex-1 sm:flex-none"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                size="lg"
                disabled={analyzing || !formData.product_id || !formData.target_country_code}
                className="flex-1"
              >
                {analyzing ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 animate-spin" />
                    <span>Menganalisis...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    <span>Mulai Analisis</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}


