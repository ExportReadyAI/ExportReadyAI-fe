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
import { Sparkles, RefreshCw, FileText, Globe, AlertCircle } from "lucide-react"

interface ReanalyzeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  productName?: string
  countryName?: string
}

export function ReanalyzeModal({
  open,
  onOpenChange,
  onConfirm,
  productName,
  countryName,
}: ReanalyzeModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)

    try {
      await onConfirm()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Gagal re-analyze")
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
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#FEF3C7] mb-4">
            <Sparkles className="h-8 w-8 text-[#F59E0B]" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Re-analyze? 🔄</DialogTitle>
            <DialogDescription className="text-center">
              Analisis ulang dengan AI
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
              <p className="text-sm text-[#7DD3FC] font-medium mb-1">Analisis yang akan di-update</p>
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

          <div className="bg-[#FEF3C7] border-2 border-[#FDE68A] rounded-2xl p-4">
            <p className="font-bold text-[#92400e] mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Perhatian:
            </p>
            <p className="text-sm text-[#92400e]">
              Hasil analisis sebelumnya akan di-overwrite dengan hasil analisis baru dari AI.
            </p>
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
            variant="accent"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Menganalisis...</span>
              </div>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-analyze
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


