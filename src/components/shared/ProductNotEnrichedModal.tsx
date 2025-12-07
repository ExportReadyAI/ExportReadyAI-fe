"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, AlertCircle, Wand2, ArrowRight, Package } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProductNotEnrichedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId?: number
  productName?: string
}

export function ProductNotEnrichedModal({
  open,
  onOpenChange,
  productId,
  productName,
}: ProductNotEnrichedModalProps) {
  const router = useRouter()

  const handleGoToProduct = () => {
    onOpenChange(false)
    if (productId) {
      router.push(`/products`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <div className="text-center">
          <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-gradient-to-br from-[#8B5CF6] to-[#7c3aed] shadow-[0_6px_0_0_#6d28d9] mb-6">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-[#0C4A6E]">
              Produk Belum Di-Enrich ✨
            </DialogTitle>
            <DialogDescription className="text-center text-[#0284C7] font-medium mt-2">
              Enrich produk terlebih dahulu untuk analisis yang akurat
            </DialogDescription>
          </DialogHeader>

          {productName && (
            <div className="mt-4 bg-[#F0F9FF] rounded-2xl p-4">
              <p className="text-sm text-[#7DD3FC] font-medium mb-1">Produk yang dipilih:</p>
              <p className="font-bold text-[#0C4A6E]">{productName}</p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {/* Warning Box */}
            <div className="bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] border-2 border-[#FCD34D] rounded-2xl p-5 text-left">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#92400E] mb-2">
                    Mengapa perlu di-enrich?
                  </p>
                  <p className="text-sm text-[#92400E] leading-relaxed">
                    AI membutuhkan data produk yang lengkap (HS Code, spesifikasi, kategori) untuk memberikan analisis pasar dan rekomendasi harga yang akurat.
                  </p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-[#F0F9FF] rounded-2xl p-4 text-left">
              <p className="text-sm font-bold text-[#0C4A6E] mb-3 flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-[#8B5CF6]" />
                Cara Enrich Produk:
              </p>
              <ol className="space-y-2 text-sm text-[#0284C7]">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#8B5CF6]">1.</span>
                  <span>Buka halaman <strong>Produk Saya</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#8B5CF6]">2.</span>
                  <span>Klik produk yang ingin di-enrich</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#8B5CF6]">3.</span>
                  <span>Klik tombol <strong>"Enrich dengan AI"</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#8B5CF6]">4.</span>
                  <span>Tunggu AI melengkapi data produk</span>
                </li>
              </ol>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-r from-[#eff6ff] to-[#dbeafe] rounded-2xl p-4 text-left">
              <p className="text-sm font-bold text-[#0C4A6E] mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
                Setelah di-enrich:
              </p>
              <ul className="space-y-1 text-sm text-[#0284C7]">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-[#7DD3FC]" />
                  Data lengkap untuk analisis pasar
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-[#7DD3FC]" />
                  Rekomendasi harga yang akurat
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-[#7DD3FC]" />
                  Insight AI yang lebih detail
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Nanti Saja
            </Button>
            <Button
              onClick={handleGoToProduct}
              className="flex-1 bg-[#8B5CF6] hover:bg-[#7c3aed] shadow-[0_4px_0_0_#6d28d9]"
            >
              <Package className="mr-2 h-4 w-4" />
              Ke Halaman Produk
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
