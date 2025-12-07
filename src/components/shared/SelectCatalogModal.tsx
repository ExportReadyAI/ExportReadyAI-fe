"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, Package, CheckCircle, AlertCircle } from "lucide-react"

interface SelectCatalogModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  catalogName: string
  companyName: string
  onConfirm: () => void
  loading: boolean
  success: boolean
  error: string | null
}

export function SelectCatalogModal({
  open,
  onOpenChange,
  catalogName,
  companyName,
  onConfirm,
  loading,
  success,
  error
}: SelectCatalogModalProps) {
  const handleClose = () => {
    if (!loading) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          // Success State
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E]/10">
                  <CheckCircle className="h-8 w-8 text-[#22C55E]" />
                </div>
              </div>
              <DialogTitle className="text-center text-2xl">Berhasil!</DialogTitle>
              <DialogDescription className="text-center">
                Katalog berhasil dipilih dan request Anda telah ditutup.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button
                onClick={handleClose}
                className="bg-[#22C55E] hover:bg-[#16a34a] shadow-[0_4px_0_0_#15803d]"
              >
                OK
              </Button>
            </DialogFooter>
          </>
        ) : (
          // Confirmation State
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F59E0B]/10">
                  <Star className="h-8 w-8 text-[#F59E0B]" />
                </div>
              </div>
              <DialogTitle className="text-center text-2xl">Pilih Katalog Ini?</DialogTitle>
              <DialogDescription className="text-center">
                Anda akan memilih katalog dari supplier ini
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3 p-4 bg-[#F0F9FF] rounded-xl">
                <Package className="h-5 w-5 text-[#0284C7] flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#0284C7]">Katalog</p>
                  <p className="text-base font-bold text-[#0C4A6E]">{catalogName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#F0F9FF] rounded-xl">
                <Star className="h-5 w-5 text-[#0284C7] flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#0284C7]">Supplier</p>
                  <p className="text-base font-bold text-[#0C4A6E]">{companyName}</p>
                </div>
              </div>
            </div>

            <Alert className="border-[#F59E0B] bg-[#FEF3C7]">
              <AlertCircle className="h-4 w-4 text-[#F59E0B]" />
              <AlertDescription className="text-[#92400E]">
                Request Anda akan <strong>ditutup</strong> setelah memilih katalog ini. Tindakan ini tidak dapat dibatalkan.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="sm:justify-center gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 bg-[#22C55E] hover:bg-[#16a34a] shadow-[0_4px_0_0_#15803d]"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Ya, Pilih Katalog Ini
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
