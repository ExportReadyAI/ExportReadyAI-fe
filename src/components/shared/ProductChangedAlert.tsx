"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ProductChangedAlertProps {
  productName: string
  onReanalyze?: () => void
  loading?: boolean
}

/**
 * ProductChangedAlert Component
 * 
 * Menampilkan warning banner ketika produk telah diubah sejak analisis terakhir.
 * Menyediakan tombol Re-analyze untuk user melakukan analisis ulang dengan data terbaru.
 * 
 * @param productName - Nama produk yang telah berubah
 * @param onReanalyze - Handler untuk trigger re-analyze
 * @param loading - Status loading saat re-analyze berlangsung
 */
export function ProductChangedAlert({
  productName,
  onReanalyze,
  loading = false,
}: ProductChangedAlertProps) {
  return (
    <Alert variant="destructive" className="border-2 border-[#F59E0B] bg-[#FEF3C7] mb-6">
      <AlertCircle className="h-5 w-5 text-[#F59E0B]" />
      <AlertTitle className="text-[#92400E] font-bold mb-2">
        ⚠️ Produk Telah Dimodifikasi
      </AlertTitle>
      <AlertDescription className="text-[#92400E]">
        <p className="mb-3">
          Produk <strong>&quot;{productName}&quot;</strong> telah diedit sejak analisis terakhir dibuat.
          Skor compliance dan rekomendasi mungkin tidak lagi akurat dengan data produk saat ini.
        </p>
        {onReanalyze && (
          <Button
            onClick={onReanalyze}
            disabled={loading}
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-[0_4px_0_0_#B45309]"
          >
            {loading ? "Menganalisis ulang..." : "Re-analyze dengan Data Terbaru"}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
