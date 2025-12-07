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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { Product, ManualOverrideRequest } from "@/lib/api/types"

export default function ManualOverrideEnrichmentPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated } = useAuthStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ManualOverrideRequest>({
    hs_code_recommendation: "",
    sku_generated: "",
    description_english_b2b: "",
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

        if (productData.enrichment) {
          setFormData({
            hs_code_recommendation:
              productData.enrichment.hs_code_recommendation || "",
            sku_generated: productData.enrichment.sku_generated || "",
            description_english_b2b:
              productData.enrichment.description_english_b2b || "",
          })
        }
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setError(null)
    setSubmitting(true)

    try {
      // Note: The API might need a different endpoint for manual override
      // For now, using PATCH on the product with enrichment data
      const response = await productService.manualOverride(
        product.id,
        formData
      )

      if (response.success) {
        router.push(`/products/${product.id}`)
      } else {
        setError(response.message || "Gagal menyimpan perubahan")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan perubahan"
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <Alert variant="destructive">
              <AlertDescription>Produk tidak ditemukan</AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Manual Override AI Results</CardTitle>
              <CardDescription>
                Edit hasil generate SKU & HS Code secara manual untuk produk:{" "}
                <strong>{product.name_local}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Alert>
                  <AlertDescription>
                    Setelah melakukan override manual, badge "Manually Edited"
                    akan muncul pada hasil enrichment.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="hs_code_recommendation">
                    HS Code Recommendation (8 digits)
                  </Label>
                  <Input
                    id="hs_code_recommendation"
                    name="hs_code_recommendation"
                    value={formData.hs_code_recommendation}
                    onChange={handleChange}
                    placeholder="00000000"
                    maxLength={8}
                    pattern="[0-9]{8}"
                    disabled={submitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Masukkan 8 digit HS Code
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku_generated">SKU Generated</Label>
                  <Input
                    id="sku_generated"
                    name="sku_generated"
                    value={formData.sku_generated}
                    onChange={handleChange}
                    placeholder="CAT-MAT-001"
                    disabled={submitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: CAT-MAT-SEQ (e.g., BAG-LTH-001)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_english_b2b">
                    English Description (B2B)
                  </Label>
                  <Textarea
                    id="description_english_b2b"
                    name="description_english_b2b"
                    value={formData.description_english_b2b}
                    onChange={handleChange}
                    rows={8}
                    disabled={submitting}
                    placeholder="Enter professional B2B description in English..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Deskripsi profesional dalam bahasa Inggris untuk pasar B2B
                  </p>
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
                    {submitting ? "Menyimpan..." : "Save Override"}
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

