"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { productService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Minus, Package, ArrowLeft, Rocket, FileText, Ruler, Layers, Box, CheckCircle2 } from "lucide-react"
import type { CreateProductRequest, QualitySpecs } from "@/lib/api/types"
import { CATEGORIES } from "@/lib/constants/categories"

const PACKAGING_TYPES = [
  "Plastik PE",
  "Plastik PP",
  "Plastik PET",
  "Vacuum Pack",
  "Standing Pouch",
  "Aluminium Foil",
  "Kertas",
  "Karton",
  "Duplex Box",
  "Corrugated Box",

  "Kaleng",
  "Botol Kaca",
  "Botol Plastik",
  "Jar Kaca",
  "Tube",

  "Kayu",
  "Crate Kayu",
  "Peti Kayu Ekspor",

  "Anyaman Bambu",
  "Rotan",

  "Sachet",
  "Shrink Wrap",
  "Blister Pack",

  "Eco Packaging",
  "Biodegradable Packaging",
  "Compostable Packaging",

  "Kemasan Kedap Udara",
  "Kemasan Anti UV",
  "Kemasan Anti Lembab",

  "Bulk Packaging",
  "Packaging Pallet",
  "Stretch Film",

  "Custom Packaging",
  "Packaging Premium",
  "Gift Box",

  "Thermal Box",
  "Cool Box",
  "Insulated Packaging",

  "Drum",
  "Jerry Can",

  "Vakum Aluminium Ekspor",
  "Kemasan Standar Ekspor",

  "Blister Strip",
  "Blister Aluminium",
  "Botol Obat Plastik HDPE",
  "Botol Obat Kaca Coklat",
  "Vial",
  "Ampul",

  "Sachet Farmasi",
  "Stick Pack",

  "Tube Salep",
  "Tube Gel Medis",

  "Strip Foil",

  "Box Farmasi Karton",
  "Dus Sekunder Farmasi",

  "Cold Chain Packaging",
  "Thermal Pharmaceutical Box",

  "Sterile Packaging",
  "Vacuum Sterile Pack",

  "Tamper Proof Packaging",
  "Child Resistant Cap",

  "Packaging Anti-Cahaya",
  "Packaging Anti-Oksigen"
]

interface SectionProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  color: string
  children: React.ReactNode
}

