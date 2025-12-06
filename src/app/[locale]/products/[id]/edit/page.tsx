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
import { Select } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Minus } from "lucide-react"
import type { Product, UpdateProductRequest, QualitySpecs } from "@/lib/api/types"

const CATEGORIES = [
  { id: 1, name: "Makanan Olahan" },
  { id: 2, name: "Kerajinan Tangan" },
  { id: 3, name: "Tekstil" },
]

const PACKAGING_TYPES = [
  "Plastik",
  "Karton",
  "Kayu",
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
                      <Select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id.toString()}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </Select>
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
                    <Select
                      id="packaging_type"
                      name="packaging_type"
                      value={formData.packaging_type}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    >
                      {PACKAGING_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
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

