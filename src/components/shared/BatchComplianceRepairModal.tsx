"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wrench, AlertTriangle, CheckCircle2 } from "lucide-react"
import { productService } from "@/lib/api/services"
import type { UpdateProductRequest, ComplianceIssue, Product } from "@/lib/api/types"

interface BatchComplianceRepairModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: number
  complianceIssues: ComplianceIssue[]
  onRepairComplete: () => Promise<void>
}

interface FieldEdit {
  path: string
  label: string
  description: string // Description dari compliance issue
  severity: string // Severity level (critical, major, minor)
  requiredValue: string | number // Required value dari backend
  originalValue: string | number
  currentValue: string | number
  hasChanged: boolean
}

/**
 * BatchComplianceRepairModal Component
 * 
 * Modal untuk memperbaiki multiple compliance issues sekaligus.
 * User dapat mengedit beberapa field, dan semua perubahan akan di-save dalam satu request.
 * 
 * Flow: Edit Multiple Fields -> Update All Changes (PATCH) -> Refresh UI
 * 
 * @param open - Status modal open/close
 * @param onOpenChange - Handler untuk change status modal
 * @param productId - ID produk yang akan diedit
 * @param complianceIssues - Array of compliance issues from analysis
 * @param onRepairComplete - Callback setelah repair selesai
 */
