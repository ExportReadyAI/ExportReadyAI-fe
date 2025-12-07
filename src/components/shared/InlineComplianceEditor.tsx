"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, RotateCcw, AlertTriangle, Plus, Trash2 } from "lucide-react"
import { productService } from "@/lib/api/services"
import type { ComplianceIssue, Product } from "@/lib/api/types"

interface InlineComplianceEditorProps {
  productId: number
  complianceIssues: ComplianceIssue[]
  currentProduct: Product | null
  onSaveComplete: () => Promise<void>
}

interface EditableField {
  path: string
  label: string
  value: string | number
  isNew: boolean // Apakah field baru ditambahkan user
  isChanged: boolean
  originalValue: string | number
}

/**
 * InlineComplianceEditor Component
 * 
 * Inline table editor untuk memperbaiki compliance issues dan menambah atribut baru.
 * Format: Label | Value dengan value yang bisa diedit langsung.
 * 
 * Features:
 * - Edit existing fields dari compliance issues
 * - Add new attributes ke quality_specs
 * - Show original values jika sudah ada di product
 * - One-click save untuk semua perubahan
 */
export function InlineComplianceEditor({
  productId,
  complianceIssues,
  currentProduct,
  onSaveComplete,
}: InlineComplianceEditorProps) {
  const [fields, setFields] = useState<EditableField[]>([])
  const [newFields, setNewFields] = useState<EditableField[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Initialize fields dari compliance issues
  useEffect(() => {
    if (complianceIssues.length > 0 && currentProduct) {
      const initialFields: EditableField[] = complianceIssues
        .filter(issue => issue.your_value && issue.required_value)
        .map(issue => {
          const path = getFieldPathFromIssue(issue)
          const currentValue = getCurrentValueFromProduct(path, currentProduct)
          
          return {
            path,
            label: issue.type,
            value: currentValue || issue.your_value || "",
            isNew: false,
            isChanged: false,
            originalValue: currentValue || issue.your_value || "",
          }
        })
      setFields(initialFields)
    }
  }, [complianceIssues, currentProduct])

  const handleFieldChange = (index: number, newValue: string | number, isNewField: boolean = false) => {
    if (isNewField) {
      setNewFields(prev => {
        const updated = [...prev]
        updated[index].value = newValue
        updated[index].isChanged = newValue !== updated[index].originalValue
        return updated
      })
    } else {
      setFields(prev => {
        const updated = [...prev]
        updated[index].value = newValue
        updated[index].isChanged = newValue !== updated[index].originalValue
        return updated
      })
    }
  }

  const handleLabelChange = (index: number, newLabel: string) => {
    setNewFields(prev => {
      const updated = [...prev]
      updated[index].label = newLabel
      return updated
    })
  }

  const handleAddNewField = () => {
    const newField: EditableField = {
      path: `quality_specs.new_${Date.now()}`, // Temporary path
      label: "",
      value: "",
      isNew: true,
      isChanged: false,
      originalValue: "",
    }
    setNewFields(prev => [...prev, newField])
  }

  const handleRemoveNewField = (index: number) => {
    setNewFields(prev => prev.filter((_, i) => i !== index))
  }

  const handleReset = () => {
    setFields(prev =>
      prev.map(field => ({
        ...field,
        value: field.originalValue,
        isChanged: false,
      }))
    )
    setNewFields([])
    setError(null)
    setSuccess(false)
  }

  const hasAnyChanges = fields.some(f => f.isChanged) || newFields.some(f => f.value)

  const handleSaveAll = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      // Build update payload
      const updateData = buildUpdatePayload(
        [...fields.filter(f => f.isChanged), ...newFields.filter(f => f.label && f.value)],
        currentProduct
      )

      // Update product
      await productService.update(productId, updateData)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      // Refresh analysis
      await onSaveComplete()

      // Reset new fields after successful save
      setNewFields([])
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || "Gagal menyimpan perubahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header dengan tombol aksi */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0C4A6E]">Product Attributes Editor</h3>
          <p className="text-sm text-[#7DD3FC]">Edit atribut langsung di tabel. Label | Value</p>
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

      {/* Table: Existing Fields from Compliance Issues */}
      <div className="border-2 border-[#e0f2fe] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#E0F2FE]">
            <tr>
              <th className="text-left p-3 text-sm font-bold text-[#0C4A6E] w-1/3">Label</th>
              <th className="text-left p-3 text-sm font-bold text-[#0C4A6E]">Value</th>
              <th className="text-center p-3 text-sm font-bold text-[#0C4A6E] w-24">Status</th>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-[#7DD3FC]">
                  Tidak ada field yang perlu diperbaiki
                </td>
              </tr>
            ) : (
              fields.map((field, index) => (
                <tr key={index} className={`border-t border-[#e0f2fe] ${field.isChanged ? 'bg-[#FEF3C7]' : 'bg-white'}`}>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
                      <span className="font-bold text-[#0C4A6E]">{field.label}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    {isMultilineField(field.path) ? (
                      <Textarea
                        value={field.value}
                        onChange={(e) => handleFieldChange(index, e.target.value)}
                        className="w-full border-2 border-[#e0f2fe] focus:border-[#0284C7] rounded-xl"
                        rows={3}
                        disabled={loading}
                      />
                    ) : (
                      <Input
                        value={field.value}
                        onChange={(e) => handleFieldChange(index, e.target.value)}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Attributes Section */}
      <div className="border-2 border-[#0284C7] rounded-2xl overflow-hidden">
        <div className="bg-[#0284C7] p-3 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">Tambah Atribut Baru (quality_specs)</h4>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAddNewField}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Attribute
          </Button>
        </div>
        <table className="w-full">
          <thead className="bg-[#E0F2FE]">
            <tr>
              <th className="text-left p-3 text-sm font-bold text-[#0C4A6E] w-1/3">Label</th>
              <th className="text-left p-3 text-sm font-bold text-[#0C4A6E]">Value</th>
              <th className="text-center p-3 text-sm font-bold text-[#0C4A6E] w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {newFields.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-[#7DD3FC]">
                  Klik &quot;Add Attribute&quot; untuk menambah atribut baru
                </td>
              </tr>
            ) : (
              newFields.map((field, index) => (
                <tr key={index} className="border-t border-[#e0f2fe] bg-[#F0F9FF]">
                  <td className="p-3">
                    <Input
                      value={field.label}
                      onChange={(e) => handleLabelChange(index, e.target.value)}
                      placeholder="Nama atribut..."
                      className="w-full border-2 border-[#e0f2fe] focus:border-[#0284C7] rounded-xl"
                      disabled={loading}
                    />
                  </td>
                  <td className="p-3">
                    <Textarea
                      value={field.value}
                      onChange={(e) => handleFieldChange(index, e.target.value, true)}
                      placeholder="Nilai atribut..."
                      className="w-full border-2 border-[#e0f2fe] focus:border-[#0284C7] rounded-xl"
                      rows={2}
                      disabled={loading}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveNewField(index)}
                      disabled={loading}
                      className="text-[#EF4444] hover:bg-[#FEE2E2]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
          <strong>💡 Tip:</strong> Value yang sudah ada di product akan ditampilkan. Edit langsung di kolom Value, 
          lalu klik &quot;Save All Changes&quot;. Atribut baru akan ditambahkan ke quality_specs.
        </p>
      </div>
    </div>
  )
}

// Helper functions
function getFieldPathFromIssue(issue: ComplianceIssue): string {
  const typeToFieldMap: Record<string, string> = {
    "Material Composition": "material_composition",
    "Nutrition Facts": "quality_specs.nutrition_facts",
    "Allergen Info": "quality_specs.allergen_info",
    "Ingredients": "quality_specs.ingredients",
    "Packaging Type": "packaging_type",
    "Durability Claim": "durability_claim",
    "Country of Origin": "quality_specs.country_of_origin",
    "FDA Registration": "quality_specs.fda_registration_status",
    "Material Grade": "quality_specs.material_grade",
    "Labeling Compliance": "quality_specs.labeling_compliance",
  }
  return typeToFieldMap[issue.type] || "quality_specs." + issue.type.toLowerCase().replace(/ /g, "_")
}

function getCurrentValueFromProduct(path: string, product: Product): string | number {
  if (!product) return ""
  
  if (path.includes('.')) {
    const [parent, child] = path.split('.')
    if (parent === 'quality_specs' && product.quality_specs) {
      return (product.quality_specs as any)[child] || ""
    }
  } else {
    return (product as any)[path] || ""
  }
  
  return ""
}

function buildUpdatePayload(
  changedFields: EditableField[],
  currentProduct: Product | null
): Record<string, unknown> {
  const updateData: Record<string, unknown> = {}
  const qualitySpecs: Record<string, unknown> = {
    ...(currentProduct?.quality_specs || {})
  }

  changedFields.forEach(field => {
    const { path, value, label, isNew } = field

    if (isNew) {
      // New attribute -> add to quality_specs dengan label sebagai key
      const key = label.toLowerCase().replace(/ /g, "_")
      qualitySpecs[key] = value
    } else if (path.includes('.')) {
      const [parent, child] = path.split('.')
      if (parent === 'quality_specs') {
        qualitySpecs[child] = value
      }
    } else {
      updateData[path] = value
    }
  })

  // Always include quality_specs (merged)
  if (Object.keys(qualitySpecs).length > 0) {
    updateData.quality_specs = qualitySpecs
  }

  return updateData
}

function isMultilineField(fieldPath: string): boolean {
  const multilineFields = [
    'description_local',
    'material_composition',
    'durability_claim',
    'quality_specs.ingredients',
    'quality_specs.nutrition_facts',
    'quality_specs.allergen_info',
    'quality_specs.allergen_information',
    'quality_specs.labeling_compliance',
  ]
  return multilineFields.includes(fieldPath)
}
