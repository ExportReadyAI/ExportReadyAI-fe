"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Package, Sparkles, AlertCircle, Plus, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface NoProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NoProductModal({
  open,
  onOpenChange,
}: NoProductModalProps) {
  const router = useRouter()

  const handleGoToProducts = () => {
    onOpenChange(false)
    router.push("/products/create")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <div className="text-center">
          <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-gradient-to-br from-[#F59E0B] to-[#d97706] shadow-[0_6px_0_0_#d97706] mb-6">
            <Package className="h-10 w-10 text-white" />
          </div>
          
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-[#0C4A6E]">
              Belum Ada Produk 📦
            </DialogTitle>
            <DialogDescription className="text-center text-[#0284C7] font-medium mt-2">
              Anda perlu menambahkan produk terlebih dahulu
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            {/* Info Box */}
            <div className="bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] border-2 border-[#FCD34D] rounded-2xl p-5 text-left">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#92400E] mb-2">
                    Untuk menggunakan Marketing Center:
                  </p>
                  <ol className="space-y-2 text-sm text-[#92400E]">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">1.</span>
                      <span>Tambahkan produk Anda terlebih dahulu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">2.</span>
                      <span>Enrich produk dengan AI untuk mendapatkan data yang lengkap</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">3.</span>
                      <span>Gunakan Market Intelligence & Pricing Calculator</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-[#F0F9FF] rounded-2xl p-4 text-left">
              <p className="text-sm font-bold text-[#0C4A6E] mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#F59E0B]" />
                Setelah produk di-enrich, Anda bisa:
              </p>
              <ul className="space-y-1 text-sm text-[#0284C7]">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-[#7DD3FC]" />
                  Analisis pasar & negara tujuan terbaik
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-[#7DD3FC]" />
                  Kalkulasi harga EXW, FOB, CIF
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-[#7DD3FC]" />
                  Rekomendasi strategi marketing AI
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
              onClick={handleGoToProducts}
              className="flex-1 bg-[#F59E0B] hover:bg-[#d97706] shadow-[0_4px_0_0_#d97706]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
