"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { buyerRequestService, countryService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  ShoppingCart,
  Globe,
  Package,
  X,
} from "lucide-react"
import type { CreateBuyerRequestRequest, Country } from "@/lib/api/types"
import { CATEGORIES } from "@/lib/constants/categories"

export default function CreateBuyerRequestPage() {
  const router = useRouter()
  const { isAuthenticated, isBuyer } = useAuthStore()
  const [countries, setCountries] = useState<Country[]>([])
  const [formData, setFormData] = useState<CreateBuyerRequestRequest>({
    product_category: "",
    hs_code_target: "",
    spec_requirements: "",
    target_volume: 0,
    destination_country: "",
    keyword_tags: [],
    min_rank_required: 0,
  })
  const [keywordInput, setKeywordInput] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingCountries, setLoadingCountries] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !isBuyer()) {
      router.push("/login")
      return
    }

    fetchCountries()
  }, [isAuthenticated, router, isBuyer])

  const fetchCountries = async () => {
    try {
      setLoadingCountries(true)
      const response = await countryService.list()
      
      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        setCountries((response as any).data || [])
      } else if (Array.isArray(response)) {
        setCountries(response)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat negara")
    } finally {
      setLoadingCountries(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === "" ? 0 : Number(value)
    setFormData((prev) => ({ ...prev, [name]: numValue }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keyword_tags?.includes(keywordInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        keyword_tags: [...(prev.keyword_tags || []), keywordInput.trim()],
      }))
      setKeywordInput("")
    }
  }

  const handleRemoveKeyword = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      keyword_tags: prev.keyword_tags?.filter((t) => t !== tag) || [],
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.product_category.trim()) {
      newErrors.product_category = "Kategori produk harus diisi"
    }

    if (!formData.spec_requirements.trim()) {
      newErrors.spec_requirements = "Spesifikasi harus diisi"
    }

    if (!formData.target_volume || formData.target_volume <= 0) {
      newErrors.target_volume = "Volume target harus lebih dari 0"
    }

    if (!formData.destination_country) {
      newErrors.destination_country = "Negara tujuan harus dipilih"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const payload: CreateBuyerRequestRequest = {
        product_category: formData.product_category,
        spec_requirements: formData.spec_requirements,
        target_volume: formData.target_volume,
        destination_country: formData.destination_country,
      }

      if (formData.hs_code_target) {
        payload.hs_code_target = formData.hs_code_target
      }

      if (formData.keyword_tags && formData.keyword_tags.length > 0) {
        payload.keyword_tags = formData.keyword_tags
      }

      if (formData.min_rank_required && formData.min_rank_required > 0) {
        payload.min_rank_required = formData.min_rank_required
      }

      const response = await buyerRequestService.create(payload)

      if (response.success || (response as any).data) {
        router.push("/buyer-requests")
      } else {
        setError(response.message || "Gagal membuat buyer request")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan saat membuat buyer request"
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || !isBuyer()) {
    return null
  }

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/buyer-requests")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC4899] shadow-[0_4px_0_0_#be185d]">
                <ShoppingCart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Buat Buyer Request Baru
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Buat permintaan pembelian untuk produk yang Anda cari
                </p>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
              <CardHeader>
                <CardTitle className="text-2xl font-extrabold text-[#0C4A6E]">
                  Informasi Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Category */}
                <div>
                  <Label htmlFor="product_category" className="text-[#0C4A6E] font-bold">
                    Kategori Produk <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    id="product_category"
                    name="product_category"
                    value={formData.product_category}
                    onChange={handleChange}
                    className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                    required
                    disabled={loading}
                  >
                    <option value="">Pilih kategori produk</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                  {errors.product_category && (
                    <p className="mt-1 text-sm text-red-500">{errors.product_category}</p>
                  )}
                </div>

                {/* HS Code Target */}
                <div>
                  <Label htmlFor="hs_code_target" className="text-[#0C4A6E] font-bold">
                    HS Code Target (Opsional)
                  </Label>
                  <Input
                    id="hs_code_target"
                    name="hs_code_target"
                    value={formData.hs_code_target}
                    onChange={handleChange}
                    placeholder="Contoh: 20081900"
                    className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                  />
                </div>

                {/* Spec Requirements */}
                <div>
                  <Label htmlFor="spec_requirements" className="text-[#0C4A6E] font-bold">
                    Spesifikasi Produk <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="spec_requirements"
                    name="spec_requirements"
                    value={formData.spec_requirements}
                    onChange={handleChange}
                    placeholder="Jelaskan secara detail spesifikasi produk yang Anda cari..."
                    rows={6}
                    className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                    required
                  />
                  {errors.spec_requirements && (
                    <p className="mt-1 text-sm text-red-500">{errors.spec_requirements}</p>
                  )}
                </div>

                {/* Target Volume */}
                <div>
                  <Label htmlFor="target_volume" className="text-[#0C4A6E] font-bold">
                    Volume Target <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="target_volume"
                    name="target_volume"
                    type="number"
                    value={formData.target_volume || ""}
                    onChange={(e) => handleNumberChange("target_volume", e.target.value)}
                    placeholder="Contoh: 5000"
                    className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                    required
                    min={1}
                  />
                  {errors.target_volume && (
                    <p className="mt-1 text-sm text-red-500">{errors.target_volume}</p>
                  )}
                </div>

                {/* Destination Country */}
                <div>
                  <Label htmlFor="destination_country" className="text-[#0C4A6E] font-bold">
                    Negara Tujuan <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    id="destination_country"
                    name="destination_country"
                    value={formData.destination_country}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, destination_country: e.target.value }))
                      if (errors.destination_country) {
                        setErrors((prev) => ({ ...prev, destination_country: "" }))
                      }
                    }}
                    disabled={loadingCountries}
                    className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                    required
                  >
                    <option value="">Pilih negara tujuan</option>
                    {countries.map((country) => (
                      <option key={country.country_code} value={country.country_code}>
                        {country.country_name} ({country.country_code})
                      </option>
                    ))}
                  </Select>
                  {errors.destination_country && (
                    <p className="mt-1 text-sm text-red-500">{errors.destination_country}</p>
                  )}
                </div>

                {/* Min Rank Required */}
                <div>
                  <Label htmlFor="min_rank_required" className="text-[#0C4A6E] font-bold">
                    Minimum Rank UMKM (Opsional)
                  </Label>
                  <Input
                    id="min_rank_required"
                    name="min_rank_required"
                    type="number"
                    value={formData.min_rank_required || ""}
                    onChange={(e) => handleNumberChange("min_rank_required", e.target.value)}
                    placeholder="0 = Tidak ada batasan"
                    className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                    min={0}
                    max={5}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Minimum rank UMKM yang dapat melihat request ini (0-5)
                  </p>
                </div>

                {/* Keyword Tags */}
                <div>
                  <Label className="text-[#0C4A6E] font-bold">Keyword Tags (Opsional)</Label>
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddKeyword()
                        }
                      }}
                      placeholder="Tambahkan keyword..."
                      className="rounded-2xl border-2 border-[#e0f2fe]"
                    />
                    <Button
                      type="button"
                      onClick={handleAddKeyword}
                      className="rounded-2xl"
                    >
                      Tambah
                    </Button>
                  </div>
                  {formData.keyword_tags && formData.keyword_tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.keyword_tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-[#F0F9FF] px-3 py-1 text-sm font-medium text-[#0284C7] border border-[#e0f2fe]"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/buyer-requests")}
                className="rounded-2xl"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-2xl shadow-[0_4px_0_0_#be185d] bg-[#EC4899] hover:bg-[#db2777]"
              >
                {loading ? "Membuat..." : "Buat Request"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

