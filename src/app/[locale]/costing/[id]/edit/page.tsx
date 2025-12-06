"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { costingService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Calculator, 
  Package, 
  Rocket,
  DollarSign,
  Save
} from "lucide-react"
import type { Costing } from "@/lib/api/types"

export default function EditCostingPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated } = useAuthStore()
  const [costing, setCosting] = useState<Costing | null>(null)
  const [formData, setFormData] = useState({
    cogs_per_unit: "",
    packing_cost: "",
    target_margin_percent: "20",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const costingId = params?.id as string

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (costingId) {
      fetchCosting()
    }
  }, [isAuthenticated, router, costingId])

  const fetchCosting = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await costingService.get(costingId)

      if (response && typeof response === 'object') {
        let costingData: Costing
        if ('success' in response && (response as any).success) {
          costingData = (response as any).data
        } else {
          costingData = response as Costing
        }
        setCosting(costingData)
        
        // Handle string or number values from API
        const getNumericString = (value: number | string | null | undefined): string => {
          if (value === null || value === undefined) return "0"
          if (typeof value === "string") return value.replace(/[^\d.]/g, "")
          return value.toString()
        }
        
        setFormData({
          cogs_per_unit: getNumericString(costingData.cogs_per_unit),
          packing_cost: getNumericString(costingData.packing_cost),
          target_margin_percent: getNumericString(costingData.target_margin_percent),
        })
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
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

    if (!validateForm() || !costing) {
      return
    }

    setSubmitting(true)

    try {
      const response = await costingService.update(costing.id, {
        cogs_per_unit: Number(formData.cogs_per_unit),
        packing_cost: Number(formData.packing_cost),
        target_margin_percent: Number(formData.target_margin_percent),
      })

      if (response.success && response.data) {
        router.push(`/costing/${costing.id}`)
      } else {
        setError(response.message || "Gagal mengupdate costing")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Terjadi kesalahan saat mengupdate costing"
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated || loading) {
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

  if (!costing) {
    return (
      <div className="flex h-screen bg-[#F0F9FF]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8">
            <Alert variant="destructive">
              <AlertDescription>
                {error || "Costing tidak ditemukan"}
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    )
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
                <Calculator className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Edit Costing
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Update dan recalculate harga ekspor
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

            {/* Product Info (Disabled) */}
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#0284C7]" />
                  Produk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={costing.product_name || `Product ID: ${costing.product_id}`}
                  disabled
                  className="bg-[#F0F9FF]"
                />
                <p className="text-xs text-[#7DD3FC] mt-2">
                  Produk tidak dapat diubah setelah costing dibuat
                </p>
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
                    disabled={submitting}
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
                    disabled={submitting}
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
                      disabled={submitting}
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
                disabled={submitting}
                className="flex-1 sm:flex-none"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                size="lg"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menghitung ulang...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    <span>Update & Recalculate</span>
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

