"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { productService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Edit,
  Trash2,
  Sparkles,
  FileText,
  Calculator,
  Copy,
  Check,
} from "lucide-react"
import { DeleteProductModal } from "@/components/shared/DeleteProductModal"
import type { Product } from "@/lib/api/types"

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [enriching, setEnriching] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

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
        setProduct(response.data)
      } else {
        setError("Gagal memuat detail produk")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleEnrich = async () => {
    if (!product) return

    setEnriching(true)
    setError(null)

    try {
      const response = await productService.enrich(product.id)

      if (response.success) {
        // Refresh product data
        await fetchProduct(product.id.toString())
      } else {
        setError(response.message || "Gagal melakukan AI enrichment")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Terjadi kesalahan saat melakukan AI enrichment"
      )
    } finally {
      setEnriching(false)
    }
  }

  const handleDelete = async () => {
    if (!product) return

    try {
      const response = await productService.delete(product.id)

      if (response.success) {
        router.push("/products")
      } else {
        throw new Error(response.message || "Gagal menghapus produk")
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Terjadi kesalahan saat menghapus produk"
      )
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
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

  const enrichment = product.enrichment

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{product.name_local}</h1>
              <p className="text-muted-foreground mt-2">
                Detail Produk
              </p>
            </div>
            {!isAdmin() && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/products/${product.id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Product
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Product
                </Button>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Info Dasar */}
            <Card>
              <CardHeader>
                <CardTitle>Info Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Nama Produk
                  </p>
                  <p className="text-lg font-semibold">{product.name_local}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Kategori
                  </p>
                  <p className="text-base">
                    {product.category?.name || `Category ID: ${product.category_id}`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Deskripsi */}
            <Card>
              <CardHeader>
                <CardTitle>Deskripsi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base whitespace-pre-wrap">
                  {product.description_local}
                </p>
              </CardContent>
            </Card>

            {/* Fisik */}
            <Card>
              <CardHeader>
                <CardTitle>Spesifikasi Fisik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Dimensi (P × L × T)
                  </p>
                  <p className="text-base">
                    {product.dimensions_l_w_h.l} × {product.dimensions_l_w_h.w} ×{" "}
                    {product.dimensions_l_w_h.h} cm
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Berat Netto
                  </p>
                  <p className="text-base">{product.weight_net} kg</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Berat Bruto
                  </p>
                  <p className="text-base">{product.weight_gross} kg</p>
                </div>
              </CardContent>
            </Card>

            {/* Material */}
            <Card>
              <CardHeader>
                <CardTitle>Komposisi Material</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base whitespace-pre-wrap">
                  {product.material_composition}
                </p>
              </CardContent>
            </Card>

            {/* Kualitas */}
            <Card>
              <CardHeader>
                <CardTitle>Spesifikasi Kualitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(product.quality_specs || {}).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span className="text-base">{String(value)}</span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Kemasan */}
            <Card>
              <CardHeader>
                <CardTitle>Kemasan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">{product.packaging_type}</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Results */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Enrichment Results
                </CardTitle>
                {!isAdmin() && (
                  <Button
                    onClick={handleEnrich}
                    disabled={enriching}
                    variant={enrichment ? "outline" : "default"}
                  >
                    {enriching ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : enrichment ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Re-run AI Enrichment
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Run AI Enrichment
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {enriching ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                    <span>Processing HS Code...</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                    <span>Generating SKU...</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                    <span>Creating English Description...</span>
                  </div>
                </div>
              ) : enrichment ? (
                <div className="space-y-6">
                  {enrichment.is_manually_edited && (
                    <Badge variant="secondary">Manually Edited</Badge>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        HS Code
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-base px-3 py-1">
                          {enrichment.hs_code_recommendation}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Harmonized System Code untuk ekspor
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        SKU Generated
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-base px-3 py-1">
                          {enrichment.sku_generated}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              enrichment.sku_generated,
                              "sku"
                            )
                          }
                        >
                          {copiedField === "sku" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      English Product Name (B2B)
                    </p>
                    <p className="text-base font-semibold">
                      {enrichment.name_english_b2b}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      English Description (B2B)
                    </p>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-base whitespace-pre-wrap flex-1">
                        {enrichment.description_english_b2b}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            enrichment.description_english_b2b,
                            "description"
                          )
                        }
                      >
                        {copiedField === "description" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {enrichment.marketing_highlights &&
                    enrichment.marketing_highlights.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Marketing Highlights
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {enrichment.marketing_highlights.map(
                            (highlight, idx) => (
                              <li key={idx} className="text-base">
                                {highlight}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {enrichment.last_updated_ai && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Last updated:{" "}
                        {new Date(
                          enrichment.last_updated_ai
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>
                  )}

                  {!isAdmin() && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/products/${product.id}/enrich/edit`)
                      }
                    >
                      Edit Manual
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada hasil AI enrichment</p>
                  <p className="text-sm mt-2">
                    Klik "Run AI Enrichment" untuk memulai
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {!isAdmin() && (
            <div className="mt-6 flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/products")}
              >
                Kembali ke Daftar Produk
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/products/${product.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </Button>
            </div>
          )}

          <DeleteProductModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onConfirm={handleDelete}
            productName={product.name_local}
          />
        </div>
      </main>
    </div>
  )
}

