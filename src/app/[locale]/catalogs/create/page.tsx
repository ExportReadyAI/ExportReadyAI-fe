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
} from "lucide-react"
import type { Product, CreateCatalogRequest } from "@/lib/api/types"

export default function CreateCatalogPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  // Form state
  const [productId, setProductId] = useState<string>("")
  const [displayName, setDisplayName] = useState("")
  const [basePriceExw, setBasePriceExw] = useState("")
  const [marketingDescription, setMarketingDescription] = useState("")
  const [minOrderQuantity, setMinOrderQuantity] = useState("1")
  const [unitType, setUnitType] = useState("pcs")
  const [leadTimeDays, setLeadTimeDays] = useState("14")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

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

      const data: CreateCatalogRequest = {
        product_id: parseInt(productId),
        display_name: displayName.trim(),
        base_price_exw: parseFloat(basePriceExw),
        marketing_description: marketingDescription.trim() || undefined,
        min_order_quantity: parseInt(minOrderQuantity) || 1,
        unit_type: unitType,
        lead_time_days: parseInt(leadTimeDays) || 14,
        tags: tags.length > 0 ? tags : undefined,
      }

      const response = await catalogService.create(data)

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

  // Handle product selection - auto fill display name
  const handleProductSelect = (id: string) => {
    setProductId(id)
    if (id) {
      const selectedProduct = products.find(p => p.id === parseInt(id))
      if (selectedProduct && !displayName) {
        setDisplayName(selectedProduct.name_local)
      }
    }
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
            {/* Product Selection */}
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
              <h2 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-[#8B5CF6]" />
                Pilih Produk
              </h2>

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
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
              <h2 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2 mb-4">
                <BookMarked className="h-5 w-5 text-[#8B5CF6]" />
                Informasi Katalog
              </h2>

              <div className="grid gap-5">
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

                <div>
                  <Label htmlFor="marketingDescription" className="text-[#0C4A6E] font-bold">
                    Deskripsi Marketing
                  </Label>
                  <Textarea
                    id="marketingDescription"
                    value={marketingDescription}
                    onChange={(e) => setMarketingDescription(e.target.value)}
                    placeholder="Deskripsi singkat untuk marketing..."
                    className="mt-2"
                    rows={3}
                  />
                  <p className="text-xs text-[#7DD3FC] mt-1">
                    Deskripsi ini akan ditampilkan di katalog publik
                  </p>
                </div>
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="moq" className="text-[#0C4A6E] font-bold">
                      MOQ
                    </Label>
                    <Input
                      id="moq"
                      type="number"
                      min="1"
                      value={minOrderQuantity}
                      onChange={(e) => setMinOrderQuantity(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit" className="text-[#0C4A6E] font-bold">
                      Satuan
                    </Label>
                    <Select
                      id="unit"
                      value={unitType}
                      onChange={(e) => setUnitType(e.target.value)}
                      className="mt-2"
                    >
                      <option value="pcs">pcs</option>
                      <option value="kg">kg</option>
                      <option value="set">set</option>
                      <option value="box">box</option>
                      <option value="carton">carton</option>
                      <option value="container">container</option>
                    </Select>
                  </div>
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
                    Lead Time (hari)
                  </Label>
                  <Input
                    id="leadTime"
                    type="number"
                    min="1"
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-[#7DD3FC] mt-1">
                    Waktu produksi dalam hari kerja
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
