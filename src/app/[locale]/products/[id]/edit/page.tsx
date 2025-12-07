"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { productService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Minus } from "lucide-react"
import type { Product, UpdateProductRequest, QualitySpecs } from "@/lib/api/types"

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
  "Kertas Kraft",
  "Corrugated Box",
  "Karton Duplex",
  "Karton Lipat",
  "Dus",
  "Kayu Pallet",
  "Kayu Crate",
  "Bambu",
  "Rotan",
  "Anyaman",
  "Kain",
  "Kanvas",
  "Jute Bag",
  "Kaca",
  "Botol Kaca",
  "Jar Kaca",
  "Logam",
  "Kaleng",
  "Tin Can",
  "Styrofoam",
  "Bubble Wrap",
  "Poly Mailer",
  "Ziplock",
  "Box Kayu Custom",
  "Dus Premium",
  "Paper Bag",
  "Gift Box",
  "Tube Karton",
  "Shrink Wrap",
  "Stretch Film",
  "Eco-Friendly Packaging",
  "Biodegradable Plastic",
  "Compostable Pack",
  "Reusable Bag",
  "Container Plastik",
  "Tray Plastik",
  "Cup Plastik",
  "Foam Container",
  "Carton Box Multi-layer",
  "Export Packaging",
  "Packing Kayu ISPM-15",
  "Fumigated Wood",
  "Custom Box",
  "Box Sandwich Panel",
  "Isothermal Box",
  "Cold Chain Packaging",
  "Insulated Bag",
  "Frozen Pack Compatible",
  "Dry Ice Compatible",
  "Gel Pack Included",
  "Tetra Pack",
  "Aseptic Packaging",
  "Modified Atmosphere Pack (MAP)",
  "Lainnya",
]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated } = useAuthStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<UpdateProductRequest | null>(null)
  const [qualitySpecs, setQualitySpecs] = useState<Array<{ key: string; value: string }>>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [isAuthenticated, router, params.id])

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true)
      const response = await productService.get(id)

      if (response.success && response.data) {
        const productData = response.data
        setProduct(productData)

        // Convert quality_specs object to array
        const specsArray = Object.entries(productData.quality_specs || {}).map(
          ([key, value]) => ({ key, value: String(value) })
        )
        if (specsArray.length === 0) {
          specsArray.push({ key: "", value: "" })
        }
        setQualitySpecs(specsArray)

        // Set form data
        setFormData({
          name_local: productData.name_local,
          category_id: productData.category_id,
          description_local: productData.description_local,
          material_composition: productData.material_composition,
          production_technique: productData.production_technique,
          finishing_type: productData.finishing_type,
          quality_specs: productData.quality_specs,
          durability_claim: productData.durability_claim,
          packaging_type: productData.packaging_type,
          dimensions_l_w_h: productData.dimensions_l_w_h,
          weight_net: productData.weight_net,
          weight_gross: productData.weight_gross,
        })
      } else {
        setError("Gagal memuat detail produk")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!formData) return
    const { name, value } = e.target
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleDimensionChange = (
    field: "l" | "w" | "h",
    value: string
  ) => {
    if (!formData) return
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            dimensions_l_w_h: {
              ...prev.dimensions_l_w_h,
              [field]: Number(value) || 0,
            },
          }
        : null
    )
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
    if (!formData) return false
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

    if (formData.dimensions_l_w_h.l <= 0 || formData.dimensions_l_w_h.w <= 0 || formData.dimensions_l_w_h.h <= 0) {
      newErrors.dimensions = "Dimensi harus lebih dari 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || !product) return

    setError(null)

    // Convert quality specs array to object
    const qualitySpecsObj: QualitySpecs = {}
    qualitySpecs.forEach((spec) => {
      if (spec.key && spec.value) {
        qualitySpecsObj[spec.key] = spec.value
      }
    })

    const submitData: UpdateProductRequest = {
      ...formData,
      category_id: Number(formData.category_id),
      quality_specs: qualitySpecsObj,
    }

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const response = await productService.update(product.id, submitData)

      if (response.success) {
        router.push(`/products/${product.id}`)
      } else {
        setError(response.message || "Gagal mengupdate produk")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Terjadi kesalahan saat mengupdate produk"
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated || loading || !formData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Edit Product</CardTitle>
              <CardDescription>
                Update informasi produk Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Same form structure as Create, but with pre-filled data */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Info Dasar</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name_local">Nama Produk *</Label>
                      <Input
                        id="name_local"
                        name="name_local"
                        value={formData.name_local}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category_id">Kategori *</Label>
                      <Combobox
                        options={CATEGORIES.map((cat) => ({
                          label: cat.name,
                          value: cat.id.toString(),
                        }))}
                        value={formData.category_id.toString()}
                        onChange={(value) =>
                          setFormData({ ...formData, category_id: Number(value) })
                        }
                        placeholder="Pilih kategori..."
                        searchPlaceholder="Cari kategori..."
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Deskripsi</h3>
                  <div className="space-y-2">
                    <Label htmlFor="description_local">
                      Deskripsi Produk * (max 500 karakter)
                    </Label>
                    <Textarea
                      id="description_local"
                      name="description_local"
                      value={formData.description_local}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.description_local.length}/500 karakter
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Spesifikasi Fisik</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="dimensions_l">Panjang (cm) *</Label>
                      <Input
                        id="dimensions_l"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={formData.dimensions_l_w_h.l || ""}
                        onChange={(e) =>
                          handleDimensionChange("l", e.target.value)
                        }
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dimensions_w">Lebar (cm) *</Label>
                      <Input
                        id="dimensions_w"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={formData.dimensions_l_w_h.w || ""}
                        onChange={(e) =>
                          handleDimensionChange("w", e.target.value)
                        }
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dimensions_h">Tinggi (cm) *</Label>
                      <Input
                        id="dimensions_h"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={formData.dimensions_l_w_h.h || ""}
                        onChange={(e) =>
                          handleDimensionChange("h", e.target.value)
                        }
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="weight_net">Berat Netto (kg) *</Label>
                      <Input
                        id="weight_net"
                        name="weight_net"
                        type="number"
                        min="0.001"
                        step="0.001"
                        value={formData.weight_net}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight_gross">Berat Bruto (kg) *</Label>
                      <Input
                        id="weight_gross"
                        name="weight_gross"
                        type="number"
                        min="0.001"
                        step="0.001"
                        value={formData.weight_gross}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Komposisi Material</h3>
                  <div className="space-y-2">
                    <Label htmlFor="material_composition">
                      Komposisi Material *
                    </Label>
                    <Textarea
                      id="material_composition"
                      name="material_composition"
                      value={formData.material_composition}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Spesifikasi Kualitas</h3>
                  <div className="space-y-2">
                    {qualitySpecs.map((spec, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Key"
                          value={spec.key}
                          onChange={(e) =>
                            handleQualitySpecChange(index, "key", e.target.value)
                          }
                          disabled={submitting}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Value"
                          value={spec.value}
                          onChange={(e) =>
                            handleQualitySpecChange(index, "value", e.target.value)
                          }
                          disabled={submitting}
                          className="flex-1"
                        />
                        {qualitySpecs.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQualitySpec(index)}
                            disabled={submitting}
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
                      disabled={submitting}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Row
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Kemasan</h3>
                  <div className="space-y-2">
                    <Label htmlFor="packaging_type">Jenis Kemasan *</Label>
                    <Combobox
                      options={PACKAGING_TYPES.map((type) => ({
                        label: type,
                        value: type,
                      }))}
                      value={formData.packaging_type}
                      onChange={(value) =>
                        setFormData({ ...formData, packaging_type: value })
                      }
                      placeholder="Pilih jenis kemasan..."
                      searchPlaceholder="Cari kemasan..."
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durability_claim">Klaim Ketahanan *</Label>
                    <Input
                      id="durability_claim"
                      name="durability_claim"
                      value={formData.durability_claim}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={submitting}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Memproses..." : "Update Product"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

