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

const CATEGORIES = [
  { id: 1, name: "Makanan Olahan" },
  { id: 2, name: "Minuman Olahan" },
  { id: 3, name: "Snack & Camilan" },
  { id: 4, name: "Makanan Beku (Frozen Food)" },
  { id: 5, name: "Bahan Makanan Mentah" },
  { id: 6, name: "Produk Organik" },
  { id: 7, name: "Produk Vegan" },
  { id: 8, name: "Rempah-rempah" },
  { id: 9, name: "Kopi & Teh" },
  { id: 10, name: "Sambal & Bumbu Jadi" },

  { id: 11, name: "Kerajinan Kayu" },
  { id: 12, name: "Kerajinan Bambu" },
  { id: 13, name: "Kerajinan Rotan" },
  { id: 14, name: "Kerajinan Kulit" },
  { id: 15, name: "Kerajinan Logam" },
  { id: 16, name: "Kerajinan Kaca" },
  { id: 17, name: "Kerajinan Gerabah" },
  { id: 18, name: "Kerajinan Resin" },
  { id: 19, name: "Souvenir & Merchandise" },
  { id: 20, name: "Aksesori Handmade" },

  { id: 21, name: "Tekstil" },
  { id: 22, name: "Batik" },
  { id: 23, name: "Tenun" },
  { id: 24, name: "Fashion Muslim" },
  { id: 25, name: "Pakaian Pria" },
  { id: 26, name: "Pakaian Wanita" },
  { id: 27, name: "Pakaian Anak" },
  { id: 28, name: "Tas & Dompet" },
  { id: 29, name: "Sepatu & Sandal" },
  { id: 30, name: "Aksesori Fashion" },

  { id: 31, name: "Kosmetik Herbal" },
  { id: 32, name: "Skincare" },
  { id: 33, name: "Produk Perawatan Rambut" },
  { id: 34, name: "Parfum & Fragrance" },
  { id: 35, name: "Sabun & Body Care" },

  { id: 36, name: "Produk Kebersihan" },
  { id: 37, name: "Produk Rumah Tangga" },
  { id: 38, name: "Peralatan Dapur" },
  { id: 39, name: "Dekorasi Rumah" },
  { id: 40, name: "Perabotan Kecil" },

  { id: 41, name: "Mainan Anak" },
  { id: 42, name: "Edukasi & Alat Tulis" },
  { id: 43, name: "Buku & Produk Digital" },
  { id: 44, name: "Produk Kreatif Digital" },

  { id: 45, name: "Alat Pertanian" },
  { id: 46, name: "Pupuk & Nutrisi Tanaman" },
  { id: 47, name: "Bibit Tanaman" },
  { id: 48, name: "Produk Perkebunan" },

  { id: 49, name: "Produk Perikanan" },
  { id: 50, name: "Produk Peternakan" },

  { id: 51, name: "Elektronik Kecil" },
  { id: 52, name: "Aksesori Gadget" },
  { id: 53, name: "Komponen Elektronik" },

  { id: 54, name: "Produk Otomotif" },
  { id: 55, name: "Sparepart Kendaraan" },

  { id: 56, name: "Peralatan Olahraga" },
  { id: 57, name: "Alat Kesehatan" },
  { id: 58, name: "Produk Medis Non-Alat" },

  { id: 59, name: "Produk Eco-Friendly" },
  { id: 60, name: "Produk Daur Ulang" },

  { id: 61, name: "Produk Bangunan" },
  { id: 62, name: "Material Konstruksi Ringan" },

  { id: 63, name: "Produk Kayu Olahan" },
  { id: 64, name: "Produk Plastik Olahan" },

  { id: 65, name: "Produk Logam Ringan" },
  { id: 66, name: "Alat Teknik" },
  { id: 67, name: "Alat Industri Kecil" },

  { id: 68, name: "Produk Event & Dekorasi" },
  { id: 69, name: "Percetakan & Packaging Custom" },

  { id: 70, name: "Produk UMKM Premium" },

  { id: 71, name: "Produk Ekspor Makanan" },
  { id: 72, name: "Produk Ekspor Kerajinan" },
  { id: 73, name: "Produk Ekspor Tekstil" },

  { id: 74, name: "Produk Fashion Premium" },
  { id: 75, name: "Produk Luxury Handmade" },

  { id: 76, name: "Produk Halal" },
  { id: 77, name: "Produk Non-Halal" },

  { id: 78, name: "Produk Tradisional" },
  { id: 79, name: "Produk Modern" },

  { id: 80, name: "Produk Custom" },

  { id: 81, name: "Barang Koleksi" },
  { id: 82, name: "Barang Antik" },

  { id: 83, name: "Produk Startup" },
  { id: 84, name: "Produk Inovasi" },

  { id: 85, name: "Produk Lisensi" },
  { id: 86, name: "Produk OEM" },

  { id: 87, name: "Produk Private Label" },

  { id: 88, name: "Produk Grosir" },
  { id: 89, name: "Produk Retail" },

  { id: 90, name: "Produk Distribusi Massal" },

  { id: 91, name: "Produk Digital Printing" },
  { id: 92, name: "Produk Laser Cutting" },

  { id: 93, name: "Produk 3D Printing" },

  { id: 94, name: "Produk Industri Rumahan" },

  { id: 95, name: "Produk Lokal Unggulan" },

  { id: 96, name: "Produk Wisata & Oleh-Oleh" },

  { id: 97, name: "Produk Event Organizer" },

  { id: 98, name: "Produk Pengemasan" },

  { id: 99, name: "Produk Logistik Pendukung" },

  { id: 100, name: "Kategori Lainnya" },

  { id: 101, name: "Obat Tradisional" },
  { id: 102, name: "Obat Herbal Terstandar (OHT)" },
  { id: 103, name: "Fitofarmaka" },

  { id: 104, name: "Suplemen Kesehatan" },
  { id: 105, name: "Vitamin & Mineral" },

  { id: 106, name: "Obat Bebas" },
  { id: 107, name: "Obat Bebas Terbatas" },
  { id: 108, name: "Obat Keras (Resep)" },

  { id: 109, name: "Produk Farmasi Umum" },

  { id: 110, name: "Alat Kesehatan" },
  { id: 111, name: "Alat Kesehatan Sekali Pakai" },
  { id: 112, name: "Perbekalan Kesehatan Rumah Tangga (PKRT)" },

  { id: 113, name: "Masker & APD" },
  { id: 114, name: "Rapid Test & Diagnostik" },

  { id: 115, name: "Produk Sanitasi Medis" },
  { id: 116, name: "Disinfektan Medis" },

  { id: 117, name: "Produk Rehabilitasi Medis" },
  { id: 118, name: "Produk Ortopedi" },

  { id: 119, name: "Produk Kesehatan Ibu & Anak" },
  { id: 120, name: "Produk Nutrisi Medis" },

  { id: 121, name: "Produk Psikotropika (Terbatas)" },
  { id: 122, name: "Produk Narkotika (Sangat Terbatas)" },

  { id: 123, name: "Produk Veteriner (Obat Hewan)" },
  { id: 124, name: "Vaksin (Non-Manusia)" },

  { id: 125, name: "Produk Medis Lainnya" }
]

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
