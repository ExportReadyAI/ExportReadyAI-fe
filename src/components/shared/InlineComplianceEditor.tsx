"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, RotateCcw, Plus, Trash2, Package } from "lucide-react"
import { productService } from "@/lib/api/services"
import type { ComplianceIssue, Product } from "@/lib/api/types"

interface InlineComplianceEditorProps {
  productId: number
  complianceIssues: ComplianceIssue[] // Kept for type compatibility, not used in logic
  currentProduct: Product | null
  onSaveComplete: () => Promise<void>
}

interface ProductField {
  key: string
  label: string
  value: string | number
  isChanged: boolean
  originalValue: string | number
  type: 'text' | 'textarea' | 'number'
}

interface QualitySpecField {
  key: string
  label: string
  value: string | number
  isChanged: boolean
  originalValue: string | number
  isNew: boolean
  keyEditable: boolean
}

/**
 * InlineComplianceEditor Component - FULL PRODUCT EDITOR
 * 
 * Menampilkan SELURUH atribut produk untuk diedit.
 * User bisa mengubah atribut sesuai rekomendasi AI.
 * 
 * Features:
 * - Edit semua top-level attributes
 * - Edit semua quality_specs attributes (nama & value)
 * - Add new quality_specs attributes
 * - Compliance issues sebagai reference
 */
