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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Trash2, Package, FileText, Calculator, Building2 } from "lucide-react"

interface DeleteAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  userEmail?: string
}

export function DeleteAccountModal({
  open,
  onOpenChange,
  onConfirm,
  userEmail,
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    if (confirmText !== "DELETE") {
      setError("Harap ketik 'DELETE' untuk konfirmasi")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onConfirm()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Gagal menghapus akun")
    } finally {
      setLoading(false)
      setConfirmText("")
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setConfirmText("")
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogClose onClose={handleClose} />
        
        <div className="text-center mb-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#FEE2E2] mb-4">
            <AlertTriangle className="h-8 w-8 text-[#EF4444]" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Hapus Akun? 😢</DialogTitle>
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

          {/* Warning Box */}
          <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-2xl p-4">
            <p className="font-bold text-[#991B1B] mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Data yang akan dihapus:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Building2, text: "Profil Bisnis" },
                { icon: Package, text: "Semua Produk" },
                { icon: FileText, text: "Analisis Ekspor" },
                { icon: Calculator, text: "Data Costing" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2">
                  <item.icon className="h-4 w-4 text-[#EF4444]" />
                  <span className="text-sm font-medium text-[#991B1B]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {userEmail && (
            <div className="bg-[#F0F9FF] rounded-2xl p-4 text-center">
              <p className="text-sm text-[#7DD3FC] font-medium mb-1">Akun yang akan dihapus</p>
              <p className="font-bold text-[#0C4A6E]">{userEmail}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-center block">
              Ketik <span className="font-extrabold text-[#EF4444]">DELETE</span> untuk konfirmasi
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value.toUpperCase())
                setError(null)
              }}
              placeholder="DELETE"
              disabled={loading}
              className="text-center font-bold tracking-widest"
            />
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
            disabled={loading || confirmText !== "DELETE"}
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
                Hapus Akun
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
