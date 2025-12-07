"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
  Package,
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
  AlertCircle,
  Image as ImageIcon,
  Upload,
  Trash2,
  Star,
} from "lucide-react"
import type { Product, CreateCatalogRequest, AIDescriptionResponse, CatalogTechnicalSpecs, CatalogSafetyInfo } from "@/lib/api/types"

export default function CreateCatalogPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  // Form state - Basic
  const [productId, setProductId] = useState<string>("")
  const [displayName, setDisplayName] = useState("")
  const [basePriceExw, setBasePriceExw] = useState("")
  const [minOrderQuantity, setMinOrderQuantity] = useState("1")
  const [unitType, setUnitType] = useState("pcs")
  const [leadTimeDays, setLeadTimeDays] = useState("14")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  // Form state - AI Description fields (can be filled manually or via AI)
  const [exportDescription, setExportDescription] = useState("")
  const [technicalSpecs, setTechnicalSpecs] = useState<CatalogTechnicalSpecs>({})
  const [safetyInfo, setSafetyInfo] = useState<CatalogSafetyInfo>({})
  const [isFoodProduct, setIsFoodProduct] = useState(false)

  // AI state
  const [generatingAI, setGeneratingAI] = useState(false)
  const [aiGenerated, setAiGenerated] = useState(false)

  // Image upload state
  const [selectedImages, setSelectedImages] = useState<Array<{ file: File; preview: string; altText: string }>>([])

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

    fetchProducts()
  }, [mounted, router])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      selectedImages.forEach(img => URL.revokeObjectURL(img.preview))
    }
  }, [selectedImages])

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true)
      const response = await productService.list({ limit: 100 })

      let productsData: Product[] = []

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          const data = (response as any).data
          if (Array.isArray(data)) {
            productsData = data
          } else if (data?.results) {
            productsData = data.results
          }
        } else if ('results' in response) {
          productsData = (response as any).results || []
        } else if (Array.isArray(response)) {
          productsData = response
        }
      }

      setProducts(productsData)
    } catch (err: any) {
      setError("Gagal memuat daftar produk")
    } finally {
      setLoadingProducts(false)
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

  const handleProductSelect = (id: string) => {
    setProductId(id)
    // Reset AI generated flag when product changes
    setAiGenerated(false)
    if (id) {
      const selectedProduct = products.find(p => p.id === parseInt(id))
      if (selectedProduct && !displayName) {
        setDisplayName(selectedProduct.name_local)
      }
    }
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
      // First image is automatically primary
      const isFirstImage = selectedImages.length === 0 && newImages.length === 0
      newImages.push({ file, preview, altText: '', isPrimary: isFirstImage })
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

  const handleGenerateAI = async () => {
    if (!productId) {
      setError("Pilih produk terlebih dahulu untuk generate AI")
      return
    }

    try {
      setGeneratingAI(true)
      setError(null)

      const response = await productService.generateCatalogDescription(
        parseInt(productId),
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

    if (!productId) {
      setError("Pilih produk terlebih dahulu")
      return
    }

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
        formData.append('product_id', productId)
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

        // Add images
        selectedImages.forEach((img, index) => {
          formData.append('images[]', img.file)
          if (img.altText.trim()) {
            formData.append(`alt_text_${index}`, img.altText.trim())
          }
        })

        const response = await catalogService.create(formData)

        let catalogId: number | null = null

        if (response && typeof response === 'object') {
          if ('success' in response && (response as any).success) {
            catalogId = (response as any).data?.id
          } else if ('id' in response) {
            catalogId = (response as any).id
          }
        }

        if (catalogId) {
          router.push(`/catalogs/${catalogId}`)
        } else {
          router.push("/catalogs")
        }
        return
      }

      // Otherwise, use regular JSON request
      const data: CreateCatalogRequest & {
        export_description?: string
        technical_specs?: CatalogTechnicalSpecs
        safety_info?: CatalogSafetyInfo
      } = {
        product_id: parseInt(productId),
        display_name: displayName.trim(),
        base_price_exw: parseFloat(basePriceExw),
        min_order_quantity: parseInt(minOrderQuantity) || 1,
        unit_type: unitType,
        lead_time_days: parseInt(leadTimeDays) || 14,
        tags: tags.length > 0 ? tags : undefined,
        // Include AI description fields if filled
        export_description: exportDescription.trim() || undefined,
        technical_specs: Object.keys(technicalSpecs).length > 0 ? technicalSpecs : undefined,
        safety_info: Object.keys(safetyInfo).length > 0 ? safetyInfo : undefined,
      }

      const response = await catalogService.create(data as CreateCatalogRequest)

      let catalogId: number | null = null

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          catalogId = (response as any).data?.id
        } else if ('id' in response) {
          catalogId = (response as any).id
        }
      }

      if (catalogId) {
        router.push(`/catalogs/${catalogId}`)
      } else {
        router.push("/catalogs")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.detail || "Gagal membuat katalog")
    } finally {
      setSaving(false)
    }
  }

  // Helper to format technical specs for display
  const formatTechnicalSpecs = (specs: CatalogTechnicalSpecs): string => {
    if (!specs || Object.keys(specs).length === 0) return ""
    const lines: string[] = []
    if (specs.product_name) lines.push(`Product: ${specs.product_name}`)
    if (specs.material) lines.push(`Material: ${specs.material}`)
    if (specs.dimensions) lines.push(`Dimensions: ${specs.dimensions}`)
    if (specs.weight_net) lines.push(`Net Weight: ${specs.weight_net}`)
    if (specs.weight_gross) lines.push(`Gross Weight: ${specs.weight_gross}`)
    if (specs.certifications?.length) lines.push(`Certifications: ${specs.certifications.join(", ")}`)
    // Add any other fields
    Object.entries(specs).forEach(([key, value]) => {
      if (!['product_name', 'material', 'dimensions', 'weight_net', 'weight_gross', 'certifications'].includes(key) && value) {
        lines.push(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
      }
    })
    return lines.join("\n")
  }

  // Helper to format safety info for display
  const formatSafetyInfo = (info: CatalogSafetyInfo): string => {
    if (!info || Object.keys(info).length === 0) return ""
    const lines: string[] = []
    if (info.material_safety) lines.push(`Material Safety: ${info.material_safety}`)
    if (info.warnings?.length) lines.push(`Warnings: ${info.warnings.join(", ")}`)
    if (info.storage) lines.push(`Storage: ${info.storage}`)
    // Add any other fields
    Object.entries(info).forEach(([key, value]) => {
      if (!['material_safety', 'warnings', 'storage'].includes(key) && value) {
        lines.push(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
      }
    })
    return lines.join("\n")
  }

  if (!mounted || loadingProducts) {
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
              Buat Katalog Baru
            </h1>
            <p className="text-[#0284C7] font-medium mt-2">
              Buat katalog ekspor dari produk Anda
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Product Selection with AI Button */}
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
              <h2 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-[#8B5CF6]" />
                Pilih Produk
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="product" className="text-[#0C4A6E] font-bold">
                    Produk *
                  </Label>
                  <Select
                    id="product"
                    value={productId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="mt-2"
                    required
                  >
                    <option value="">Pilih produk...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id.toString()}>
                        {product.name_local}
                      </option>
                    ))}
                  </Select>
                  <p className="text-xs text-[#7DD3FC] mt-1">
                    Produk yang akan dijadikan katalog
                  </p>
                </div>

                {/* AI Recommendation Button */}
                {productId && (
                  <div className="bg-gradient-to-r from-[#f5f3ff] to-[#ede9fe] rounded-xl p-4 border border-[#ddd6fe]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6]">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-[#0C4A6E]">AI Recommendation</p>
                          <p className="text-xs text-[#7c3aed]">
                            Generate deskripsi, spesifikasi teknis, dan info keamanan otomatis
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
                )}
              </div>
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
                  <p className="text-xs text-[#7DD3FC] mt-1">
                    Harga Ex-Works dalam USD
                  </p>
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
                Deskripsi produk untuk buyer internasional. Isi manual atau gunakan AI di atas.
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
                Spesifikasi teknis produk. Isi manual atau gunakan AI.
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
                Informasi keamanan produk. Isi manual atau gunakan AI.
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

            {/* Image Upload */}
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
              <h2 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-[#8B5CF6]" />
                Upload Gambar Produk
              </h2>
              <p className="text-sm text-[#7DD3FC] mb-4">
                Upload gambar produk untuk katalog. Maksimal 10MB per gambar. Format: JPG, PNG, GIF, WebP, SVG, BMP, TIFF, ICO, HEIC, HEIF
              </p>

              <div className="space-y-4">
                {/* File Input */}
                <div className="relative">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="w-full border-2 border-dashed border-[#0284C7] hover:bg-[#F0F9FF]"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Pilih Gambar
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
                    Buat Katalog
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