export function InlineComplianceEditor({
  productId,
  complianceIssues: _, // eslint-disable-line @typescript-eslint/no-unused-vars
  currentProduct,
  onSaveComplete,
}: InlineComplianceEditorProps) {
  const [productFields, setProductFields] = useState<ProductField[]>([])
  const [qualitySpecFields, setQualitySpecFields] = useState<QualitySpecField[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Initialize fields dari product data
  useEffect(() => {
    if (currentProduct) {
      // Top-level product fields
      const topLevelFields: ProductField[] = [
        { key: 'name_local', label: 'Product Name (Local)', value: currentProduct.name_local || '', originalValue: currentProduct.name_local || '', isChanged: false, type: 'text' },
        { key: 'description_local', label: 'Description (Local)', value: currentProduct.description_local || '', originalValue: currentProduct.description_local || '', isChanged: false, type: 'textarea' },
        { key: 'material_composition', label: 'Material Composition', value: currentProduct.material_composition || '', originalValue: currentProduct.material_composition || '', isChanged: false, type: 'textarea' },
        { key: 'production_technique', label: 'Production Technique', value: currentProduct.production_technique || '', originalValue: currentProduct.production_technique || '', isChanged: false, type: 'text' },
        { key: 'finishing_type', label: 'Finishing Type', value: currentProduct.finishing_type || '', originalValue: currentProduct.finishing_type || '', isChanged: false, type: 'text' },
        { key: 'durability_claim', label: 'Durability Claim', value: currentProduct.durability_claim || '', originalValue: currentProduct.durability_claim || '', isChanged: false, type: 'text' },
        { key: 'packaging_type', label: 'Packaging Type', value: currentProduct.packaging_type || '', originalValue: currentProduct.packaging_type || '', isChanged: false, type: 'text' },
        { key: 'weight_net', label: 'Net Weight', value: currentProduct.weight_net || '', originalValue: currentProduct.weight_net || '', isChanged: false, type: 'text' },
        { key: 'weight_gross', label: 'Gross Weight', value: currentProduct.weight_gross || '', originalValue: currentProduct.weight_gross || '', isChanged: false, type: 'text' },
      ]
      setProductFields(topLevelFields)

      // Quality specs fields
      const qualitySpecs = currentProduct.quality_specs || {}
      const qualityFields: QualitySpecField[] = Object.entries(qualitySpecs).map(([key, value]) => ({
        key,
        label: formatLabel(key),
        value: String(value),
        originalValue: String(value),
        isChanged: false,
        isNew: false,
        keyEditable: true,
      }))
      setQualitySpecFields(qualityFields)
    }
  }, [currentProduct])

  const handleProductFieldChange = (index: number, newValue: string | number) => {
    setProductFields(prev => {
      const updated = [...prev]
      updated[index].value = newValue
      updated[index].isChanged = newValue !== updated[index].originalValue
      return updated
    })
  }

  const handleQualitySpecValueChange = (index: number, newValue: string | number) => {
    setQualitySpecFields(prev => {
      const updated = [...prev]
      updated[index].value = newValue
      updated[index].isChanged = newValue !== updated[index].originalValue
      return updated
    })
  }

  const handleQualitySpecKeyChange = (index: number, newKey: string) => {
    setQualitySpecFields(prev => {
      const updated = [...prev]
      updated[index].key = newKey
      updated[index].label = formatLabel(newKey)
      updated[index].isChanged = true
      return updated
    })
  }

  const handleAddQualitySpec = () => {
    const newField: QualitySpecField = {
      key: '',
      label: '',
      value: '',
      originalValue: '',
      isChanged: false,
      isNew: true,
      keyEditable: true,
    }
    setQualitySpecFields(prev => [...prev, newField])
  }

  const handleRemoveQualitySpec = (index: number) => {
    setQualitySpecFields(prev => prev.filter((_, i) => i !== index))
  }

  const handleReset = () => {
    setProductFields(prev =>
      prev.map(field => ({
        ...field,
        value: field.originalValue,
        isChanged: false,
      }))
    )
    setQualitySpecFields(prev =>
      prev.filter(f => !f.isNew).map(field => ({
        ...field,
        value: field.originalValue,
        isChanged: false,
      }))
    )
    setError(null)
    setSuccess(false)
  }

  const hasAnyChanges = 
    productFields.some(f => f.isChanged) || 
    qualitySpecFields.some(f => f.isChanged || f.isNew)

  const handleSaveAll = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      // Build update payload
      const updateData: Record<string, unknown> = {}

      // Add changed product fields
      productFields.forEach(field => {
        if (field.isChanged) {
          updateData[field.key] = field.value
        }
      })

      // Build quality_specs
      const qualitySpecs: Record<string, unknown> = {}
      qualitySpecFields.forEach(field => {
        if (field.key && field.value) {
          const sanitizedKey = field.key.toLowerCase().replace(/ /g, "_").replace(/[^a-z0-9_]/g, "")
          qualitySpecs[sanitizedKey] = field.value
        }
      })

      if (Object.keys(qualitySpecs).length > 0) {
        updateData.quality_specs = qualitySpecs
      }

      console.log("=== Full Product Update Payload ===")
      console.log(JSON.stringify(updateData, null, 2))

      // Update product (PATCH allows partial updates)
      await productService.update(productId, updateData as unknown as Parameters<typeof productService.update>[1])

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      // Refresh analysis
      await onSaveComplete()

      // Reset new fields after successful save
      setQualitySpecFields(prev => prev.filter(f => !f.isNew || (f.key && f.value)))
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || "Gagal menyimpan perubahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0C4A6E]">Product Attributes Editor</h3>
          <p className="text-sm text-[#7DD3FC]">Edit semua atribut produk untuk menyesuaikan dengan rekomendasi AI</p>
        </div>
        <div className="flex gap-2">
          {hasAnyChanges && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSaveAll}
            disabled={loading || !hasAnyChanges}
            className="bg-[#0284C7] hover:bg-[#0369a1]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="bg-[#D1FAE5] border-[#22C55E]">
          <AlertDescription className="text-[#065F46] font-medium">
            ✅ Perubahan berhasil disimpan! Silakan lakukan Re-analyze untuk update skor.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-[#FEE2E2] border-[#EF4444]">
          <AlertDescription className="text-[#991B1B] font-medium">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Table 1: Product Attributes */}
      <div className="border-2 border-[#e0f2fe] rounded-2xl overflow-hidden">
        <div className="bg-[#0284C7] p-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Package className="h-4 w-4" />
            Product Attributes
          </h4>
        </div>
        <table className="w-full">
          <thead className="bg-[#E0F2FE]">
            <tr>
              <th className="text-left p-3 text-sm font-bold text-[#0C4A6E] w-1/3">Attribute</th>
              <th className="text-left p-3 text-sm font-bold text-[#0C4A6E]">Current Value</th>
              <th className="text-center p-3 text-sm font-bold text-[#0C4A6E] w-24">Status</th>
            </tr>
          </thead>
          <tbody>
            {productFields.map((field, index) => (
              <tr key={field.key} className={`border-t border-[#e0f2fe] ${field.isChanged ? 'bg-[#FEF3C7]' : 'bg-white'}`}>
                <td className="p-3">
                  <span className="font-bold text-[#0C4A6E]">{field.label}</span>
                </td>
                <td className="p-3">
                  {field.type === 'textarea' ? (
                    <Textarea
                      value={field.value}
                      onChange={(e) => handleProductFieldChange(index, e.target.value)}
                      className="w-full border-2 border-[#e0f2fe] focus:border-[#0284C7] rounded-xl"
                      rows={3}
                      disabled={loading}
                    />
                  ) : (
                    <Input
                      value={field.value}
                      onChange={(e) => handleProductFieldChange(index, e.target.value)}
                      className="w-full border-2 border-[#e0f2fe] focus:border-[#0284C7] rounded-xl"
                      disabled={loading}
                    />
                  )}
                </td>
                <td className="p-3 text-center">
                  {field.isChanged ? (
                    <Badge variant="accent" className="text-xs">Modified</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Original</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table 2: Quality Specs (Editable Keys) */}
      <div className="border-2 border-[#0284C7] rounded-2xl overflow-hidden">
        <div className="bg-[#0284C7] p-3 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">Quality Specifications (Attribute & Value Editable)</h4>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAddQualitySpec}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Specification
          </Button>
        </div>
        <table className="w-full">
          <thead className="bg-[#E0F2FE]">
            <tr>
              <th className="text-left p-3 text-sm font-bold text-[#0C4A6E] w-1/3">Attribute Name</th>
              <th className="text-left p-3 text-sm font-bold text-[#0C4A6E]">Value</th>
              <th className="text-center p-3 text-sm font-bold text-[#0C4A6E] w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {qualitySpecFields.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-[#7DD3FC]">
                  Klik &quot;Add Specification&quot; untuk menambah quality specs
                </td>
              </tr>
            ) : (
              qualitySpecFields.map((field, index) => (
                <tr key={index} className={`border-t border-[#e0f2fe] ${field.isChanged || field.isNew ? 'bg-[#F0F9FF]' : 'bg-white'}`}>
                  <td className="p-3">
                    <Input
                      value={field.key}
                      onChange={(e) => handleQualitySpecKeyChange(index, e.target.value)}
                      placeholder="attribute_name"
                      className="w-full border-2 border-[#e0f2fe] focus:border-[#0284C7] rounded-xl font-mono text-sm"
                      disabled={loading}
                    />
                  </td>
                  <td className="p-3">
                    <Textarea
                      value={field.value}
                      onChange={(e) => handleQualitySpecValueChange(index, e.target.value)}
                      placeholder="Value..."
                      className="w-full border-2 border-[#e0f2fe] focus:border-[#0284C7] rounded-xl"
                      rows={2}
                      disabled={loading}
                    />
                  </td>
                  <td className="p-3 text-center">
                    {field.isNew ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveQualitySpec(index)}
                        disabled={loading}
                        className="text-[#EF4444] hover:bg-[#FEE2E2]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : field.isChanged ? (
                      <Badge variant="accent" className="text-xs">Modified</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Original</Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info Box */}
      <div className="bg-[#E0F2FE] border-2 border-[#0284C7] rounded-xl p-4">
        <p className="text-xs text-[#0C4A6E]">
          <strong>💡 Tip:</strong> Gunakan Compliance Issues dan Recommendations sebagai panduan untuk mengedit atribut produk. 
          Untuk Quality Specs, Anda bisa mengedit nama atribut dan nilainya, atau menambah atribut baru sesuai kebutuhan regulasi.
        </p>
      </div>
    </div>
  )
}

// Helper function
function formatLabel(key: string): string {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
