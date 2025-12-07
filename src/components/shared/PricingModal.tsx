"use client"

import { useEffect, useState } from "react"
import { productService } from "@/lib/api/services"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DollarSign,
  Calculator,
  Loader2,
  Sparkles,
  TrendingUp,
  Package,
  Truck,
  Ship,
  FileText,
  PiggyBank,
  Target,
  ArrowRight,
  Info,
} from "lucide-react"
import type { ProductPricing, CreateProductPricingRequest } from "@/lib/api/types"

interface PricingModalProps {
  productId: number | null
  productName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "GB", name: "United Kingdom" },
  { code: "CN", name: "China" },
  { code: "KR", name: "South Korea" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
]

export function PricingModal({
  productId,
  productName,
  open,
  onOpenChange,
}: PricingModalProps) {
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ProductPricing | null>(null)
  const [hasExisting, setHasExisting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [cogsPerUnit, setCogsPerUnit] = useState("")
  const [targetMargin, setTargetMargin] = useState("30")
  const [targetCountry, setTargetCountry] = useState("US")

  useEffect(() => {
    if (open && productId) {
      fetchExistingData()
    }
  }, [open, productId])

  const fetchExistingData = async () => {
    if (!productId) return

    setLoading(true)
    setError(null)

    try {
      const response = await productService.getPricing(productId)

      let pricingData: ProductPricing | null = null

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          pricingData = (response as any).data
        } else if ('product_id' in response) {
          pricingData = response as ProductPricing
        }
      }

      if (pricingData) {
        setData(pricingData)
        setHasExisting(true)
        setShowForm(false)
      } else {
        setData(null)
        setHasExisting(false)
        setShowForm(true)
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setData(null)
        setHasExisting(false)
        setShowForm(true)
      } else {
        setError(err.response?.data?.message || "Gagal memuat data")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productId) return

    if (!cogsPerUnit || parseFloat(cogsPerUnit) <= 0) {
      setError("Masukkan HPP per unit yang valid")
      return
    }

    if (!targetMargin || parseFloat(targetMargin) <= 0) {
      setError("Masukkan target margin yang valid")
      return
    }

    setGenerating(true)
    setError(null)

    try {
      const requestData: CreateProductPricingRequest = {
        cogs_per_unit_idr: parseFloat(cogsPerUnit),
        target_margin_percent: parseFloat(targetMargin),
        target_country_code: targetCountry,
      }

      const response = await productService.createPricing(productId, requestData)

      let pricingData: ProductPricing | null = null

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          pricingData = (response as any).data
        } else if ('product_id' in response) {
          pricingData = response as unknown as ProductPricing
        }
      }

      if (pricingData) {
        setData(pricingData)
        setHasExisting(true)
        setShowForm(false)
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError("Pricing sudah ada untuk produk ini. Silakan lihat hasil yang ada.")
        fetchExistingData()
      } else {
        setError(err.response?.data?.message || err.response?.data?.detail || "Gagal menghitung harga")
      }
    } finally {
      setGenerating(false)
    }
  }

  const formatCurrency = (value: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const handleClose = () => {
    onOpenChange(false)
    setData(null)
    setError(null)
    setHasExisting(false)
    setShowForm(false)
    setCogsPerUnit("")
    setTargetMargin("30")
    setTargetCountry("US")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E] shadow-[0_3px_0_0_#15803d]">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-[#0C4A6E]">Pricing Calculator</span>
              <p className="text-sm font-medium text-[#0284C7] mt-0.5">{productName}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-[#22C55E]" />
              <p className="mt-4 text-[#0284C7] font-medium">Memuat data...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : showForm && !data ? (
            /* Input Form */
            <div>
              <div className="bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] rounded-2xl border-2 border-[#bbf7d0] p-5 mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22C55E] shadow-[0_4px_0_0_#15803d]">
                    <Calculator className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#0C4A6E]">
                      Hitung Harga Ekspor dengan AI
                    </h3>
                    <p className="text-[#0284C7] font-medium mt-1">
                      Masukkan data biaya produk Anda untuk mendapatkan rekomendasi harga EXW, FOB, dan CIF.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label htmlFor="cogs" className="text-[#0C4A6E] font-bold">
                      HPP per Unit (IDR) *
                    </Label>
                    <div className="relative mt-2">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7DD3FC] font-bold">
                        Rp
                      </span>
                      <Input
                        id="cogs"
                        type="number"
                        placeholder="75000"
                        value={cogsPerUnit}
                        onChange={(e) => setCogsPerUnit(e.target.value)}
                        className="pl-12"
                        required
                      />
                    </div>
                    <p className="text-xs text-[#7DD3FC] mt-1">
                      Harga Pokok Produksi per unit
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="margin" className="text-[#0C4A6E] font-bold">
                      Target Margin (%) *
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="margin"
                        type="number"
                        placeholder="30"
                        value={targetMargin}
                        onChange={(e) => setTargetMargin(e.target.value)}
                        className="pr-12"
                        min="1"
                        max="200"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7DD3FC] font-bold">
                        %
                      </span>
                    </div>
                    <p className="text-xs text-[#7DD3FC] mt-1">
                      Persentase keuntungan yang diinginkan
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="country" className="text-[#0C4A6E] font-bold">
                    Negara Tujuan
                  </Label>
                  <Select
                    id="country"
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    className="mt-2"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </Select>
                  <p className="text-xs text-[#7DD3FC] mt-1">
                    Negara tujuan untuk estimasi biaya pengiriman
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={generating}
                  className="w-full bg-[#22C55E] hover:bg-[#16a34a] shadow-[0_4px_0_0_#15803d]"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      AI Sedang Menghitung...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Hitung Rekomendasi Harga
                    </>
                  )}
                </Button>
              </form>
            </div>
          ) : data ? (
            /* Results */
            <div className="space-y-6">
              {/* Price Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                {/* EXW */}
                <div className="bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-2xl border-2 border-[#bbf7d0] p-5 text-center">
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-[#22C55E] shadow-[0_3px_0_0_#15803d] mb-3">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0C4A6E] mb-1">EXW Price</h4>
                  <p className="text-2xl font-extrabold text-[#22C55E]">
                    {formatCurrency(data.exw_price_usd)}
                  </p>
                  <p className="text-xs text-[#7DD3FC] mt-1">Ex-Works (Harga di Pabrik)</p>
                </div>

                {/* FOB */}
                <div className="bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] rounded-2xl border-2 border-[#bfdbfe] p-5 text-center">
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-[#0284C7] shadow-[0_3px_0_0_#065985] mb-3">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0C4A6E] mb-1">FOB Price</h4>
                  <p className="text-2xl font-extrabold text-[#0284C7]">
                    {formatCurrency(data.fob_price_usd)}
                  </p>
                  <p className="text-xs text-[#7DD3FC] mt-1">Free on Board (Sampai Pelabuhan)</p>
                </div>

                {/* CIF */}
                <div className="bg-gradient-to-br from-[#fdf2f8] to-[#fce7f3] rounded-2xl border-2 border-[#fbcfe8] p-5 text-center">
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-[#EC4899] shadow-[0_3px_0_0_#be185d] mb-3">
                    <Ship className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0C4A6E] mb-1">CIF Price</h4>
                  <p className="text-2xl font-extrabold text-[#EC4899]">
                    {formatCurrency(data.cif_price_usd)}
                  </p>
                  <p className="text-xs text-[#7DD3FC] mt-1">Cost, Insurance, Freight</p>
                </div>
              </div>

              {/* Price Breakdown */}
              {data.pricing_breakdown && (
                <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-5">
                  <h4 className="flex items-center gap-2 text-lg font-extrabold text-[#0C4A6E] mb-4">
                    <FileText className="h-5 w-5 text-[#F59E0B]" />
                    Rincian Harga
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-[#e0f2fe]">
                      <span className="text-[#0284C7]">Biaya Produksi (HPP)</span>
                      <span className="font-bold text-[#0C4A6E]">
                        {formatIDR(data.pricing_breakdown.base_cost_idr)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#e0f2fe]">
                      <span className="text-[#0284C7]">Margin ({data.target_margin_percent}%)</span>
                      <span className="font-bold text-[#22C55E]">
                        + {formatIDR(data.pricing_breakdown.margin_amount_idr)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#e0f2fe]">
                      <span className="text-[#0284C7]">Total (IDR)</span>
                      <span className="font-bold text-[#0C4A6E]">
                        {formatIDR(data.pricing_breakdown.total_idr)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#e0f2fe]">
                      <span className="text-[#0284C7]">Local Handling (est.)</span>
                      <span className="font-bold text-[#0C4A6E]">
                        {formatCurrency(data.pricing_breakdown.local_handling_estimate_usd)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-[#0284C7]">Shipping Estimate</span>
                      <span className="font-bold text-[#0C4A6E]">
                        {formatCurrency(data.pricing_breakdown.shipping_estimate_usd)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Exchange Rate Info */}
              <div className="bg-[#F0F9FF] rounded-2xl border-2 border-[#e0f2fe] p-4 flex items-center gap-3">
                <Info className="h-5 w-5 text-[#0284C7]" />
                <div className="text-sm">
                  <span className="text-[#0284C7]">Kurs yang digunakan: </span>
                  <span className="font-bold text-[#0C4A6E]">
                    1 USD = {formatIDR(data.exchange_rate_used)}
                  </span>
                  <span className="text-[#7DD3FC] ml-2">
                    | Tujuan: {data.target_country_code}
                  </span>
                </div>
              </div>

              {/* AI Pricing Insight */}
              {data.pricing_insight && (
                <div className="bg-gradient-to-r from-[#fffbeb] to-[#fef3c7] rounded-2xl border-2 border-[#fde68a] p-5">
                  <h4 className="flex items-center gap-2 text-lg font-extrabold text-[#0C4A6E] mb-3">
                    <Sparkles className="h-5 w-5 text-[#F59E0B]" />
                    Insight AI
                  </h4>
                  <div className="text-[#0C4A6E] leading-relaxed space-y-3">
                    {data.pricing_insight.split('\n').map((line, idx) => {
                      // Remove markdown syntax
                      let cleanLine = line
                        .replace(/#{1,6}\s/g, '') // Remove headers
                        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
                        .replace(/\*([^*]+)\*/g, '$1') // Remove italic
                        .replace(/`([^`]+)`/g, '$1') // Remove code
                        .replace(/^\s*[-*+]\s/g, '• ') // Convert list markers to bullets
                        .replace(/^\s*\d+\.\s/g, (match) => match.replace(/\d+/, (num) => `${num}.`)) // Keep numbered lists
                        .trim()
                      
                      if (!cleanLine) return null
                      
                      // Check if it's a bullet point
                      const isBullet = cleanLine.startsWith('•')
                      const isNumbered = /^\d+\./.test(cleanLine)
                      
                      return (
                        <p 
                          key={idx} 
                          className={`${isBullet || isNumbered ? 'pl-4' : ''} ${
                            cleanLine.length < 50 && !isBullet && !isNumbered ? 'font-semibold text-[#0C4A6E]' : ''
                          }`}
                        >
                          {cleanLine}
                        </p>
                      )
                    }).filter(Boolean)}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
