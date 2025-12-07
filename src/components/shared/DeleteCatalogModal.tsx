"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"

interface DeleteCatalogModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  catalogName: string
  onConfirm: () => Promise<void>
  loading?: boolean
  error?: string | null
}

export function DeleteCatalogModal({
  open,
  onOpenChange,
  catalogName,
  onConfirm,
  loading = false,
  error = null,
}: DeleteCatalogModalProps) {
  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            Hapus Katalog
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Apakah Anda yakin ingin menghapus katalog ini?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong className="font-semibold">Peringatan:</strong> Tindakan ini tidak dapat dibatalkan.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Katalog yang akan dihapus:</p>
            <p className="font-semibold text-gray-900">{catalogName}</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Ya, Hapus
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
