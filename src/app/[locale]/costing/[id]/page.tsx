"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { costingService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteCostingModal } from "@/components/shared/DeleteCostingModal"
import {
  ArrowLeft,
  Calculator,
  Package,
  DollarSign,
  Box,
  Edit,
  Trash2,
  Download,
  TrendingUp,
} from "lucide-react"
import type { Costing } from "@/lib/api/types"

export default function CostingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [costing, setCosting] = useState<Costing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

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
        if ('success' in response && (response as any).success) {
          setCosting((response as any).data)
        } else {
          setCosting(response as Costing)
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!costing) return

    try {
      await costingService.delete(costing.id)
      router.push("/costing")
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal menghapus costing")
    }
  }

  // Helper to get numeric value from string or number
  const getNumericValue = (value: number | string | null | undefined): number => {
    if (value === null || value === undefined) return 0
    if (typeof value === "string") return parseFloat(value) || 0
    return value
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

  // Get prices from response (using recommended_ prefix or legacy fields)
  const exwPriceUsd = costing ? getNumericValue(costing.recommended_exw_price ?? costing.exw_price_usd) : 0
  const fobPriceUsd = costing ? getNumericValue(costing.recommended_fob_price ?? costing.fob_price_usd) : 0
  const cifPriceUsd = costing ? getNumericValue(costing.recommended_cif_price ?? costing.cif_price_usd) : 0
  
  // Get exchange rate (may not be in response, use default or fetch from currency settings)
  const exchangeRate = costing?.exchange_rate || 16000 // Default fallback
  
  // Calculate IDR equivalents
  const exwPriceIdr = exwPriceUsd * exchangeRate
  const fobPriceIdr = fobPriceUsd * exchangeRate
  const cifPriceIdr = cifPriceUsd > 0 ? cifPriceUsd * exchangeRate : null
  
  // Get container capacity (using correct field name)
  const containerCapacity = costing?.container_20ft_capacity ?? costing?.container_capacity_20ft ?? 0
  const containerUtilization = costing?.container_utilization_percent ?? 0

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

  const breakdown = costing?.price_breakdown || {}

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
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#22C55E] shadow-[0_4px_0_0_#16a34a]">
                  <Calculator className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                    {costing.product_name || `Costing #${costing.id}`}
                  </h1>
                  <p className="text-[#0284C7] font-medium">
                    Detail kalkulasi harga ekspor
                  </p>
                </div>
              </div>
              {!isAdmin() && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/costing/${costing.id}/edit`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                  <Button variant="secondary">
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Input Section */}
          <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#0284C7]" />
                Input Biaya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#F0F9FF] rounded-2xl p-4">
                  <p className="text-xs font-bold text-[#7DD3FC] uppercase mb-1">COGS</p>
                  <p className="text-xl font-extrabold text-[#0C4A6E]">
                    {formatCurrency(getNumericValue(costing.cogs_per_unit), "IDR")}
                  </p>
                </div>
                <div className="bg-[#F0F9FF] rounded-2xl p-4">
                  <p className="text-xs font-bold text-[#7DD3FC] uppercase mb-1">Packing Cost</p>
                  <p className="text-xl font-extrabold text-[#0C4A6E]">
                    {formatCurrency(getNumericValue(costing.packing_cost), "IDR")}
                  </p>
                </div>
                <div className="bg-[#F0F9FF] rounded-2xl p-4">
                  <p className="text-xs font-bold text-[#7DD3FC] uppercase mb-1">Target Margin</p>
                  <p className="text-xl font-extrabold text-[#0C4A6E]">
                    {getNumericValue(costing.target_margin_percent)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <Card className="bg-gradient-to-br from-[#0284C7] to-[#0369a1] rounded-3xl border-2 border-[#065985] shadow-[0_6px_0_0_#064e7a]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  EXW Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-extrabold text-white mb-2">
                  {formatCurrency(exwPriceUsd)}
                </p>
                <p className="text-[#7DD3FC] font-medium">
                  {formatCurrency(exwPriceIdr, "IDR")}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#22C55E] to-[#16a34a] rounded-3xl border-2 border-[#15803d] shadow-[0_6px_0_0_#166534]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  FOB Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-extrabold text-white mb-2">
                  {formatCurrency(fobPriceUsd)}
                </p>
                <p className="text-[#bbf7d0] font-medium">
                  {formatCurrency(fobPriceIdr, "IDR")}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#F59E0B] to-[#d97706] rounded-3xl border-2 border-[#b45309] shadow-[0_6px_0_0_#92400e]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  CIF Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cifPriceUsd > 0 ? (
                  <>
                    <p className="text-3xl font-extrabold text-white mb-2">
                      {formatCurrency(cifPriceUsd)}
                    </p>
                    <p className="text-[#fde68a] font-medium">
                      {formatCurrency(cifPriceIdr, "IDR")}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-bold text-white/80">
                    Belum dihitung
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Price Breakdown Chart */}
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#0284C7]" />
                  Price Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {breakdown && Object.keys(breakdown).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(breakdown).map(([key, value]) => {
                      const total = Object.values(breakdown).reduce((a: number, b: number) => a + b, 0)
                      const percentage = total > 0 ? (value as number / total) * 100 : 0
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-bold text-[#0C4A6E] capitalize">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className="font-bold text-[#0284C7]">
                              {formatCurrency(value as number, "USD")} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-3 bg-[#e0f2fe] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: key === "margin" ? "#22C55E" : "#0284C7",
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#7DD3FC]">
                    <p className="text-sm">Price breakdown tidak tersedia</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Container Info */}
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Box className="h-5 w-5 text-[#F59E0B]" />
                  Container 20ft
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-[#F0F9FF] rounded-2xl p-4 text-center">
                    <p className="text-xs font-bold text-[#7DD3FC] uppercase mb-2">Capacity</p>
                    <p className="text-4xl font-extrabold text-[#0C4A6E]">
                      {containerCapacity}
                    </p>
                    <p className="text-sm text-[#0284C7] font-medium">units</p>
                  </div>
                  {containerUtilization > 0 && (
                    <div className="bg-[#F0F9FF] rounded-2xl p-4 text-center">
                      <p className="text-xs font-bold text-[#7DD3FC] uppercase mb-2">Utilization</p>
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex-1 h-3 bg-[#e0f2fe] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${containerUtilization}%`,
                              backgroundColor: containerUtilization > 80 ? "#22C55E" : "#F59E0B",
                            }}
                          />
                        </div>
                        <span className="font-extrabold text-[#0C4A6E]">
                          {containerUtilization}%
                        </span>
                      </div>
                    </div>
                  )}
                  {costing.optimization_notes && (
                    <div className="bg-[#FEF3C7] border-2 border-[#FDE68A] rounded-2xl p-4">
                      <p className="text-xs font-bold text-[#92400e] uppercase mb-1">Optimization Notes</p>
                      <p className="text-sm text-[#92400e]">{costing.optimization_notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exchange Rate Info */}
          {costing.exchange_rate && (
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] mt-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#7DD3FC] uppercase mb-1">Exchange Rate</p>
                    <p className="text-xl font-extrabold text-[#0C4A6E]">
                      1 USD = {formatCurrency(costing.exchange_rate, "IDR")}
                    </p>
                    {costing.exchange_rate_source && (
                      <p className="text-xs text-[#7DD3FC] mt-1">
                        Source: {costing.exchange_rate_source}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {costing.exchange_rate_timestamp 
                      ? new Date(costing.exchange_rate_timestamp).toLocaleDateString("id-ID")
                      : new Date(costing.calculated_at).toLocaleDateString("id-ID")
                    }
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] mt-6">
            <CardContent className="p-6">
              <p className="text-sm text-[#7DD3FC]">
                Dihitung pada: {new Date(costing.calculated_at).toLocaleString("id-ID")}
              </p>
            </CardContent>
          </Card>

          <DeleteCostingModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onConfirm={handleDelete}
            productName={costing.product_name}
          />
        </div>
      </main>
    </div>
  )
}

