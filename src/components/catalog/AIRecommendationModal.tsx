"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sparkles,
  Check,
  X,
  Edit,
  FileText,
  Shield,
} from "lucide-react"
import type { AIDescriptionResponse, CatalogTechnicalSpecs, CatalogSafetyInfo } from "@/lib/api/types"

interface AIRecommendationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: AIDescriptionResponse | null
  onAccept: (data: {
    export_description: string
    technical_specs: CatalogTechnicalSpecs
    safety_info: CatalogSafetyInfo
  }) => void
}

export function AIRecommendationModal({
  open,
  onOpenChange,
  data,
  onAccept,
}: AIRecommendationModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedDescription, setEditedDescription] = useState("")
  const [editedSpecs, setEditedSpecs] = useState<CatalogTechnicalSpecs>({})
  const [editedSafety, setEditedSafety] = useState<CatalogSafetyInfo>({})

  // Reset edit state when modal opens with new data
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && data) {
      setEditedDescription(data.export_description || "")
      setEditedSpecs(data.technical_specs || {})
      setEditedSafety(data.safety_info || {})
      setIsEditing(false)
    }
    onOpenChange(isOpen)
  }

  const handleAccept = () => {
    if (isEditing) {
      onAccept({
        export_description: editedDescription,
        technical_specs: editedSpecs,
        safety_info: editedSafety,
      })
    } else if (data) {
      onAccept({
        export_description: data.export_description,
        technical_specs: data.technical_specs,
        safety_info: data.safety_info,
      })
    }
    onOpenChange(false)
  }

  const startEditing = () => {
    if (data) {
      setEditedDescription(data.export_description || "")
      setEditedSpecs(data.technical_specs || {})
      setEditedSafety(data.safety_info || {})
      setIsEditing(true)
    }
  }

  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6] shadow-[0_3px_0_0_#6d28d9]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-[#0C4A6E]">
              {isEditing ? "Edit Rekomendasi AI" : "Rekomendasi AI"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Export Description */}
          <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-5">
            <h4 className="flex items-center gap-2 text-lg font-extrabold text-[#0C4A6E] mb-3">
              <FileText className="h-5 w-5 text-[#8B5CF6]" />
              Export Description
            </h4>
            {isEditing ? (
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={5}
                className="resize-none"
              />
            ) : (
              <p className="text-[#0C4A6E] whitespace-pre-wrap leading-relaxed">
                {data.export_description}
              </p>
            )}
          </div>

          {/* Technical Specs */}
          {(data.technical_specs && Object.keys(data.technical_specs).length > 0) && (
            <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-5">
              <h4 className="flex items-center gap-2 text-lg font-extrabold text-[#0C4A6E] mb-3">
                <FileText className="h-5 w-5 text-[#0284C7]" />
                Technical Specifications
              </h4>
              {isEditing ? (
                <div className="grid gap-3 md:grid-cols-2">
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
                    <Label className="text-sm text-[#0284C7]">Packaging</Label>
                    <Input
                      value={editedSpecs.packaging || ""}
                      onChange={(e) => setEditedSpecs({ ...editedSpecs, packaging: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-2 md:grid-cols-2">
                  {Object.entries(data.technical_specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 bg-[#F0F9FF] rounded-lg">
                      <span className="text-[#0284C7] capitalize text-sm">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[#0C4A6E] font-medium text-sm">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Safety Info */}
          {(data.safety_info && Object.keys(data.safety_info).length > 0) && (
            <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-5">
              <h4 className="flex items-center gap-2 text-lg font-extrabold text-[#0C4A6E] mb-3">
                <Shield className="h-5 w-5 text-[#F59E0B]" />
                Safety Information
              </h4>
              {isEditing ? (
                <div className="space-y-3">
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
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(data.safety_info).map(([key, value]) => (
                    <div key={key} className="p-2 bg-[#fffbeb] rounded-lg">
                      <span className="font-medium text-[#0C4A6E] capitalize text-sm block">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[#92400e] text-sm">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Batal
          </Button>
          {!isEditing && (
            <Button variant="outline" onClick={startEditing}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Dulu
            </Button>
          )}
          <Button
            onClick={handleAccept}
            className="bg-[#22C55E] hover:bg-[#16a34a] shadow-[0_4px_0_0_#15803d]"
          >
            <Check className="mr-2 h-4 w-4" />
            {isEditing ? "Gunakan Hasil Edit" : "Gunakan Hasil Ini"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
