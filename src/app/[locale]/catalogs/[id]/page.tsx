"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { catalogService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AIDescriptionGenerator } from "@/components/catalog/AIDescriptionGenerator"
import { CatalogImagesManager } from "@/components/catalog/CatalogImagesManager"
import { CatalogVariantsManager } from "@/components/catalog/CatalogVariantsManager"
import {
  BookMarked,
  ArrowLeft,
  Edit,
  Globe,
  EyeOff,
  DollarSign,
  Package,
  Clock,
  Tag,
  Sparkles,
  Image as ImageIcon,
  Layers,
  FileText,
  Shield,
  Loader2,
  CheckCircle,
  Building2,
  Mail,
  MapPin,
  User,
} from "lucide-react"
import type { Catalog, ForwarderCatalog } from "@/lib/api/types"

export default function CatalogDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isBuyer, isForwarder, isUMKM } = useAuthStore()
  const catalogId = params.id as string
  
  // Check if user is buyer or forwarder (read-only access)
  const isReadOnly = isBuyer() || isForwarder()

  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [catalog, setCatalog] = useState<Catalog | ForwarderCatalog | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [activeTab, setActiveTab] = useState<"description" | "images" | "variants">("description")

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

    // Allow buyers to view catalog details (read-only from matched UMKM)
    fetchCatalog()
  }, [mounted, router, catalogId])

  const fetchCatalog = async () => {
    try {
      setLoading(true)
      const response = await catalogService.get(catalogId)

      let catalogData: Catalog | ForwarderCatalog | null = null

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          catalogData = (response as any).data
        } else if ('id' in response) {
          catalogData = response as Catalog | ForwarderCatalog
        }
      }

      if (catalogData) {
        setCatalog(catalogData)
      } else {
        setError("Katalog tidak ditemukan")
      }
    } catch (err: any) {
      console.error('Catalog fetch error:', err)
      
      // Handle 403 Forbidden for buyers
      if (err.response?.status === 403) {
        setError("Maaf, Anda tidak memiliki akses untuk melihat detail katalog ini. Silakan hubungi admin untuk informasi lebih lanjut.")
      } else {
        setError(err.response?.data?.message || err.response?.data?.detail || "Gagal memuat katalog")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublish = async () => {
    if (!catalog) return

    try {
      setPublishing(true)
      await catalogService.update(catalogId, {
        is_published: !catalog.is_published
      })
      fetchCatalog()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengubah status publish")
    } finally {
      setPublishing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  if (!mounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F9FF]">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#8B5CF6] shadow-[0_6px_0_0_#6d28d9] animate-bounce">
            <BookMarked className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-bold text-[#0C4A6E]">Memuat katalog...</p>
        </div>
      </div>
    )
  }

  if (error && !catalog) {
    return (
      <div className="flex h-screen bg-[#F0F9FF]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={() => router.push(isBuyer() ? "/buyer-requests" : "/catalogs")}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isBuyer() ? "Kembali ke Buyer Requests" : "Kembali ke Katalog"}
            </Button>
          </div>
        </main>
      </div>
    )
  }

  if (!catalog) return null

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => {
                if (isBuyer()) {
                  router.push("/buyer-requests")
                } else if (isForwarder()) {
                  router.push("/forwarders/catalogs")
                } else {
                  router.push("/catalogs")
                }
              }}
              className="mb-4 text-[#0284C7] hover:text-[#0369a1] hover:bg-[#e0f2fe]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isBuyer() ? "Kembali ke Buyer Requests" : isForwarder() ? "Kembali ke Katalog" : "Kembali ke Katalog"}
            </Button>

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                    {catalog.display_name}
                  </h1>
                  <Badge
                    className={catalog.is_published
                      ? "bg-[#22C55E] text-white border-0"
                      : "bg-[#F59E0B] text-white border-0"
                    }
                  >
                    {catalog.is_published ? (
                      <>
                        <Globe className="h-3 w-3 mr-1" />
                        Published
                      </>
                    ) : (
                      "Draft"
                    )}
                  </Badge>
                </div>
                {catalog.marketing_description && (
                  <p className="text-[#0284C7] font-medium max-w-2xl">
                    {catalog.marketing_description}
                  </p>
                )}
              </div>

              {/* Show Edit/Publish buttons only for UMKM users */}
              {isUMKM() && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleTogglePublish}
                    disabled={publishing}
                  >
                    {publishing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : catalog.is_published ? (
                      <EyeOff className="mr-2 h-4 w-4" />
                    ) : (
                      <Globe className="mr-2 h-4 w-4" />
                    )}
                    {catalog.is_published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    onClick={() => router.push(`/catalogs/${catalogId}/edit`)}
                    className="bg-[#8B5CF6] hover:bg-[#7c3aed] shadow-[0_4px_0_0_#6d28d9]"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Katalog
                  </Button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_4px_0_0_#e0f2fe]">
              <div className="flex items-center gap-2 text-[#7DD3FC] mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs font-bold">Harga EXW</span>
              </div>
              <p className="text-xl font-extrabold text-[#0C4A6E]">
                {formatPrice(catalog.base_price_exw)}
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_4px_0_0_#e0f2fe]">
              <div className="flex items-center gap-2 text-[#7DD3FC] mb-1">
                <Package className="h-4 w-4" />
                <span className="text-xs font-bold">MOQ</span>
              </div>
              <p className="text-xl font-extrabold text-[#0C4A6E]">
                {catalog.min_order_quantity} {catalog.unit_type}
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_4px_0_0_#e0f2fe]">
              <div className="flex items-center gap-2 text-[#7DD3FC] mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-bold">Lead Time</span>
              </div>
              <p className="text-xl font-extrabold text-[#0C4A6E]">
                {catalog.lead_time_days} hari
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_4px_0_0_#e0f2fe]">
              <div className="flex items-center gap-2 text-[#7DD3FC] mb-1">
                <Layers className="h-4 w-4" />
                <span className="text-xs font-bold">Tipe Varian</span>
              </div>
              <p className="text-xl font-extrabold text-[#0C4A6E]">
                {catalog.variant_types?.length || 0}
              </p>
            </div>
          </div>

          {/* Seller Information (for Forwarders) */}
          {'seller_name' in catalog && catalog.seller_name && (
            <div className="bg-gradient-to-r from-[#F0F9FF] to-[#e0f2fe] rounded-2xl border-2 border-[#7DD3FC] p-5 shadow-[0_4px_0_0_#7DD3FC] mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-[#6366F1]" />
                <h3 className="font-bold text-lg text-[#0C4A6E]">Informasi UMKM</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-[#6366F1]" />
                    <span className="text-sm font-bold text-[#0C4A6E]">Nama Perusahaan</span>
                  </div>
                  <p className="text-[#0284C7] font-medium">{catalog.seller_name}</p>
                </div>
                {catalog.seller_full_name && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-[#6366F1]" />
                      <span className="text-sm font-bold text-[#0C4A6E]">Nama Lengkap</span>
                    </div>
                    <p className="text-[#0284C7] font-medium">{catalog.seller_full_name}</p>
                  </div>
                )}
                {catalog.seller_email && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-[#6366F1]" />
                      <span className="text-sm font-bold text-[#0C4A6E]">Email</span>
                    </div>
                    <a 
                      href={`mailto:${catalog.seller_email}`}
                      className="text-[#0284C7] font-medium hover:underline"
                    >
                      {catalog.seller_email}
                    </a>
                  </div>
                )}
                {catalog.seller_address && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-[#6366F1]" />
                      <span className="text-sm font-bold text-[#0C4A6E]">Alamat</span>
                    </div>
                    <p className="text-[#0284C7] font-medium">{catalog.seller_address}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {catalog.tags && catalog.tags.length > 0 && (
            <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_4px_0_0_#e0f2fe] mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-[#8B5CF6]" />
                <span className="font-bold text-[#0C4A6E]">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {catalog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-2 shadow-[0_4px_0_0_#e0f2fe] mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("description")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-200 ${
                  activeTab === "description"
                    ? "bg-[#8B5CF6] text-white shadow-[0_4px_0_0_#6d28d9] -translate-y-0.5"
                    : "text-[#0C4A6E] hover:bg-[#F0F9FF]"
                }`}
              >
                <Sparkles className="h-5 w-5" />
                AI Description
              </button>
              <button
                onClick={() => setActiveTab("images")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-200 ${
                  activeTab === "images"
                    ? "bg-[#0284C7] text-white shadow-[0_4px_0_0_#065985] -translate-y-0.5"
                    : "text-[#0C4A6E] hover:bg-[#F0F9FF]"
                }`}
              >
                <ImageIcon className="h-5 w-5" />
                Gambar ({catalog.images?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("variants")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-200 ${
                  activeTab === "variants"
                    ? "bg-[#22C55E] text-white shadow-[0_4px_0_0_#15803d] -translate-y-0.5"
                    : "text-[#0C4A6E] hover:bg-[#F0F9FF]"
                }`}
              >
                <Layers className="h-5 w-5" />
                Varian ({catalog.variant_types?.length || 0})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "description" && (
            <AIDescriptionGenerator
              catalogId={parseInt(catalogId)}
              catalog={catalog}
              onUpdate={fetchCatalog}
              readOnly={isReadOnly}
            />
          )}

          {activeTab === "images" && (
            <CatalogImagesManager
              catalogId={parseInt(catalogId)}
              images={catalog.images || []}
              onUpdate={fetchCatalog}
              readOnly={isReadOnly}
            />
          )}

          {activeTab === "variants" && (
            <CatalogVariantsManager
              catalogId={parseInt(catalogId)}
              variantTypes={catalog.variant_types || []}
              onUpdate={fetchCatalog}
              readOnly={isReadOnly}
            />
          )}
        </div>
      </main>
    </div>
  )
}
