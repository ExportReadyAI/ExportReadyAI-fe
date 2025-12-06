"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Trash2, FileText, Globe } from "lucide-react"

interface DeleteAnalysisModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  productName?: string
  countryName?: string
}

export function DeleteAnalysisModal({
  open,
  onOpenChange,
  onConfirm,
  productName,
  countryName,
}: DeleteAnalysisModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)

    try {
      await onConfirm()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Gagal menghapus analisis")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogClose onClose={handleClose} />
        
        <div className="text-center mb-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#FEE2E2] mb-4">
            <FileText className="h-8 w-8 text-[#EF4444]" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Hapus Analisis? 📊</DialogTitle>
            <DialogDescription className="text-center">
              Tindakan ini tidak dapat dibatalkan
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {productName && countryName && (
            <div className="bg-[#F0F9FF] rounded-2xl p-4 text-center">
              <p className="text-sm text-[#7DD3FC] font-medium mb-1">Analisis yang akan dihapus</p>
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-4 w-4 text-[#0284C7]" />
                <p className="font-extrabold text-[#0C4A6E]">{productName}</p>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Globe className="h-4 w-4 text-[#0284C7]" />
                <p className="font-bold text-[#0C4A6E]">{countryName}</p>
              </div>
            </div>
          )}

          <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-2xl p-4">
            <p className="font-bold text-[#991B1B] mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Data yang akan dihapus:
            </p>
            <ul className="text-sm text-[#991B1B] space-y-1 list-disc list-inside">
              <li>Hasil analisis compliance</li>
              <li>Readiness score</li>
              <li>Rekomendasi</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menghapus...</span>
              </div>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Analisis
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


