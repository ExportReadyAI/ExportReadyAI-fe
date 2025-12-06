"use client"

import { useState } from "react"
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
import { buyerRequestService } from "@/lib/api/services"
import type { BuyerRequest } from "@/lib/api/types"
import { AlertTriangle } from "lucide-react"

interface DeleteBuyerRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: BuyerRequest
  onSuccess: () => void
}

export function DeleteBuyerRequestModal({
  open,
  onOpenChange,
  request,
  onSuccess,
}: DeleteBuyerRequestModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    try {
      setLoading(true)
      setError(null)

      await buyerRequestService.delete(request.id)

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Gagal menghapus buyer request"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_6px_0_0_#0284C7] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-[#0C4A6E] flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            Hapus Buyer Request
          </DialogTitle>
          <DialogDescription className="text-gray-600 pt-2">
            Apakah Anda yakin ingin menghapus buyer request ini? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-[#F0F9FF] rounded-2xl p-4 border border-[#e0f2fe]">
            <p className="font-bold text-[#0C4A6E] mb-1">{request.product_category}</p>
            <p className="text-sm text-gray-600 line-clamp-2">{request.spec_requirements}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Target: {request.target_volume.toLocaleString()} units</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{request.destination_country}</span>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-2xl"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-2xl shadow-[0_4px_0_0_#be123c]"
          >
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