function Section({ icon, title, subtitle, color, children }: SectionProps) {
  return (
    <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe]">
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-[#0C4A6E]">{title}</h3>
          {subtitle && (
            <p className="text-sm text-[#7DD3FC] font-medium">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

export default function CreateProductPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [formData, setFormData] = useState<CreateProductRequest>({
    name_local: "",
    category_id: 1,
    description_local: "",
    material_composition: "",
    production_technique: "",
    finishing_type: "",
    quality_specs: {},
    durability_claim: "",
    packaging_type: "Plastik",
    dimensions_l_w_h: { l: 0, w: 0, h: 0 },
    weight_net: "",
    weight_gross: "",
  })
  const [qualitySpecs, setQualitySpecs] = useState<Array<{ key: string; value: string }>>([
    { key: "", value: "" },
  ])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isAuthenticated) {
    router.push("/login")
    return null
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

  const handleDimensionChange = (
    field: "l" | "w" | "h",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      dimensions_l_w_h: {
        ...prev.dimensions_l_w_h,
        [field]: Number(value) || 0,
      },
    }))
  }

  const handleQualitySpecChange = (index: number, field: "key" | "value", value: string) => {
    const updated = [...qualitySpecs]
    updated[index] = { ...updated[index], [field]: value }
    setQualitySpecs(updated)
  }

  const addQualitySpec = () => {
    setQualitySpecs([...qualitySpecs, { key: "", value: "" }])
  }

  const removeQualitySpec = (index: number) => {
    setQualitySpecs(qualitySpecs.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name_local.trim()) {
      newErrors.name_local = "Nama produk harus diisi"
    }

    if (!formData.description_local.trim()) {
      newErrors.description_local = "Deskripsi harus diisi"
    } else if (formData.description_local.length > 500) {
      newErrors.description_local = "Deskripsi maksimal 500 karakter"
    }

    if (!formData.material_composition.trim()) {
      newErrors.material_composition = "Komposisi material harus diisi"
    }

    if (!formData.durability_claim.trim()) {
      newErrors.durability_claim = "Klaim ketahanan harus diisi"
    }

    if (formData.dimensions_l_w_h.l <= 0 || formData.dimensions_l_w_h.w <= 0 || formData.dimensions_l_w_h.h <= 0) {
      newErrors.dimensions = "Dimensi harus lebih dari 0"
    }

    if (!formData.weight_net || Number(formData.weight_net) <= 0) {
      newErrors.weight_net = "Berat netto harus diisi dan lebih dari 0"
    }

    if (!formData.weight_gross || Number(formData.weight_gross) <= 0) {
      newErrors.weight_gross = "Berat bruto harus diisi dan lebih dari 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Convert quality specs array to object
    const qualitySpecsObj: QualitySpecs = {}
    qualitySpecs.forEach((spec) => {
      if (spec.key && spec.value) {
        qualitySpecsObj[spec.key] = spec.value
      }
    })

    const submitData: CreateProductRequest = {
      ...formData,
      category_id: Number(formData.category_id),
      quality_specs: qualitySpecsObj,
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await productService.create(submitData)

      if (response.success && response.data) {
        // Get the product ID from response
        const productId = response.data.id || (response.data as any).id
        if (productId) {
          router.push(`/products`)
        } else {
          // If no ID, go back to list
          router.push("/products")
        }
      } else {
        setError(response.message || "Gagal membuat produk")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Terjadi kesalahan saat membuat produk"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#0284C7] hover:text-[#0369a1] font-bold mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Kembali
            </button>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#22C55E] shadow-[0_4px_0_0_#16a34a]">
                <Package className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Tambah Produk Baru
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Lengkapi informasi produk untuk analisis AI
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Info Tips Box */}
            <div className="bg-gradient-to-r from-[#FEF3C7] via-[#FDE68A] to-[#FCD34D] border-2 border-[#F59E0B] rounded-3xl p-6 shadow-[0_4px_0_0_#F59E0B]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F59E0B] shadow-[0_4px_0_0_#d97706] flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#92400E] mb-2">
                    💡 Tips Penting untuk Analisis AI yang Akurat
                  </h3>
                  <p className="text-[#92400E] font-medium mb-3">
                    Semakin lengkap dan detail data yang Anda berikan, semakin akurat analisis ekspor dari AI!
                  </p>
                  <ul className="space-y-2 text-sm text-[#92400E]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#F59E0B] font-bold">✓</span>
                      <span><strong>Isi semua field</strong> dengan informasi yang lengkap dan spesifik</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#F59E0B] font-bold">✓</span>
                      <span><strong>Detail adalah kunci</strong> - semakin detail, semakin baik hasil analisisnya</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#F59E0B] font-bold">✓</span>
                      <span><strong>Quality Specs</strong> sangat penting untuk compliance & standar internasional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#F59E0B] font-bold">✓</span>
                      <span><strong>Dimensi & berat</strong> yang akurat membantu kalkulasi biaya pengiriman</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section: Info Dasar */}
            <Section
              icon={<FileText className="h-5 w-5 text-white" />}
              title="Info Dasar"
              subtitle="Informasi utama produk"
              color="#0284C7"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name_local">Nama Produk *</Label>
                  <Input
                    id="name_local"
                    name="name_local"
                    placeholder="Contoh: Keripik Tempe Crispy"
                    value={formData.name_local}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  {errors.name_local && (
                    <p className="text-sm font-medium text-[#EF4444]">
                      {errors.name_local}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Kategori *</Label>
                  <Combobox
                    options={CATEGORIES.map(cat => ({
                      value: cat.id,
                      label: cat.name
                    }))}
                    value={formData.category_id}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, category_id: Number(value) }))
                    }}
                    placeholder="Pilih kategori produk..."
                    searchPlaceholder="Cari kategori..."
                    emptyText="Kategori tidak ditemukan."
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="description_local">
                  Deskripsi Produk * 
                  <span className="text-[#7DD3FC] font-normal ml-2">
                    ({formData.description_local.length}/500)
                  </span>
                </Label>
                <Textarea
                  id="description_local"
                  name="description_local"
                  placeholder="Jelaskan produk Anda secara detail..."
                  value={formData.description_local}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows={4}
                  maxLength={500}
                />
                {errors.description_local && (
                  <p className="text-sm font-medium text-[#EF4444]">
                    {errors.description_local}
                  </p>
                )}
              </div>
            </Section>

            {/* Section: Spesifikasi Fisik */}
            <Section
              icon={<Ruler className="h-5 w-5 text-white" />}
              title="Spesifikasi Fisik"
              subtitle="Dimensi dan berat produk"
              color="#22C55E"
            >
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="dimensions_l">Panjang (cm) *</Label>
                    <Input
                      id="dimensions_l"
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="0"
                      value={formData.dimensions_l_w_h.l || ""}
                      onChange={(e) => handleDimensionChange("l", e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions_w">Lebar (cm) *</Label>
                    <Input
                      id="dimensions_w"
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="0"
                      value={formData.dimensions_l_w_h.w || ""}
                      onChange={(e) => handleDimensionChange("w", e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions_h">Tinggi (cm) *</Label>
                    <Input
                      id="dimensions_h"
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="0"
                      value={formData.dimensions_l_w_h.h || ""}
                      onChange={(e) => handleDimensionChange("h", e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                {errors.dimensions && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.dimensions}</p>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weight_net">Berat Netto (kg) *</Label>
                    <Input
                      id="weight_net"
                      name="weight_net"
                      type="number"
                      min="0.001"
                      step="0.001"
                      placeholder="0.000"
                      value={formData.weight_net}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    {errors.weight_net && (
                      <p className="text-sm font-medium text-[#EF4444]">
                        {errors.weight_net}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight_gross">Berat Bruto (kg) *</Label>
                    <Input
                      id="weight_gross"
                      name="weight_gross"
                      type="number"
                      min="0.001"
                      step="0.001"
                      placeholder="0.000"
                      value={formData.weight_gross}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    {errors.weight_gross && (
                      <p className="text-sm font-medium text-[#EF4444]">
                        {errors.weight_gross}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Section>

            {/* Section: Material */}
            <Section
              icon={<Layers className="h-5 w-5 text-white" />}
              title="Komposisi Material"
              subtitle="Bahan baku produk"
              color="#8B5CF6"
            >
              <div className="space-y-2">
                <Textarea
                  id="material_composition"
                  name="material_composition"
                  placeholder="Contoh: 80% Tempe, 15% Tepung Beras, 5% Bumbu Rempah"
                  value={formData.material_composition}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows={3}
                />
                {errors.material_composition && (
                  <p className="text-sm font-medium text-[#EF4444]">
                    {errors.material_composition}
                  </p>
                )}
              </div>
            </Section>

            {/* Section: Kualitas */}
            <Section
              icon={<CheckCircle2 className="h-5 w-5 text-white" />}
              title="Spesifikasi Kualitas"
              subtitle="Parameter kualitas produk (opsional)"
              color="#F59E0B"
            >
              <div className="space-y-3">
                {qualitySpecs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Nama (contoh: moisture_content)"
                      value={spec.key}
                      onChange={(e) => handleQualitySpecChange(index, "key", e.target.value)}
                      disabled={loading}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Nilai (contoh: 3%)"
                      value={spec.value}
                      onChange={(e) => handleQualitySpecChange(index, "value", e.target.value)}
                      disabled={loading}
                      className="flex-1"
                    />
                    {qualitySpecs.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeQualitySpec(index)}
                        disabled={loading}
                        className="shrink-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addQualitySpec}
                  disabled={loading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Spesifikasi
                </Button>
              </div>
            </Section>

            {/* Section: Kemasan */}
            <Section
              icon={<Box className="h-5 w-5 text-white" />}
              title="Kemasan & Ketahanan"
              subtitle="Informasi pengemasan"
              color="#EC4899"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="packaging_type">Jenis Kemasan *</Label>
                  <Combobox
                    options={PACKAGING_TYPES.map(type => ({
                      value: type,
                      label: type
                    }))}
                    value={formData.packaging_type}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, packaging_type: String(value) }))
                    }}
                    placeholder="Pilih jenis kemasan..."
                    searchPlaceholder="Cari kemasan..."
                    emptyText="Kemasan tidak ditemukan."
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="durability_claim">Klaim Ketahanan *</Label>
                  <Input
                    id="durability_claim"
                    name="durability_claim"
                    placeholder="Contoh: 6 bulan dalam suhu ruang"
                    value={formData.durability_claim}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  {errors.durability_claim && (
                    <p className="text-sm font-medium text-[#EF4444]">
                      {errors.durability_claim}
                    </p>
                  )}
                </div>
              </div>
            </Section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                size="lg"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    <span>Simpan Produk</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
