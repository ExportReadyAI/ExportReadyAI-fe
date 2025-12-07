"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { buyerRequestService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  ShoppingCart,
  Globe,
  Package,
  TrendingUp,
  Tag,
  Users,
  Star,
  Mail,
  Phone,
  Edit,
  DollarSign,
  Clock,
  Image as ImageIcon,
} from "lucide-react"
import type { BuyerRequest, MatchedUMKM } from "@/lib/api/types"

export default function BuyerRequestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, isBuyer } = useAuthStore()
  const [request, setRequest] = useState<BuyerRequest | null>(null)
  const [matchedUMKM, setMatchedUMKM] = useState<MatchedUMKM[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const requestId = params?.id as string

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !requestId) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token || !isAuthenticated) {
      router.push("/login")
      return
    }

    fetchRequest()
    fetchMatchedUMKM()
  }, [mounted, requestId, router, isAuthenticated])

  const fetchRequest = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await buyerRequestService.get(requestId)
      const requestData = (response as any).success ? (response as any).data : response
      setRequest(requestData as BuyerRequest)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Gagal memuat buyer request")
    } finally {
      setLoading(false)
    }
  }

  const fetchMatchedUMKM = async () => {
    try {
      setLoadingMatches(true)
      const response = await buyerRequestService.getMatchedUMKM(requestId)
      const matchesData = (response as any).success ? (response as any).data : response
      setMatchedUMKM(Array.isArray(matchesData) ? matchesData : [])
    } catch (err: any) {
      console.error("Error fetching matched UMKM:", err)
    } finally {
      setLoadingMatches(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <Badge className="bg-[#22C55E] text-white">Open</Badge>
      case 'Matched':
        return <Badge className="bg-[#0284C7] text-white">Matched</Badge>
      case 'Closed':
        return <Badge className="bg-gray-500 text-white">Closed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (!mounted || !requestId) {
    return null
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F0F9FF]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#0284C7] border-t-transparent"></div>
            <p className="mt-4 text-[#0284C7] font-medium">Memuat data...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="flex h-screen bg-[#F0F9FF]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8">
            <Alert variant="destructive">
              <AlertDescription>{error || "Buyer request tidak ditemukan"}</AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    )
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC4899] shadow-[0_4px_0_0_#be185d]">
                  <ShoppingCart className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                    {request.product_category}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(request.status)}
                    <span className="text-[#0284C7] font-medium text-sm">
                      {new Date(request.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
              {isBuyer() && (
                <Button
                  variant="outline"
                  onClick={() => router.push(`/buyer-requests/${request.id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Request Details */}
              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
                <CardHeader>
                  <CardTitle className="text-2xl font-extrabold text-[#0C4A6E]">
                    Detail Request
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-[#0284C7] font-bold text-sm">Spesifikasi Produk</Label>
                    <p className="mt-1 text-[#0C4A6E] whitespace-pre-wrap">{request.spec_requirements}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#0284C7] font-bold text-sm flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        Negara Tujuan
                      </Label>
                      <p className="mt-1 text-[#0C4A6E] font-medium">{request.destination_country}</p>
                    </div>
                    <div>
                      <Label className="text-[#0284C7] font-bold text-sm flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Volume Target
                      </Label>
                      <p className="mt-1 text-[#0C4A6E] font-medium">{request.target_volume.toLocaleString()} units</p>
                    </div>
                  </div>

                  {request.hs_code_target && (
                    <div>
                      <Label className="text-[#0284C7] font-bold text-sm">HS Code Target</Label>
                      <p className="mt-1 text-[#0C4A6E] font-medium">{request.hs_code_target}</p>
                    </div>
                  )}

                  {request.keyword_tags && request.keyword_tags.length > 0 && (
                    <div>
                      <Label className="text-[#0284C7] font-bold text-sm flex items-center gap-1 mb-2">
                        <Tag className="h-4 w-4" />
                        Keywords
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {request.keyword_tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.min_rank_required > 0 && (
                    <div>
                      <Label className="text-[#0284C7] font-bold text-sm">Minimum Rank UMKM</Label>
                      <p className="mt-1 text-[#0C4A6E] font-medium">{request.min_rank_required}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Matched UMKM */}
              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
                <CardHeader>
                  <CardTitle className="text-2xl font-extrabold text-[#0C4A6E] flex items-center gap-2">
                    <Users className="h-6 w-6 text-[#EC4899]" />
                    Matched UMKM ({matchedUMKM.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingMatches ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#0284C7] border-t-transparent"></div>
                      <p className="mt-2 text-sm text-gray-500">Mencari UMKM yang sesuai...</p>
                    </div>
                  ) : matchedUMKM.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Belum ada UMKM yang match dengan kriteria Anda
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {matchedUMKM.map((umkm) => (
                        <Card key={umkm.umkm_id} className="border-2 border-[#e0f2fe] shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            {/* Header with Company Info */}
                            <div className="flex items-start justify-between mb-4 pb-4 border-b border-[#e0f2fe]">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-xl font-extrabold text-[#0C4A6E]">{umkm.company_name}</h4>
                                  {umkm.match && (
                                    <Badge className="bg-[#22C55E] text-white text-sm font-bold px-3 py-1">
                                      Matched
                                    </Badge>
                                  )}
                                </div>
                                {umkm.full_name && (
                                  <p className="text-sm text-gray-600 mb-2">Contact: {umkm.full_name}</p>
                                )}
                                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                  {umkm.email && (
                                    <div className="flex items-center gap-1">
                                      <Mail className="h-4 w-4" />
                                      <span>{umkm.email}</span>
                                    </div>
                                  )}
                                  {umkm.contact_info?.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-4 w-4" />
                                      <span>{umkm.contact_info.phone}</span>
                                    </div>
                                  )}
                                  {umkm.contact_info?.address && (
                                    <div className="flex items-center gap-1">
                                      <Globe className="h-4 w-4" />
                                      <span className="line-clamp-1">{umkm.contact_info.address}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Catalog Information */}
                            <div className="mb-4">
                              <div className="flex items-start gap-4">
                                {umkm.catalog.primary_image_url && (
                                  <div className="flex-shrink-0">
                                    <img
                                      src={umkm.catalog.primary_image_url}
                                      alt={umkm.catalog.display_name}
                                      className="w-24 h-24 object-cover rounded-xl border-2 border-[#e0f2fe]"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none'
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h5 className="font-bold text-lg text-[#0C4A6E] mb-2">{umkm.catalog.display_name}</h5>
                                  {umkm.catalog.export_description && (
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                      {umkm.catalog.export_description}
                                    </p>
                                  )}
                                  {umkm.catalog.tags && umkm.catalog.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {umkm.catalog.tags.slice(0, 5).map((tag, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Pricing & Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-4 bg-[#F0F9FF] rounded-xl">
                              <div>
                                <Label className="text-[#0284C7] font-bold text-xs flex items-center gap-1 mb-1">
                                  <DollarSign className="h-3 w-3" />
                                  EXW Price
                                </Label>
                                <p className="text-[#0C4A6E] font-bold">${umkm.catalog.base_price_exw.toFixed(2)}</p>
                                {umkm.catalog.base_price_fob && (
                                  <p className="text-xs text-gray-500">FOB: ${umkm.catalog.base_price_fob.toFixed(2)}</p>
                                )}
                                {umkm.catalog.base_price_cif && (
                                  <p className="text-xs text-gray-500">CIF: ${umkm.catalog.base_price_cif.toFixed(2)}</p>
                                )}
                              </div>
                              <div>
                                <Label className="text-[#0284C7] font-bold text-xs flex items-center gap-1 mb-1">
                                  <Package className="h-3 w-3" />
                                  MOQ
                                </Label>
                                <p className="text-[#0C4A6E] font-bold">
                                  {umkm.catalog.min_order_quantity.toLocaleString()} {umkm.catalog.unit_type}
                                </p>
                              </div>
                              <div>
                                <Label className="text-[#0284C7] font-bold text-xs flex items-center gap-1 mb-1">
                                  <Clock className="h-3 w-3" />
                                  Lead Time
                                </Label>
                                <p className="text-[#0C4A6E] font-bold">{umkm.catalog.lead_time_days} days</p>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-4 pt-4 border-t border-[#e0f2fe]">
                              <Button
                                onClick={() => router.push(`/catalogs/${umkm.catalog.id}`)}
                                className="w-full bg-[#0284C7] hover:bg-[#0369a1] shadow-[0_4px_0_0_#065985]"
                              >
                                <Package className="mr-2 h-4 w-4" />
                                View Full Catalog
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-[#EC4899] to-[#db2777] rounded-3xl p-6 shadow-[0_6px_0_0_#be185d] text-white">
                <h3 className="font-bold text-lg mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="opacity-80">Created</p>
                    <p className="font-bold">{new Date(request.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="opacity-80">Updated</p>
                    <p className="font-bold">{new Date(request.updated_at).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="opacity-80">Status</p>
                    <div className="mt-1">{getStatusBadge(request.status)}</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper component for Label
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`block ${className || ''}`}>{children}</label>
}