export function BatchComplianceRepairModal({
  open,
  onOpenChange,
  productId,
  complianceIssues,
  onRepairComplete,
}: BatchComplianceRepairModalProps) {
  const [fields, setFields] = useState<FieldEdit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)

  // Fetch current product data untuk merge quality_specs
  const fetchProductData = useCallback(async () => {
    try {
      const response = await productService.get(productId)
      // Handle wrapped or direct response
      const productData = 'data' in response ? (response as { data: Product }).data : response
      setCurrentProduct(productData as Product)
    } catch (err) {
      console.error('Failed to fetch product data:', err)
    }
  }, [productId])

  // Fetch product saat modal dibuka
  useEffect(() => {
    if (open && productId) {
      void fetchProductData()
    }
  }, [open, productId, fetchProductData])

  // Initialize fields from compliance issues
  useEffect(() => {
    if (open && complianceIssues.length > 0) {
      const initialFields: FieldEdit[] = complianceIssues
        .filter(issue => issue.your_value && issue.required_value) // Only issues with values
        .map(issue => ({
          path: getFieldPathFromIssue(issue),
          label: issue.type,
          description: issue.description,
          severity: issue.severity,
          requiredValue: issue.required_value || "",
          originalValue: issue.your_value || "",
          currentValue: issue.your_value || "",
          hasChanged: false,
        }))
      setFields(initialFields)
    }
  }, [open, complianceIssues])

  const handleFieldChange = (index: number, newValue: string | number) => {
    setFields(prevFields => {
      const updated = [...prevFields]
      updated[index].currentValue = newValue
      updated[index].hasChanged = newValue !== updated[index].originalValue
      return updated
    })
  }

  const hasAnyChanges = fields.some(field => field.hasChanged)

  const handleUpdateAll = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build update payload with all changed fields
      const updateData = buildBatchUpdatePayload(
        fields.filter(f => f.hasChanged),
        currentProduct
      )

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

  const handleReset = () => {
    setFields(prevFields =>
      prevFields.map(field => ({
        ...field,
        currentValue: field.originalValue,
        hasChanged: false,
      }))
    )
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-white rounded-3xl border-2 border-[#e0f2fe]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#0C4A6E] text-xl font-bold">
            <Wrench className="h-5 w-5 text-[#F59E0B]" />
            Batch Compliance Repair
          </DialogTitle>
          <DialogDescription className="text-[#0284C7]">
            Perbaiki semua compliance issues sekaligus. Perubahan akan disimpan ketika Anda klik tombol &quot;Update All Changes&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {fields.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-[#22C55E] mx-auto mb-3" />
              <p className="font-bold text-[#0C4A6E]">Tidak Ada Issues yang Bisa Diperbaiki!</p>
              <p className="text-sm text-[#7DD3FC]">Semua compliance issues tidak memiliki nilai yang dapat diedit</p>
            </div>
          ) : (
            <>
              {fields.map((field, index) => (
                <div
                  key={index}
                  className={`space-y-2 p-4 rounded-2xl border-2 transition-colors ${
                    field.hasChanged
                      ? 'bg-[#FEF3C7] border-[#F59E0B]'
                      : 'bg-[#F0F9FF] border-[#e0f2fe]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`field-${index}`} className="text-[#0C4A6E] font-bold flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        field.severity === 'critical' ? 'text-[#EF4444]' : 
                        field.severity === 'major' ? 'text-[#F59E0B]' : 
                        'text-[#0284C7]'
                      }`} />
                      {field.label}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        field.severity === 'critical' ? 'destructive' : 
                        field.severity === 'major' ? 'accent' : 
                        'outline'
                      } className="text-xs">
                        {field.severity}
                      </Badge>
                      {field.hasChanged && (
                        <Badge variant="accent" className="text-xs">
                          Modified
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Issue Description */}
                  <div className="bg-white/70 rounded-xl p-3 mb-3 border border-[#BAE6FD]">
                    <p className="text-sm text-[#0C4A6E] leading-relaxed">
                      <strong className="text-[#0284C7]">Issue:</strong> {field.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-xs">
                        <span className="text-[#7DD3FC] font-semibold">Current Value:</span>
                        <p className="text-[#0C4A6E] font-mono mt-1 wrap-break-word">{String(field.originalValue)}</p>
                      </div>
                      <div className="text-xs">
                        <span className="text-[#22C55E] font-semibold">Required Value:</span>
                        <p className="text-[#0C4A6E] font-mono mt-1 wrap-break-word">{String(field.requiredValue)}</p>
                      </div>
                    </div>
                  </div>

                  {isMultilineField(field.path) ? (
                    <Textarea
                      id={`field-${index}`}
                      value={field.currentValue}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                      className="min-h-[100px] border-2 border-[#e0f2fe] focus:border-[#0284C7] rounded-xl"
                    />
                  ) : (
                    <Input
                      id={`field-${index}`}
                      value={field.currentValue}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                      className="border-2 border-[#e0f2fe] focus:border-[#0284C7] rounded-xl"
                    />
                  )}
                </div>
              ))}

              <div className="bg-[#E0F2FE] border-2 border-[#0284C7] rounded-xl p-4 mt-4">
                <p className="text-xs text-[#0C4A6E]">
                  💡 <strong>Tip:</strong> Edit semua field yang diperlukan, kemudian klik tombol &quot;Update All Changes&quot; untuk menyimpan semua perubahan sekaligus. Setelah itu, klik &quot;Re-analyze&quot; untuk memperbarui skor compliance.
                </p>
              </div>
            </>
          )}

          {error && (
            <div className="bg-[#FEE2E2] border-2 border-[#EF4444] rounded-xl p-3">
              <p className="text-sm text-[#991B1B] font-medium">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-xl"
          >
            Batal
          </Button>
          {hasAnyChanges && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="rounded-xl"
            >
              Reset Changes
            </Button>
          )}
          <Button
            type="button"
            onClick={handleUpdateAll}
            disabled={loading || !hasAnyChanges}
            className="bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-xl shadow-[0_4px_0_0_#065985] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Update All Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Helper: Map issue type to product field path
function getFieldPathFromIssue(issue: ComplianceIssue): string {
  const typeToFieldMap: Record<string, string> = {
    "Material Composition": "material_composition",
    "Nutrition Facts": "quality_specs.nutrition_facts",
    "Allergen Info": "quality_specs.allergen_info",
    "Ingredients": "quality_specs.ingredients",
    "Packaging Type": "packaging_type",
    "Durability Claim": "durability_claim",
  }
  return typeToFieldMap[issue.type] || "description_local"
}

// Helper: Build batch update payload - combine all changed fields
function buildBatchUpdatePayload(
  changedFields: FieldEdit[],
  currentProduct: Product | null
): Record<string, unknown> {
  const updateData: Record<string, unknown> = {}
  const qualitySpecs: Record<string, unknown> = {
    // Start with existing quality_specs dari currentProduct
    ...(currentProduct?.quality_specs || {})
  }
  const dimensions: Record<string, unknown> = {}

  changedFields.forEach(field => {
    const { path, currentValue } = field

    // Handle nested fields
    if (path.includes('.')) {
      const [parent, child] = path.split('.')
      if (parent === 'quality_specs') {
        // Merge ke existing quality_specs
        qualitySpecs[child] = currentValue
      } else if (parent === 'dimensions_l_w_h') {
        dimensions[child] = parseFloat(String(currentValue)) || 0
      }
    } else {
      // Handle top-level fields
      updateData[path] = currentValue
    }
  })

  // Always include quality_specs if there are changes (merged dengan existing)
  if (Object.keys(qualitySpecs).length > 0) {
    updateData.quality_specs = qualitySpecs
  }
  if (Object.keys(dimensions).length > 0) {
    updateData.dimensions_l_w_h = dimensions
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
