"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { productService, costingService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Calculator, 
  Package, 
  Rocket,
  DollarSign,
  Box,
  TrendingUp,
  Ruler
} from "lucide-react"
import type { Product } from "@/lib/api/types"

export default function CreateCostingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    product_id: "",
    cogs_per_unit: "",
    packing_cost: "",
    target_margin_percent: "20",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    fetchProducts()
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

      setProducts(productsData)
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat produk")
    } finally {
      setLoadingProducts(false)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const formatCurrency = (value: string) => {
    const num = value.replace(/\D/g, "")
    if (!num) return ""
    return new Intl.NumberFormat("id-ID").format(Number(num))
  }

  const handleCurrencyChange = (name: string, value: string) => {
    const num = value.replace(/\D/g, "")
    setFormData((prev) => ({ ...prev, [name]: num }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.product_id) {
      newErrors.product_id = "Produk harus dipilih"
    }

    if (!formData.cogs_per_unit || Number(formData.cogs_per_unit) <= 0) {
      newErrors.cogs_per_unit = "COGS harus diisi dan lebih dari 0"
    }

    if (!formData.packing_cost || Number(formData.packing_cost) <= 0) {
      newErrors.packing_cost = "Packing cost harus diisi dan lebih dari 0"
    }

    if (!formData.target_margin_percent || Number(formData.target_margin_percent) < 0) {
      newErrors.target_margin_percent = "Target margin harus diisi"
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

    setLoading(true)

    try {
      const response = await costingService.create({
        product_id: Number(formData.product_id),
        cogs_per_unit: Number(formData.cogs_per_unit),
        packing_cost: Number(formData.packing_cost),
        target_margin_percent: Number(formData.target_margin_percent),
      })

      if (response.success && response.data) {
        const costingId = (response.data as any).id || response.data
        router.push(`/costing/${costingId}`)
      } else {
        setError(response.message || "Gagal membuat costing")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Terjadi kesalahan saat membuat costing"
      )
    } finally {
      setLoading(false)
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
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#22C55E] shadow-[0_4px_0_0_#16a34a]">
                <Calculator className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Buat Costing Baru
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Hitung harga ekspor produk Anda
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
                    disabled={loadingProducts || loading}
                  >
                    <option value="">-- Pilih Produk --</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name_local}
                      </option>
                    ))}
                  </Select>
                  {errors.product_id && (
                    <p className="text-sm font-medium text-[#EF4444]">{errors.product_id}</p>
                  )}
                </div>

                {selectedProduct && (
                  <div className="bg-[#F0F9FF] rounded-2xl p-4 border-2 border-[#e0f2fe]">
                    <h4 className="font-bold text-[#0C4A6E] mb-3 flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-[#0284C7]" />
                      Preview Dimensi Produk
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-bold text-[#7DD3FC] uppercase">Dimensi (P×L×T)</p>
                        <p className="font-bold text-[#0C4A6E]">
                          {selectedProduct.dimensions_l_w_h.l} × {selectedProduct.dimensions_l_w_h.w} × {selectedProduct.dimensions_l_w_h.h} cm
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#7DD3FC] uppercase">Berat Netto</p>
                        <p className="font-bold text-[#0C4A6E]">{selectedProduct.weight_net} kg</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost Inputs */}
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#22C55E]" />
                  Input Biaya
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cogs_per_unit">COGS per Unit (IDR) *</Label>
                  <Input
                    id="cogs_per_unit"
                    name="cogs_per_unit"
                    placeholder="100000"
                    value={formData.cogs_per_unit ? formatCurrency(formData.cogs_per_unit) : ""}
                    onChange={(e) => handleCurrencyChange("cogs_per_unit", e.target.value)}
                    required
                    disabled={loading}
                  />
                  {errors.cogs_per_unit && (
                    <p className="text-sm font-medium text-[#EF4444]">{errors.cogs_per_unit}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="packing_cost">Packing Cost (IDR) *</Label>
                  <Input
                    id="packing_cost"
                    name="packing_cost"
                    placeholder="5000"
                    value={formData.packing_cost ? formatCurrency(formData.packing_cost) : ""}
                    onChange={(e) => handleCurrencyChange("packing_cost", e.target.value)}
                    required
                    disabled={loading}
                  />
                  {errors.packing_cost && (
                    <p className="text-sm font-medium text-[#EF4444]">{errors.packing_cost}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="target_margin_percent">
                      Target Margin: <span className="text-[#0284C7] font-bold">{formData.target_margin_percent}%</span>
                    </Label>
                    <input
                      type="range"
                      id="target_margin_percent"
                      name="target_margin_percent"
                      min="0"
                      max="100"
                      step="1"
                      value={formData.target_margin_percent}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full h-3 bg-[#e0f2fe] rounded-lg appearance-none cursor-pointer accent-[#22C55E]"
                    />
                    <div className="flex justify-between text-xs text-[#7DD3FC]">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  {errors.target_margin_percent && (
                    <p className="text-sm font-medium text-[#EF4444]">{errors.target_margin_percent}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                variant="success"
                size="lg"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menghitung...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    <span>Hitung Costing</span>
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

