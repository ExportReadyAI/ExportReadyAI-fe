"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Wrench } from "lucide-react"
import { productService } from "@/lib/api/services"
import type { UpdateProductRequest } from "@/lib/api/types"

interface SmartRepairModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  analysisId: number
  productId: number
  fieldPath: string // e.g., "quality_specs.nutrition_facts" or "material_composition"
  fieldLabel: string // e.g., "Nutrition Facts" or "Material Composition"
  currentValue: string | number
  onRepairComplete: () => Promise<void>
}

/**
 * SmartRepairModal Component
 * 
 * Modal untuk memperbaiki data produk secara in-context (tanpa pindah halaman).
 * Setelah user save, otomatis trigger re-analyze untuk update skor.
 * 
 * Flow: Edit Field -> Save to Product API -> Trigger Reanalyze -> Refresh UI
 * 
 * @param open - Status modal open/close
 * @param onOpenChange - Handler untuk change status modal
 * @param analysisId - ID analisis yang akan di-reanalyze
 * @param productId - ID produk yang akan diedit
 * @param fieldPath - Path field yang akan diedit (dot notation untuk nested fields)
 * @param fieldLabel - Label field untuk display
 * @param currentValue - Nilai field saat ini
 * @param onRepairComplete - Callback setelah repair & reanalyze selesai
 */
export function SmartRepairModal({
  open,
  onOpenChange,
  productId,
  fieldPath,
  fieldLabel,
  currentValue,
  onRepairComplete,
}: SmartRepairModalProps) {
  const [value, setValue] = useState(currentValue || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build minimal update payload (only the field being updated)
      const updateData = buildMinimalPayload(fieldPath, value)

      // Update product using PATCH (partial update)
      await productService.update(productId, updateData as unknown as UpdateProductRequest)

      // Call onRepairComplete (for UI refresh, no auto re-analyze)
      await onRepairComplete()

      // Close modal
      onOpenChange(false)
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || "Gagal memperbaiki produk")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl border-2 border-[#e0f2fe]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#0C4A6E] text-xl font-bold">
            <Wrench className="h-5 w-5 text-[#F59E0B]" />
            Smart Repair: {fieldLabel}
          </DialogTitle>
          <DialogDescription className="text-[#0284C7]">
            Perbaiki data produk. Setelah simpan, Anda dapat melakukan re-analyze untuk memperbarui skor compliance.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="repair-field" className="text-[#0C4A6E] font-bold">
              {fieldLabel}
            </Label>
            {isMultilineField(fieldPath) ? (
              <Textarea
                id="repair-field"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Masukkan ${fieldLabel.toLowerCase()}...`}
                className="min-h-[120px] border-2 border-[#e0f2fe] focus:border-[#0284C7] rounded-xl"
              />
            ) : (
              <Input
                id="repair-field"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Masukkan ${fieldLabel.toLowerCase()}...`}
                className="border-2 border-[#e0f2fe] focus:border-[#0284C7] rounded-xl"
              />
            )}
            <p className="text-xs text-[#7DD3FC]">
              💡 Tip: Setelah data tersimpan, klik tombol &quot;Re-analyze&quot; untuk memperbarui skor compliance
            </p>
          </div>

          {error && (
            <div className="bg-[#FEE2E2] border-2 border-[#EF4444] rounded-xl p-3">
              <p className="text-sm text-[#991B1B] font-medium">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-xl"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading || !value}
            className="bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-xl shadow-[0_4px_0_0_#065985]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Helper: Build minimal payload - only the field being updated (for PATCH)
function buildMinimalPayload(fieldPath: string, value: string | number): Record<string, unknown> {
  const updateData: Record<string, unknown> = {}

  // Handle nested fields (e.g., quality_specs.nutrition_facts)
  if (fieldPath.includes('.')) {
    const [parent, child] = fieldPath.split('.')
    if (parent === 'quality_specs') {
      updateData.quality_specs = { [child]: value }
    } else if (parent === 'dimensions_l_w_h') {
      updateData.dimensions_l_w_h = {
        [child]: parseFloat(String(value)) || 0
      }
    }
  } else {
    // Handle top-level fields
    updateData[fieldPath] = value
  }

  return updateData
}

// Helper: Determine if field should use textarea
function isMultilineField(fieldPath: string): boolean {
  const multilineFields = [
    'description_local',
    'material_composition',
    'durability_claim',
    'quality_specs.ingredients',
    'quality_specs.nutrition_facts',
    'quality_specs.allergen_info',
  ]
  return multilineFields.includes(fieldPath)
}
