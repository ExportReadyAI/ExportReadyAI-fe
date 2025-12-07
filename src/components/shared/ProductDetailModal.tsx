"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { productService } from "@/lib/api/services"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Edit,
  Trash2,
  Sparkles,
  Copy,
  Check,
  Package,
  Ruler,
  Layers,
  Box,
  FileText,
} from "lucide-react"
import { DeleteProductModal } from "@/components/shared/DeleteProductModal"
import type { Product } from "@/lib/api/types"
import { getCategoryName } from "@/lib/constants/categories"

interface ProductDetailModalProps {
  productId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductUpdated?: () => void
  onProductDeleted?: () => void
}

interface InfoCardProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  color: string
}

function InfoCard({ icon, title, children, color }: InfoCardProps) {
  return (
    <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_3px_0_0_#e0f2fe]">
      <div className="flex items-center gap-2 mb-3">
        <div 
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <h4 className="font-bold text-[#0C4A6E]">{title}</h4>
      </div>
      {children}
    </div>
  )
}

export function ProductDetailModal({
  productId,
  open,
  onOpenChange,
  onProductUpdated,
  onProductDeleted,
}: ProductDetailModalProps) {
  const router = useRouter()
  const { isAdmin } = useAuthStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [enriching, setEnriching] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    if (open && productId) {
      fetchProduct(productId.toString())
    } else {
      // Reset state when modal closes
      setProduct(null)
      setError(null)
    }
  }, [open, productId])

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await productService.get(id)

      console.log("Product detail response:", response) // Debug log

      // Handle different response structures
      let productData: Product | null = null

      if (response && typeof response === 'object') {
        // Check if it's our ApiResponse format with success
        if ('success' in response) {
          const apiResponse = response as any
          if (apiResponse.success && apiResponse.data) {
            // Check if data is the product directly
            if ('id' in apiResponse.data && 'name_local' in apiResponse.data) {
              productData = apiResponse.data as Product
            }
            // Check if data has nested structure
            else if (typeof apiResponse.data === 'object') {
              productData = apiResponse.data as Product
            }
          }
        }
        // Check if it's direct product object (no wrapper)
        else if ('id' in response && 'name_local' in response) {
          productData = response as Product
        }
        // Check if response has data property
        else if ('data' in response && response.data) {
          const data = (response as any).data
          if (typeof data === 'object' && 'id' in data && 'name_local' in data) {
            productData = data as Product
          }
        }
      }

      if (productData && productData.id) {
        setProduct(productData)
        console.log("✅ Product loaded successfully:", productData.name_local) // Debug log
      } else {
        console.error("❌ Could not parse product from response:", JSON.stringify(response, null, 2))
        setError("Format response tidak dikenali. Check console untuk detail.")
      }
    } catch (err: any) {
      console.error("Error fetching product:", err)
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
        onProductUpdated?.()
      } else {
        setError(response.message || "Gagal generate SKU & HS Code")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Terjadi kesalahan saat generate SKU & HS Code"
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
        onOpenChange(false)
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

  const enrichment = product?.enrichment

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#F0F9FF]">
          <DialogHeader className="pb-4 border-b-2 border-[#e0f2fe]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F59E0B] shadow-[0_4px_0_0_#d97706]">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Detail Produk</DialogTitle>
                {product && (
                  <p className="text-[#0284C7] font-medium">{product.name_local}</p>
                )}
              </div>
            </div>
            <DialogClose onClose={() => onOpenChange(false)} />
          </DialogHeader>

          {loading ? (
            <div className="py-12 text-center">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#0284C7] shadow-[0_6px_0_0_#065985] animate-bounce mb-4">
                <Package className="h-8 w-8 text-white" />
              </div>
              <p className="text-lg font-bold text-[#0C4A6E]">Memuat detail...</p>
            </div>
          ) : error && !product ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : product ? (
            <div className="space-y-4">
              {/* Action Buttons */}
              {!isAdmin() && (
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onOpenChange(false)
                      router.push(`/products/${product.id}/edit`)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Info Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Info Dasar */}
                <InfoCard 
                  icon={<FileText className="h-4 w-4 text-white" />} 
                  title="Info Dasar"
                  color="#0284C7"
                >
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-bold text-[#7DD3FC] uppercase">Nama Produk</p>
                      <p className="font-bold text-[#0C4A6E]">{product.name_local}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#7DD3FC] uppercase">Kategori</p>
                      <Badge variant="secondary">
                        {product.category?.name || getCategoryName(product.category_id)}
                      </Badge>
                    </div>
                  </div>
                </InfoCard>

                {/* Fisik */}
                <InfoCard 
                  icon={<Ruler className="h-4 w-4 text-white" />} 
                  title="Spesifikasi Fisik"
                  color="#22C55E"
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#7DD3FC] font-medium">Dimensi (P×L×T)</span>
                      <span className="font-bold text-[#0C4A6E]">
                        {product.dimensions_l_w_h.l} × {product.dimensions_l_w_h.w} × {product.dimensions_l_w_h.h} cm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7DD3FC] font-medium">Berat Netto</span>
                      <span className="font-bold text-[#0C4A6E]">{product.weight_net} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7DD3FC] font-medium">Berat Bruto</span>
                      <span className="font-bold text-[#0C4A6E]">{product.weight_gross} kg</span>
                    </div>
                  </div>
                </InfoCard>

                {/* Material */}
                <InfoCard 
                  icon={<Layers className="h-4 w-4 text-white" />} 
                  title="Komposisi Material"
                  color="#8B5CF6"
                >
                  <p className="text-sm text-[#0C4A6E]">{product.material_composition}</p>
                </InfoCard>

                {/* Kemasan */}
                <InfoCard 
                  icon={<Box className="h-4 w-4 text-white" />} 
                  title="Kemasan"
                  color="#EC4899"
                >
                  <Badge variant="outline">{product.packaging_type}</Badge>
                </InfoCard>
              </div>

              {/* Deskripsi */}
              <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_3px_0_0_#e0f2fe]">
                <h4 className="font-bold text-[#0C4A6E] mb-2">📝 Deskripsi</h4>
                <p className="text-sm text-[#0C4A6E] whitespace-pre-wrap">
                  {product.description_local}
                </p>
              </div>

              {/* Quality Specs */}
              {product.quality_specs && Object.keys(product.quality_specs).length > 0 && (
                <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_3px_0_0_#e0f2fe]">
                  <h4 className="font-bold text-[#0C4A6E] mb-3">✅ Spesifikasi Kualitas</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(product.quality_specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between bg-[#F0F9FF] rounded-xl px-3 py-2">
                        <span className="text-sm text-[#7DD3FC] font-medium capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-sm font-bold text-[#0C4A6E]">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Results */}
              <div className="bg-gradient-to-r from-[#F59E0B]/10 to-[#F59E0B]/5 rounded-2xl border-2 border-[#F59E0B]/30 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B] shadow-[0_3px_0_0_#d97706]">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#0C4A6E]">Generate SKU & HS Code</h4>
                      <p className="text-xs text-[#F59E0B] font-medium">Powered by AI & HS Database</p>
                    </div>
                  </div>
                  {!isAdmin() && (
                    <Button
                      onClick={handleEnrich}
                      disabled={enriching}
                      variant={enrichment ? "outline" : "accent"}
                      size="sm"
                    >
                      {enriching ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : enrichment ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Re-run AI
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Run AI
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {enriching ? (
                  <div className="bg-white rounded-xl p-4 space-y-3">
                    {["Menganalisis HS Code...", "Generating SKU...", "Membuat deskripsi Inggris..."].map((text, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-3 w-3 bg-[#F59E0B] rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-[#0C4A6E]">{text}</span>
                      </div>
                    ))}
                  </div>
                ) : enrichment ? (
                  <div className="bg-white rounded-xl p-4 space-y-4">
                    {enrichment.is_manually_edited && (
                      <Badge variant="accent" className="mb-2">✏️ Diedit Manual</Badge>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="bg-[#F0F9FF] rounded-xl p-3">
                        <p className="text-xs font-bold text-[#7DD3FC] mb-1">HS CODE</p>
                        <Badge variant="default" className="text-sm">
                          {enrichment.hs_code_recommendation}
                        </Badge>
                      </div>
                      <div className="bg-[#F0F9FF] rounded-xl p-3">
                        <p className="text-xs font-bold text-[#7DD3FC] mb-1">SKU</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-sm">
                            {enrichment.sku_generated}
                          </Badge>
                          <button
                            onClick={() => copyToClipboard(enrichment.sku_generated, "sku")}
                            className="h-7 w-7 flex items-center justify-center rounded-lg bg-white border border-[#e0f2fe] hover:bg-[#e0f2fe] transition-colors"
                          >
                            {copiedField === "sku" ? (
                              <Check className="h-3 w-3 text-[#22C55E]" />
                            ) : (
                              <Copy className="h-3 w-3 text-[#0284C7]" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {enrichment.name_english_b2b && (
                      <div className="bg-[#F0F9FF] rounded-xl p-3">
                        <p className="text-xs font-bold text-[#7DD3FC] mb-1">NAMA PRODUK (EN)</p>
                        <p className="font-bold text-[#0C4A6E]">{enrichment.name_english_b2b}</p>
                      </div>
                    )}

                    {enrichment.description_english_b2b && (
                      <div className="bg-[#F0F9FF] rounded-xl p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-xs font-bold text-[#7DD3FC] mb-1">DESKRIPSI (EN)</p>
                            <p className="text-sm text-[#0C4A6E]">{enrichment.description_english_b2b}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(enrichment.description_english_b2b, "description")}
                            className="h-7 w-7 flex items-center justify-center rounded-lg bg-white border border-[#e0f2fe] hover:bg-[#e0f2fe] transition-colors"
                          >
                            {copiedField === "description" ? (
                              <Check className="h-3 w-3 text-[#22C55E]" />
                            ) : (
                              <Copy className="h-3 w-3 text-[#0284C7]" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {enrichment.marketing_highlights && enrichment.marketing_highlights.length > 0 && (
                      <div className="bg-[#F0F9FF] rounded-xl p-3">
                        <p className="text-xs font-bold text-[#7DD3FC] mb-2">MARKETING HIGHLIGHTS</p>
                        <div className="flex flex-wrap gap-2">
                          {enrichment.marketing_highlights.map((highlight, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              ✨ {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {enrichment.last_updated_ai && (
                      <p className="text-xs text-[#7DD3FC]">
                        Terakhir diupdate: {new Date(enrichment.last_updated_ai).toLocaleString("id-ID")}
                      </p>
                    )}

                    {!isAdmin() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onOpenChange(false)
                          router.push(`/products/${product.id}/enrich/edit`)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Manual
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-[#F0F9FF] mb-3">
                      <Sparkles className="h-7 w-7 text-[#7DD3FC]" />
                    </div>
                    <p className="font-bold text-[#0C4A6E] mb-1">Belum Ada Hasil AI</p>
                    <p className="text-sm text-[#7DD3FC]">
                      Klik "Run AI" untuk menganalisis produk ini
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <DeleteProductModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        onSuccess={() => {
          onProductDeleted?.()
        }}
        productName={product?.name_local}
      />
    </>
  )
}
