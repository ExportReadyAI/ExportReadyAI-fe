"use client"

import { useState } from "react"
import { catalogService } from "@/lib/api/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Star,
  StarOff,
  Loader2,
  Link as LinkIcon,
  X,
} from "lucide-react"
import type { CatalogImage } from "@/lib/api/types"

interface CatalogImagesManagerProps {
  catalogId: number
  images: CatalogImage[]
  onUpdate: () => void
}

export function CatalogImagesManager({
  catalogId,
  images,
  onUpdate,
}: CatalogImagesManagerProps) {
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [settingPrimary, setSettingPrimary] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form state
  const [imageUrl, setImageUrl] = useState("")
  const [altText, setAltText] = useState("")

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageUrl.trim()) {
      setError("URL gambar harus diisi")
      return
    }

    try {
      setAdding(true)
      setError(null)

      await catalogService.addImage(catalogId, {
        image_url: imageUrl.trim(),
        alt_text: altText.trim() || undefined,
        is_primary: images.length === 0,
      })

      setImageUrl("")
      setAltText("")
      setShowAddForm(false)
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menambah gambar")
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (imageId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus gambar ini?")) return

    try {
      setDeleting(imageId)
      setError(null)

      await catalogService.deleteImage(catalogId, imageId)
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menghapus gambar")
    } finally {
      setDeleting(null)
    }
  }

  const handleSetPrimary = async (imageId: number) => {
    try {
      setSettingPrimary(imageId)
      setError(null)

      await catalogService.updateImage(catalogId, imageId, {
        is_primary: true,
      })
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengatur gambar utama")
    } finally {
      setSettingPrimary(null)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add Image Button/Form */}
      {!showAddForm ? (
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-[#0284C7] hover:bg-[#0369a1] shadow-[0_4px_0_0_#065985]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Gambar
        </Button>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-[#0284C7]" />
              Tambah Gambar Baru
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowAddForm(false)
                setImageUrl("")
                setAltText("")
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label className="text-[#0C4A6E] font-bold">URL Gambar *</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label className="text-[#0C4A6E] font-bold">Alt Text</Label>
              <Input
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Deskripsi gambar..."
                className="mt-2"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={adding}>
                {adding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setImageUrl("")
                  setAltText("")
                }}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-[#e0f2fe] p-12 text-center">
          <ImageIcon className="h-12 w-12 text-[#7DD3FC] mx-auto mb-4" />
          <p className="text-[#0284C7] font-medium">Belum ada gambar</p>
          <p className="text-sm text-[#7DD3FC]">
            Tambahkan gambar untuk katalog Anda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-2xl border-2 border-[#e0f2fe] overflow-hidden shadow-[0_4px_0_0_#e0f2fe] group relative"
            >
              <div className="aspect-square bg-[#F0F9FF] relative">
                <img
                  src={image.image_url}
                  alt={image.alt_text || "Catalog image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f0f9ff' width='100' height='100'/%3E%3Ctext fill='%237dd3fc' x='50' y='50' font-size='12' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
                  }}
                />
                {image.is_primary && (
                  <Badge className="absolute top-2 left-2 bg-[#F59E0B] text-white border-0">
                    <Star className="h-3 w-3 mr-1" />
                    Utama
                  </Badge>
                )}
              </div>
              <div className="p-3 flex gap-2">
                {!image.is_primary && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleSetPrimary(image.id)}
                    disabled={settingPrimary === image.id}
                  >
                    {settingPrimary === image.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-1" />
                        Utama
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(image.id)}
                  disabled={deleting === image.id}
                >
                  {deleting === image.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
