"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { catalogService, productService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookMarked,
  ArrowLeft,
  Save,
  Loader2,
  DollarSign,
  Clock,
  Tag,
  Plus,
  X,
  Sparkles,
  FileText,
  Shield,
  Settings,
  CheckCircle,
  Image as ImageIcon,
  Upload,
  Trash2,
  Star,
  Loader2 as Loader2Icon,
} from "lucide-react"
import type { Catalog, UpdateCatalogRequest, AIDescriptionResponse, CatalogTechnicalSpecs, CatalogSafetyInfo } from "@/lib/api/types"

export default function EditCatalogPage() {
  const router = useRouter()
  const params = useParams()
  const catalogId = params.id as string

  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [catalog, setCatalog] = useState<Catalog | null>(null)

  // Form state - Basic
  const [displayName, setDisplayName] = useState("")
  const [basePriceExw, setBasePriceExw] = useState("")
  const [minOrderQuantity, setMinOrderQuantity] = useState("1")
  const [unitType, setUnitType] = useState("pcs")
  const [leadTimeDays, setLeadTimeDays] = useState("14")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  // Form state - AI Description fields
  const [exportDescription, setExportDescription] = useState("")
  const [technicalSpecs, setTechnicalSpecs] = useState<CatalogTechnicalSpecs>({})
  const [safetyInfo, setSafetyInfo] = useState<CatalogSafetyInfo>({})

  // AI state
  const [generatingAI, setGeneratingAI] = useState(false)
  const [isFoodProduct, setIsFoodProduct] = useState(false)
  const [aiGenerated, setAiGenerated] = useState(false)

  // Image upload state
  const [selectedImages, setSelectedImages] = useState<Array<{ file: File; preview: string; altText: string; isPrimary: boolean }>>([])
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)
  const [settingPrimaryImageId, setSettingPrimaryImageId] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push("/login")
      return
    }

    fetchCatalog()
  }, [mounted, router, catalogId])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      selectedImages.forEach(img => URL.revokeObjectURL(img.preview))
    }
  }, [selectedImages])

  const fetchCatalog = async () => {
    try {
      setLoading(true)
      const response = await catalogService.get(catalogId)

      let catalogData: Catalog | null = null

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          catalogData = (response as any).data
        } else if ('id' in response) {
          catalogData = response as Catalog
        }
      }

      if (catalogData) {
        setCatalog(catalogData)
        setDisplayName(catalogData.display_name)
        setBasePriceExw(catalogData.base_price_exw.toString())
        setMinOrderQuantity(catalogData.min_order_quantity.toString())
        setUnitType(catalogData.unit_type)
        setLeadTimeDays(catalogData.lead_time_days.toString())
        setTags(catalogData.tags || [])
        // AI description fields
        setExportDescription(catalogData.export_description || "")
        setTechnicalSpecs(catalogData.technical_specs || {})
        setSafetyInfo(catalogData.safety_info || {})
      } else {
        setError("Katalog tidak ditemukan")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat katalog")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Image upload handlers
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff', 'image/x-icon', 'image/heic', 'image/heif']

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: Array<{ file: File; preview: string; altText: string }> = []

    Array.from(files).forEach((file) => {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`File ${file.name} melebihi batas 10MB dan akan dilewati`)
        return
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`File ${file.name} bukan format gambar yang didukung`)
        return
      }

      const preview = URL.createObjectURL(file)
      newImages.push({ file, preview, altText: '' })
    })

    setSelectedImages([...selectedImages, ...newImages])
    e.target.value = '' // Reset input
  }

  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    // Revoke object URL to prevent memory leak
    URL.revokeObjectURL(selectedImages[index].preview)
    setSelectedImages(newImages)
  }

  const handleImageAltTextChange = (index: number, altText: string) => {
    const newImages = [...selectedImages]
    newImages[index].altText = altText
    setSelectedImages(newImages)
  }

  const handleTogglePrimaryNewImage = (index: number) => {
    const newImages = selectedImages.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }))
    setSelectedImages(newImages)
  }

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus gambar ini?")) return

    try {
      setDeletingImageId(imageId)
      setError(null)
      await catalogService.deleteImage(catalogId, imageId)
      // Refresh catalog data
      await fetchCatalog()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menghapus gambar")
    } finally {
      setDeletingImageId(null)
    }
  }

  const handleSetPrimaryExistingImage = async (imageId: number) => {
    try {
      setSettingPrimaryImageId(imageId)
      setError(null)
      
      // First, unset all other primary images
      if (catalog?.images) {
        const otherPrimaryImages = catalog.images.filter(img => img.is_primary && img.id !== imageId)
        for (const img of otherPrimaryImages) {
          await catalogService.updateImage(catalogId, img.id, { is_primary: false })
        }
      }
      
      // Then set this one as primary
      await catalogService.updateImage(catalogId, imageId, { is_primary: true })
      
      // Refresh catalog data
      await fetchCatalog()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengatur gambar utama")
    } finally {
      setSettingPrimaryImageId(null)
    }
  }

  const handleGenerateAI = async () => {
    if (!catalog?.product_id) {
      setError("Tidak dapat menemukan product ID untuk katalog ini")
      return
    }

    try {
      setGeneratingAI(true)
      setError(null)

      const response = await productService.generateCatalogDescription(
        catalog.product_id,
        { is_food_product: isFoodProduct }
      )

      console.log("AI Response:", response) // Debug log

      let aiData: AIDescriptionResponse | null = null

      if (response && typeof response === 'object') {
        // Handle ApiResponse format: { success: true, data: { export_description, ... } }
        if ('success' in response && (response as any).success && (response as any).data) {
          aiData = (response as any).data
        }
        // Handle direct response format: { export_description, ... }
        else if ('export_description' in response) {
          aiData = response as unknown as AIDescriptionResponse
        }
        // Handle nested data format
        else if ('data' in response && (response as any).data?.export_description) {
          aiData = (response as any).data
        }
      }

      console.log("Parsed AI Data:", aiData) // Debug log

      if (aiData) {
        // Pre-fill fields with AI results
        if (aiData.export_description) {
          setExportDescription(aiData.export_description)
        }
        if (aiData.technical_specs) {
          setTechnicalSpecs(aiData.technical_specs)
        }
        if (aiData.safety_info) {
          setSafetyInfo(aiData.safety_info)
        }
        setAiGenerated(true)
      } else {
        setError("Format response AI tidak valid. Cek console untuk detail.")
      }
    } catch (err: any) {
      console.error("AI Error:", err) // Debug log
      setError(err.response?.data?.message || err.response?.data?.detail || "Gagal generate AI description")
    } finally {
      setGeneratingAI(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!displayName.trim()) {
      setError("Nama katalog harus diisi")
      return
    }

    if (!basePriceExw || parseFloat(basePriceExw) <= 0) {
      setError("Harga EXW harus diisi dengan nilai valid")
      return
    }

    try {
      setSaving(true)
      setError(null)

      // If images are selected, use FormData
      if (selectedImages.length > 0) {
        const formData = new FormData()
        
        // Add basic fields
        formData.append('display_name', displayName.trim())
        formData.append('base_price_exw', basePriceExw)
        formData.append('min_order_quantity', minOrderQuantity || '1')
        formData.append('unit_type', unitType)
        formData.append('lead_time_days', leadTimeDays || '14')
        
        // Add tags
        tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag)
        })

        // Add AI description fields if filled
        if (exportDescription.trim()) {
          formData.append('export_description', exportDescription.trim())
        }
        if (Object.keys(technicalSpecs).length > 0) {
          formData.append('technical_specs', JSON.stringify(technicalSpecs))
        }
        if (Object.keys(safetyInfo).length > 0) {
          formData.append('safety_info', JSON.stringify(safetyInfo))
        }

        // Add new images
        selectedImages.forEach((img, index) => {
          formData.append('images[]', img.file)
          if (img.altText.trim()) {
            formData.append(`alt_text_${index}`, img.altText.trim())
          }
        })

        await catalogService.update(catalogId, formData)
        router.push(`/catalogs/${catalogId}`)
        return
      }

      // Otherwise, use regular JSON request
      const data: UpdateCatalogRequest = {
        display_name: displayName.trim(),
        base_price_exw: parseFloat(basePriceExw),
        min_order_quantity: parseInt(minOrderQuantity) || 1,
        unit_type: unitType,
        lead_time_days: parseInt(leadTimeDays) || 14,
        tags: tags.length > 0 ? tags : undefined,
        // AI description fields
        export_description: exportDescription.trim() || undefined,
        technical_specs: Object.keys(technicalSpecs).length > 0 ? technicalSpecs : undefined,
        safety_info: Object.keys(safetyInfo).length > 0 ? safetyInfo : undefined,
      }

      await catalogService.update(catalogId, data)
      router.push(`/catalogs/${catalogId}`)
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan katalog")
    } finally {
      setSaving(false)
    }
  }

  if (!mounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F9FF]">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#8B5CF6] shadow-[0_6px_0_0_#6d28d9] animate-bounce">
            <BookMarked className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-bold text-[#0C4A6E]">Memuat...</p>
        </div>
      </div>
    )
  }

  if (error && !catalog) {
    return (
      <div className="flex h-screen bg-[#F0F9FF]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={() => router.push("/catalogs")}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Katalog
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 text-[#0284C7] hover:text-[#0369a1] hover:bg-[#e0f2fe]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <h1 className="text-3xl font-extrabold text-[#0C4A6E] flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B5CF6] shadow-[0_4px_0_0_#6d28d9]">
                <BookMarked className="h-6 w-6 text-white" />
              </div>
              Edit Katalog
            </h1>
            <p className="text-[#0284C7] font-medium mt-2">
              Edit informasi katalog ekspor
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* AI Recommendation Section */}
            <div className="bg-gradient-to-r from-[#f5f3ff] to-[#ede9fe] rounded-3xl border-2 border-[#ddd6fe] p-6 shadow-[0_4px_0_0_#ddd6fe] mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6]">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0C4A6E]">AI Recommendation</p>
                    <p className="text-xs text-[#7c3aed]">
                      Re-generate deskripsi, spesifikasi teknis, dan info keamanan
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isFoodProduct}
                      onChange={(e) => setIsFoodProduct(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-[#0C4A6E]">Food Product</span>
                  </label>
                  <Button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={generatingAI}
                    className="bg-[#8B5CF6] hover:bg-[#7c3aed] shadow-[0_4px_0_0_#6d28d9]"
                  >
                    {generatingAI ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get AI Recommendations
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {aiGenerated && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  AI telah mengisi field deskripsi. Anda dapat mengedit sebelum menyimpan.
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
              <h2 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-4">
                <BookMarked className="h-5 w-5 text-[#8B5CF6]" />
                Informasi Katalog
              </h2>

              <div>
                <Label htmlFor="displayName" className="text-[#0C4A6E] font-bold">
                  Nama Katalog *
                </Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nama produk untuk katalog"
                  className="mt-2"
                  required
                />
              </div>
            </div>

            {/* Pricing & MOQ */}
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
              <h2 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-[#22C55E]" />
                Harga & MOQ
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="basePriceExw" className="text-[#0C4A6E] font-bold">
                    Harga EXW (USD) *
                  </Label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7DD3FC] font-bold">
                      $
                    </span>
                    <Input
                      id="basePriceExw"
                      type="number"
                      step="0.01"
                      min="0"
                      value={basePriceExw}
                      onChange={(e) => setBasePriceExw(e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="moq" className="text-[#0C4A6E] font-bold">
                    MOQ (Minimum Order Quantity)
                  </Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <Input
                      id="moq"
                      type="number"
                      min="1"
                      value={minOrderQuantity}
                      onChange={(e) => setMinOrderQuantity(e.target.value)}
                      placeholder="Jumlah minimum"
                    />
                    <Select
                      id="unit"
                      value={unitType}
                      onChange={(e) => setUnitType(e.target.value)}
                    >
                      <option value="pcs">pcs</option>
                      <option value="kg">kg</option>
                      <option value="set">set</option>
                      <option value="box">box</option>
                      <option value="carton">carton</option>
                      <option value="container">container</option>
                    </Select>
                  </div>
                  <p className="text-xs text-[#7DD3FC] mt-1">
                    Jumlah pesanan minimum yang harus dipenuhi buyer
                  </p>
                </div>
              </div>
            </div>

            {/* Lead Time & Tags */}
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
              <h2 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-[#F59E0B]" />
                Lead Time & Tags
              </h2>

              <div className="grid gap-5">
                <div className="max-w-xs">
                  <Label htmlFor="leadTime" className="text-[#0C4A6E] font-bold">
                    Lead Time (Waktu Produksi)
                  </Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="leadTime"
                      type="number"
                      min="1"
                      value={leadTimeDays}
                      onChange={(e) => setLeadTimeDays(e.target.value)}
                      className="w-24"
                    />
                    <span className="text-[#0C4A6E] font-medium">hari</span>
                  </div>
                  <p className="text-xs text-[#7DD3FC] mt-1">
                    Estimasi waktu yang dibutuhkan untuk memproduksi pesanan setelah order dikonfirmasi
                  </p>
                </div>

                <div>
                  <Label className="text-[#0C4A6E] font-bold flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Tambah tag..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8B5CF6] text-white text-sm font-medium"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:bg-white/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Export Description - Always Visible */}
            <div className="bg-gradient-to-r from-[#f5f3ff] to-[#ede9fe] rounded-3xl border-2 border-[#ddd6fe] p-6 mb-6">
              <h2 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-[#8B5CF6]" />
                Export Description (B2B English)
              </h2>
              <p className="text-sm text-[#7c3aed] mb-4">
                Deskripsi produk untuk buyer internasional.
              </p>
              <Textarea
                value={exportDescription}
                onChange={(e) => setExportDescription(e.target.value)}
                placeholder="English B2B marketing description for international buyers..."
                className="bg-white"
                rows={5}
              />
            </div>

            {/* Technical Specifications - Always Visible */}
            <div className="bg-gradient-to-r from-[#ecfdf5] to-[#d1fae5] rounded-3xl border-2 border-[#a7f3d0] p-6 mb-6">
              <h2 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-2">
                <Settings className="h-5 w-5 text-[#22C55E]" />
                Technical Specifications
              </h2>
              <p className="text-sm text-[#059669] mb-4">
                Spesifikasi teknis produk.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-[#0C4A6E] font-bold text-sm">Product Name</Label>
                  <Input
                    value={technicalSpecs.product_name || ""}
                    onChange={(e) => setTechnicalSpecs({ ...technicalSpecs, product_name: e.target.value })}
                    placeholder="Product name..."
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-[#0C4A6E] font-bold text-sm">Material</Label>
                  <Input
                    value={technicalSpecs.material || ""}
                    onChange={(e) => setTechnicalSpecs({ ...technicalSpecs, material: e.target.value })}
                    placeholder="Material composition..."
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-[#0C4A6E] font-bold text-sm">Dimensions</Label>
                  <Input
                    value={technicalSpecs.dimensions || ""}
                    onChange={(e) => setTechnicalSpecs({ ...technicalSpecs, dimensions: e.target.value })}
                    placeholder="e.g., 30 x 20 x 10 cm"
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-[#0C4A6E] font-bold text-sm">Net Weight</Label>
                  <Input
                    value={technicalSpecs.weight_net || ""}
                    onChange={(e) => setTechnicalSpecs({ ...technicalSpecs, weight_net: e.target.value })}
                    placeholder="e.g., 500g"
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-[#0C4A6E] font-bold text-sm">Gross Weight</Label>
                  <Input
                    value={technicalSpecs.weight_gross || ""}
                    onChange={(e) => setTechnicalSpecs({ ...technicalSpecs, weight_gross: e.target.value })}
                    placeholder="e.g., 600g (with packaging)"
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-[#0C4A6E] font-bold text-sm">Certifications</Label>
                  <Input
                    value={technicalSpecs.certifications?.join(", ") || ""}
                    onChange={(e) => setTechnicalSpecs({
                      ...technicalSpecs,
                      certifications: e.target.value ? e.target.value.split(",").map(s => s.trim()) : []
                    })}
                    placeholder="e.g., ISO 9001, HACCP (comma separated)"
                    className="mt-1 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Safety Information - Always Visible */}
            <div className="bg-gradient-to-r from-[#fef3c7] to-[#fde68a] rounded-3xl border-2 border-[#fcd34d] p-6 mb-6">
              <h2 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-[#F59E0B]" />
                Safety Information
              </h2>
              <p className="text-sm text-[#b45309] mb-4">
                Informasi keamanan produk.
              </p>
              <div className="grid gap-4">
                <div>
                  <Label className="text-[#0C4A6E] font-bold text-sm">Material Safety</Label>
                  <Textarea
                    value={safetyInfo.material_safety || ""}
                    onChange={(e) => setSafetyInfo({ ...safetyInfo, material_safety: e.target.value })}
                    placeholder="Material safety information..."
                    className="mt-1 bg-white"
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="text-[#0C4A6E] font-bold text-sm">Warnings</Label>
                  <Input
                    value={safetyInfo.warnings?.join(", ") || ""}
                    onChange={(e) => setSafetyInfo({
                      ...safetyInfo,
                      warnings: e.target.value ? e.target.value.split(",").map(s => s.trim()) : []
                    })}
                    placeholder="e.g., Keep away from fire, Not suitable for children under 3 (comma separated)"
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-[#0C4A6E] font-bold text-sm">Storage</Label>
                  <Input
                    value={safetyInfo.storage || ""}
                    onChange={(e) => setSafetyInfo({ ...safetyInfo, storage: e.target.value })}
                    placeholder="Storage instructions..."
                    className="mt-1 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Existing Images */}
            {catalog?.images && catalog.images.length > 0 && (
              <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
                <h2 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-4">
                  <ImageIcon className="h-5 w-5 text-[#8B5CF6]" />
                  Gambar yang Sudah Ada
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {catalog.images.map((image) => (
                    <div key={image.id} className="relative group border-2 border-[#e0f2fe] rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-square relative">
                        <img
                          src={image.url}
                          alt={image.alt_text || "Catalog image"}
                          className="w-full h-full object-cover"
                        />
                        {image.is_primary && (
                          <div className="absolute top-2 left-2 bg-[#F59E0B] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
                            <Star className="h-3 w-3 fill-white" />
                            Utama
                          </div>
                        )}
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
                        {/* Action buttons - always visible but more prominent on hover */}
                        <div className="absolute top-2 right-2 flex gap-2 z-20">
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryExistingImage(image.id)}
                            disabled={settingPrimaryImageId === image.id || image.is_primary}
                            className={`rounded-full p-1.5 shadow-lg transition-all ${
                              image.is_primary
                                ? 'bg-[#F59E0B] text-white opacity-100'
                                : 'bg-yellow-500 hover:bg-yellow-600 text-white opacity-70 group-hover:opacity-100'
                            } disabled:opacity-50`}
                            title={image.is_primary ? "Gambar utama" : "Set sebagai utama"}
                          >
                            {settingPrimaryImageId === image.id ? (
                              <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : (
                              <Star className={`h-4 w-4 ${image.is_primary ? 'fill-white' : ''}`} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingImage(image.id)}
                            disabled={deletingImageId === image.id}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-70 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                            title="Hapus gambar"
                          >
                            {deletingImageId === image.id ? (
                              <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-[#0C4A6E] truncate">
                          {image.alt_text || "Tidak ada alt text"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
              <h2 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-[#8B5CF6]" />
                Tambah Gambar Produk
              </h2>
              <p className="text-sm text-[#7DD3FC] mb-4">
                Upload gambar baru untuk katalog. Maksimal 10MB per gambar. Format: JPG, PNG, GIF, WebP, SVG, BMP, TIFF, ICO, HEIC, HEIF
              </p>

              <div className="space-y-4">
                {/* File Input */}
                <div className="relative">
                  <input
                    type="file"
                    id="image-upload-edit"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload-edit')?.click()}
                    className="w-full border-2 border-dashed border-[#0284C7] hover:bg-[#F0F9FF]"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Pilih Gambar Baru
                  </Button>
                </div>

                {/* Image Preview Grid */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedImages.map((img, index) => (
                      <div key={index} className="relative group border-2 border-[#e0f2fe] rounded-xl overflow-hidden bg-white">
                        <div className="aspect-square relative">
                          <img
                            src={img.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {img.isPrimary && (
                            <div className="absolute top-2 left-2 bg-[#F59E0B] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                              <Star className="h-3 w-3 fill-white" />
                              Utama
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleTogglePrimaryNewImage(index)}
                              className={`rounded-full p-1.5 ${
                                img.isPrimary
                                  ? 'bg-[#F59E0B] text-white'
                                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                              }`}
                              title={img.isPrimary ? "Gambar utama" : "Set sebagai utama"}
                            >
                              <Star className={`h-4 w-4 ${img.isPrimary ? 'fill-white' : ''}`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-2">
                          <Input
                            type="text"
                            placeholder="Alt text (opsional)"
                            value={img.altText}
                            onChange={(e) => handleImageAltTextChange(index, e.target.value)}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#8B5CF6] hover:bg-[#7c3aed] shadow-[0_4px_0_0_#6d28d9]"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
