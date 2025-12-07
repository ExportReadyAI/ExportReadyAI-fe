"use client"

import { useState } from "react"
import { catalogService } from "@/lib/api/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  Loader2,
  DollarSign,
  Package,
  X,
  Save,
} from "lucide-react"
import type { CatalogVariant } from "@/lib/api/types"

interface CatalogVariantsManagerProps {
  catalogId: number
  variants: CatalogVariant[]
  onUpdate: () => void
}

export function CatalogVariantsManager({
  catalogId,
  variants,
  onUpdate,
}: CatalogVariantsManagerProps) {
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [editing, setEditing] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form state for adding
  const [variantName, setVariantName] = useState("")
  const [variantPrice, setVariantPrice] = useState("")
  const [moqVariant, setMoqVariant] = useState("1")
  const [sku, setSku] = useState("")

  // Form state for editing
  const [editVariantName, setEditVariantName] = useState("")
  const [editVariantPrice, setEditVariantPrice] = useState("")
  const [editMoqVariant, setEditMoqVariant] = useState("")
  const [editSku, setEditSku] = useState("")

  const resetForm = () => {
    setVariantName("")
    setVariantPrice("")
    setMoqVariant("1")
    setSku("")
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!variantName.trim()) {
      setError("Nama varian harus diisi")
      return
    }

    if (!variantPrice || parseFloat(variantPrice) <= 0) {
      setError("Harga varian harus diisi dengan nilai valid")
      return
    }

    try {
      setAdding(true)
      setError(null)

      await catalogService.addVariant(catalogId, {
        variant_name: variantName.trim(),
        variant_price: parseFloat(variantPrice),
        moq_variant: parseInt(moqVariant) || 1,
        sku: sku.trim() || undefined,
      })

      resetForm()
      setShowAddForm(false)
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menambah varian")
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (variantId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus varian ini?")) return

    try {
      setDeleting(variantId)
      setError(null)

      await catalogService.deleteVariant(catalogId, variantId)
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menghapus varian")
    } finally {
      setDeleting(null)
    }
  }

  const handleStartEdit = (variant: CatalogVariant) => {
    setEditing(variant.id)
    setEditVariantName(variant.variant_name)
    setEditVariantPrice(variant.variant_price.toString())
    setEditMoqVariant(variant.moq_variant.toString())
    setEditSku(variant.sku || "")
  }

  const handleSaveEdit = async (variantId: number) => {
    if (!editVariantName.trim()) {
      setError("Nama varian harus diisi")
      return
    }

    if (!editVariantPrice || parseFloat(editVariantPrice) <= 0) {
      setError("Harga varian harus diisi dengan nilai valid")
      return
    }

    try {
      setSaving(true)
      setError(null)

      await catalogService.updateVariant(catalogId, variantId, {
        variant_name: editVariantName.trim(),
        variant_price: parseFloat(editVariantPrice),
        moq_variant: parseInt(editMoqVariant) || 1,
        sku: editSku.trim() || undefined,
      })

      setEditing(null)
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan varian")
    } finally {
      setSaving(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add Variant Button/Form */}
      {!showAddForm ? (
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-[#22C55E] hover:bg-[#16a34a] shadow-[0_4px_0_0_#15803d]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Varian
        </Button>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#22C55E]" />
              Tambah Varian Baru
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowAddForm(false)
                resetForm()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-[#0C4A6E] font-bold">Nama Varian *</Label>
                <Input
                  value={variantName}
                  onChange={(e) => setVariantName(e.target.value)}
                  placeholder="Contoh: Size L, Warna Merah"
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label className="text-[#0C4A6E] font-bold">Harga (USD) *</Label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7DD3FC] font-bold">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={variantPrice}
                    onChange={(e) => setVariantPrice(e.target.value)}
                    placeholder="0.00"
                    className="pl-8"
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="text-[#0C4A6E] font-bold">MOQ Varian</Label>
                <Input
                  type="number"
                  min="1"
                  value={moqVariant}
                  onChange={(e) => setMoqVariant(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-[#0C4A6E] font-bold">SKU</Label>
                <Input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SKU-001"
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={adding} className="bg-[#22C55E] hover:bg-[#16a34a]">
                {adding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Varian
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  resetForm()
                }}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Variants List */}
      {variants.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-[#e0f2fe] p-12 text-center">
          <Layers className="h-12 w-12 text-[#7DD3FC] mx-auto mb-4" />
          <p className="text-[#0284C7] font-medium">Belum ada varian</p>
          <p className="text-sm text-[#7DD3FC]">
            Tambahkan varian produk untuk katalog Anda
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_4px_0_0_#e0f2fe]"
            >
              {editing === variant.id ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-[#0C4A6E] font-bold text-sm">Nama Varian</Label>
                      <Input
                        value={editVariantName}
                        onChange={(e) => setEditVariantName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[#0C4A6E] font-bold text-sm">Harga (USD)</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7DD3FC] text-sm">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          value={editVariantPrice}
                          onChange={(e) => setEditVariantPrice(e.target.value)}
                          className="pl-7"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[#0C4A6E] font-bold text-sm">MOQ</Label>
                      <Input
                        type="number"
                        min="1"
                        value={editMoqVariant}
                        onChange={(e) => setEditMoqVariant(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[#0C4A6E] font-bold text-sm">SKU</Label>
                      <Input
                        value={editSku}
                        onChange={(e) => setEditSku(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSaveEdit(variant.id)}
                      disabled={saving}
                      className="bg-[#22C55E] hover:bg-[#16a34a]"
                    >
                      {saving ? (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-1 h-4 w-4" />
                      )}
                      Simpan
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditing(null)}
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F9FF]">
                      <Layers className="h-6 w-6 text-[#22C55E]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0C4A6E]">{variant.variant_name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-sm text-[#0284C7]">
                          <DollarSign className="h-3 w-3" />
                          {formatPrice(variant.variant_price)}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-[#7DD3FC]">
                          <Package className="h-3 w-3" />
                          MOQ: {variant.moq_variant}
                        </span>
                        {variant.sku && (
                          <Badge variant="outline" className="text-xs">
                            SKU: {variant.sku}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartEdit(variant)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(variant.id)}
                      disabled={deleting === variant.id}
                    >
                      {deleting === variant.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
