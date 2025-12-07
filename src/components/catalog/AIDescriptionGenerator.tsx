"use client"

import { useState } from "react"
import { catalogService } from "@/lib/api/services"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Loader2,
  FileText,
  Shield,
  Check,
  X,
  Edit,
  RefreshCw,
  Save,
  Eye,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import type { Catalog, AIDescriptionResponse, CatalogTechnicalSpecs, CatalogSafetyInfo } from "@/lib/api/types"

interface AIDescriptionGeneratorProps {
  catalogId: number
  catalog: Catalog
  onUpdate: () => void
}

export function AIDescriptionGenerator({
  catalogId,
  catalog,
  onUpdate,
}: AIDescriptionGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<AIDescriptionResponse | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Editable fields
  const [editedDescription, setEditedDescription] = useState("")
  const [editedSpecs, setEditedSpecs] = useState<CatalogTechnicalSpecs>({})
  const [editedSafety, setEditedSafety] = useState<CatalogSafetyInfo>({})

  const handleGenerate = async () => {
    try {
      setGenerating(true)
      setError(null)

      const response = await catalogService.generateDescription(catalogId, {
        save_to_catalog: false,
      })

      let aiData: AIDescriptionResponse | null = null

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          aiData = (response as any).data
        } else if ('export_description' in response) {
          aiData = response as unknown as AIDescriptionResponse
        }
      }

      if (aiData) {
        setPreview(aiData)
        setEditedDescription(aiData.export_description || "")
        setEditedSpecs(aiData.technical_specs || {})
        setEditedSafety(aiData.safety_info || {})
        setIsEditing(false)
      } else {
        setError("Gagal mendapatkan hasil AI")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.detail || "Gagal menghasilkan deskripsi")
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      // Update catalog with edited content
      await catalogService.update(catalogId, {
        export_description: editedDescription,
        technical_specs: editedSpecs,
        safety_info: editedSafety,
      })

      setPreview(null)
      setIsEditing(false)
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan deskripsi")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDirectly = async () => {
    try {
      setSaving(true)
      setError(null)

      const response = await catalogService.generateDescription(catalogId, {
        save_to_catalog: true,
      })

      setPreview(null)
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan deskripsi")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setPreview(null)
    setIsEditing(false)
    setError(null)
  }

  const hasExistingDescription = catalog.export_description || catalog.technical_specs || catalog.safety_info

  return (
    <div className="space-y-6">
      {/* Current Description */}
      {hasExistingDescription && !preview && (
        <div className="space-y-4">
          {/* Export Description */}
          {catalog.export_description && (
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#8B5CF6]" />
                  Export Description
                </h3>
                <Badge className="bg-[#22C55E] text-white border-0">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  AI Generated
                </Badge>
              </div>
              <p className="text-[#0C4A6E] whitespace-pre-wrap leading-relaxed">
                {catalog.export_description}
              </p>
            </div>
          )}

          {/* Technical Specs */}
          {catalog.technical_specs && Object.keys(catalog.technical_specs).length > 0 && (
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe]">
              <h3 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-6">
                <FileText className="h-5 w-5 text-[#0284C7]" />
                Technical Specifications
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(catalog.technical_specs).map(([key, value]) => (
                  <div key={key} className="p-4 bg-[#F0F9FF] rounded-xl border border-[#e0f2fe]">
                    <span className="text-xs font-semibold text-[#0284C7] uppercase tracking-wide block mb-2">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[#0C4A6E] font-bold text-base">
                      {Array.isArray(value) ? value.join(', ') : String(value) || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Info */}
          {catalog.safety_info && Object.keys(catalog.safety_info).length > 0 && (
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe]">
              <h3 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-[#F59E0B]" />
                Safety Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(catalog.safety_info).map(([key, value]) => (
                  <div key={key} className="p-4 bg-[#fffbeb] rounded-xl border border-[#fcd34d]">
                    <span className="text-xs font-semibold text-[#b45309] uppercase tracking-wide block mb-2">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[#92400e] font-medium">
                      {Array.isArray(value) ? value.join(', ') : String(value) || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regenerate Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerate}
              disabled={generating}
              variant="outline"
              className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate dengan AI
            </Button>
          </div>
        </div>
      )}

      {/* Generate CTA - When no existing description */}
      {!hasExistingDescription && !preview && (
        <div className="bg-gradient-to-r from-[#f5f3ff] to-[#ede9fe] rounded-3xl border-2 border-[#ddd6fe] p-8 text-center">
          <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-gradient-to-br from-[#8B5CF6] to-[#7c3aed] shadow-[0_6px_0_0_#6d28d9] mb-6">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#0C4A6E] mb-2">
            Generate AI Description
          </h3>
          <p className="text-[#0284C7] font-medium mb-6 max-w-lg mx-auto">
            Biarkan AI membuatkan deskripsi ekspor profesional, spesifikasi teknis, dan informasi keamanan untuk katalog Anda.
          </p>
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={generating}
            className="bg-[#8B5CF6] hover:bg-[#7c3aed] shadow-[0_4px_0_0_#6d28d9]"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                AI Sedang Menulis...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate dengan AI
              </>
            )}
          </Button>
        </div>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Preview Mode */}
      {preview && !isEditing && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#f5f3ff] to-[#ede9fe] rounded-2xl border-2 border-[#ddd6fe] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-[#8B5CF6]" />
              <span className="font-bold text-[#0C4A6E]">Preview Hasil AI</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                <X className="mr-1 h-4 w-4" />
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleSaveDirectly}
                disabled={saving}
                className="bg-[#22C55E] hover:bg-[#16a34a]"
              >
                {saving ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-1 h-4 w-4" />
                )}
                Gunakan Hasil Ini
              </Button>
            </div>
          </div>

          {/* Preview Export Description */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe]">
            <h3 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-[#8B5CF6]" />
              Export Description
            </h3>
            <p className="text-[#0C4A6E] whitespace-pre-wrap leading-relaxed">
              {preview.export_description}
            </p>
          </div>

          {/* Preview Technical Specs */}
          {preview.technical_specs && Object.keys(preview.technical_specs).length > 0 && (
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe]">
              <h3 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-6">
                <FileText className="h-5 w-5 text-[#0284C7]" />
                Technical Specifications
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(preview.technical_specs).map(([key, value]) => (
                  <div key={key} className="p-4 bg-[#F0F9FF] rounded-xl border border-[#e0f2fe]">
                    <span className="text-xs font-semibold text-[#0284C7] uppercase tracking-wide block mb-2">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[#0C4A6E] font-bold text-base">
                      {Array.isArray(value) ? value.join(', ') : String(value) || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Safety Info */}
          {preview.safety_info && Object.keys(preview.safety_info).length > 0 && (
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe]">
              <h3 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-[#F59E0B]" />
                Safety Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(preview.safety_info).map(([key, value]) => (
                  <div key={key} className="p-4 bg-[#fffbeb] rounded-xl border border-[#fcd34d]">
                    <span className="text-xs font-semibold text-[#b45309] uppercase tracking-wide block mb-2">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[#92400e] font-medium">
                      {Array.isArray(value) ? value.join(', ') : String(value) || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Mode */}
      {preview && isEditing && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#fef3c7] to-[#fde68a] rounded-2xl border-2 border-[#fcd34d] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Edit className="h-5 w-5 text-[#92400e]" />
              <span className="font-bold text-[#92400e]">Mode Edit</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                <X className="mr-1 h-4 w-4" />
                Batal Edit
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="bg-[#22C55E] hover:bg-[#16a34a]"
              >
                {saving ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-1 h-4 w-4" />
                )}
                Simpan Perubahan
              </Button>
            </div>
          </div>

          {/* Edit Export Description */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe]">
            <Label className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-[#8B5CF6]" />
              Export Description
            </Label>
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          {/* Edit Technical Specs */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe]">
            <Label className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-[#0284C7]" />
              Technical Specifications
            </Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm text-[#0284C7]">Product Name</Label>
                <Input
                  value={editedSpecs.product_name || ""}
                  onChange={(e) => setEditedSpecs({ ...editedSpecs, product_name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-[#0284C7]">Material</Label>
                <Input
                  value={editedSpecs.material || ""}
                  onChange={(e) => setEditedSpecs({ ...editedSpecs, material: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-[#0284C7]">Dimensions</Label>
                <Input
                  value={editedSpecs.dimensions || ""}
                  onChange={(e) => setEditedSpecs({ ...editedSpecs, dimensions: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-[#0284C7]">Weight Net</Label>
                <Input
                  value={editedSpecs.weight_net || ""}
                  onChange={(e) => setEditedSpecs({ ...editedSpecs, weight_net: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-[#0284C7]">Finishing</Label>
                <Input
                  value={editedSpecs.finishing || ""}
                  onChange={(e) => setEditedSpecs({ ...editedSpecs, finishing: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-[#0284C7]">Packaging</Label>
                <Input
                  value={editedSpecs.packaging || ""}
                  onChange={(e) => setEditedSpecs({ ...editedSpecs, packaging: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm text-[#0284C7]">Care Instructions</Label>
                <Textarea
                  value={editedSpecs.care_instructions || ""}
                  onChange={(e) => setEditedSpecs({ ...editedSpecs, care_instructions: e.target.value })}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Edit Safety Info */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe]">
            <Label className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-[#F59E0B]" />
              Safety Information
            </Label>
            <div className="grid gap-4">
              <div>
                <Label className="text-sm text-[#92400e]">Material Safety</Label>
                <Textarea
                  value={editedSafety.material_safety || ""}
                  onChange={(e) => setEditedSafety({ ...editedSafety, material_safety: e.target.value })}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <Label className="text-sm text-[#92400e]">Storage</Label>
                <Input
                  value={editedSafety.storage || ""}
                  onChange={(e) => setEditedSafety({ ...editedSafety, storage: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-[#92400e]">Handling</Label>
                <Input
                  value={editedSafety.handling || ""}
                  onChange={(e) => setEditedSafety({ ...editedSafety, handling: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
