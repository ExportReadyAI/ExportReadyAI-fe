"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { forwarderService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Truck,
  Star,
  Mail,
  Phone,
  Globe,
  Package,
  MapPin,
  MessageSquare,
  MessageCircle,
} from "lucide-react"
import type { ForwarderProfile, ForwarderReview } from "@/lib/api/types"
import { ReviewModal } from "@/components/shared/ReviewModal"
import { WhatsAppDialog } from "@/components/shared/WhatsAppDialog"

export default function ForwarderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, isUMKM } = useAuthStore()
  const [forwarder, setForwarder] = useState<ForwarderProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const forwarderId = params?.id as string

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !forwarderId) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token || !isAuthenticated) {
      router.push("/login")
      return
    }

    fetchForwarder()
  }, [mounted, forwarderId, router, isAuthenticated])

  const fetchForwarder = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await forwarderService.get(forwarderId)
      const forwarderData = (response as any).success ? (response as any).data : response
      setForwarder(forwarderData as ForwarderProfile)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Gagal memuat forwarder")
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSuccess = () => {
    fetchForwarder()
    setReviewModalOpen(false)
  }

  if (!mounted || !forwarderId) {
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

  if (error || !forwarder) {
    return (
      <div className="flex h-screen bg-[#F0F9FF]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8">
            <Alert variant="destructive">
              <AlertDescription>{error || "Forwarder tidak ditemukan"}</AlertDescription>
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
              onClick={() => router.push("/forwarders")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6366F1] shadow-[0_4px_0_0_#4f46e5]">
                  <Truck className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                    {forwarder.company_name}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(Number(forwarder.average_rating) || 0)
                              ? 'text-[#F59E0B] fill-[#F59E0B]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-[#0C4A6E]">
                      {Number(forwarder.average_rating) > 0 ? Number(forwarder.average_rating).toFixed(1) : '0.0'}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({forwarder.total_reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              {isUMKM() && (
                <Button
                  onClick={() => setReviewModalOpen(true)}
                  className="rounded-2xl shadow-[0_4px_0_0_#4f46e5]"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Beri Review
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Info */}
              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
                <CardHeader>
                  <CardTitle className="text-2xl font-extrabold text-[#0C4A6E]">
                    Informasi Perusahaan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {forwarder.contact_info.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#0284C7]" />
                      <span className="text-[#0C4A6E]">{forwarder.contact_info.email}</span>
                    </div>
                  )}
                  {forwarder.contact_info.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#0284C7]" />
                      <span className="text-[#0C4A6E]">{forwarder.contact_info.phone}</span>
                      <Button
                        onClick={() => setWhatsappDialogOpen(true)}
                        size="sm"
                        className="ml-2 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold shadow-[0_2px_0_0_#16a34a] h-8 px-3"
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
                  )}
                  {forwarder.contact_info.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#0284C7] mt-1" />
                      <span className="text-[#0C4A6E]">{forwarder.contact_info.address}</span>
                    </div>
                  )}
                  {forwarder.contact_info.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#0284C7]" />
                      <a href={forwarder.contact_info.website} target="_blank" rel="noopener noreferrer" className="text-[#0284C7] hover:underline">
                        {forwarder.contact_info.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Routes */}
              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
                <CardHeader>
                  <CardTitle className="text-2xl font-extrabold text-[#0C4A6E] flex items-center gap-2">
                    <Globe className="h-6 w-6 text-[#6366F1]" />
                    Specialization Routes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {forwarder.specialization_routes.map((route, idx) => (
                      <Badge key={idx} className="bg-[#F0F9FF] text-[#0284C7] border border-[#e0f2fe]">
                        {route}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
                <CardHeader>
                  <CardTitle className="text-2xl font-extrabold text-[#0C4A6E] flex items-center gap-2">
                    <Package className="h-6 w-6 text-[#6366F1]" />
                    Service Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {forwarder.service_types.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
                <CardHeader>
                  <CardTitle className="text-2xl font-extrabold text-[#0C4A6E]">
                    Reviews ({forwarder.total_reviews})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {forwarder.recent_reviews && forwarder.recent_reviews.length > 0 ? (
                    <div className="space-y-4">
                      {forwarder.recent_reviews.map((review: ForwarderReview) => (
                        <div key={review.id} className="border-b border-[#e0f2fe] pb-4 last:border-0 last:pb-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-bold text-[#0C4A6E]">
                                {review.umkm_name || review.umkm_company || 'Anonymous'}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating
                                        ? 'text-[#F59E0B] fill-[#F59E0B]'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(review.created_at).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          {review.review_text && (
                            <p className="text-gray-600 text-sm">{review.review_text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Belum ada review
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-[#6366F1] to-[#4f46e5] rounded-3xl p-6 shadow-[0_6px_0_0_#4338ca] text-white">
                <h3 className="font-bold text-lg mb-4">Rating Summary</h3>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold mb-1">
                      {Number(forwarder.average_rating) > 0 ? Number(forwarder.average_rating).toFixed(1) : '0.0'}
                    </div>
                    <div className="flex justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(Number(forwarder.average_rating) || 0)
                              ? 'text-[#F59E0B] fill-[#F59E0B]'
                              : 'text-white/30'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm opacity-80 mt-2">
                      Berdasarkan {forwarder.total_reviews} review
                    </p>
                  </div>

                  {forwarder.rating_distribution && (
                    <div className="space-y-2 mt-4 pt-4 border-t border-white/20">
                      {Object.entries(forwarder.rating_distribution).reverse().map(([star, count]) => (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span>{star} bintang</span>
                          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#F59E0B]"
                              style={{ width: `${forwarder.total_reviews > 0 ? (Number(count) / forwarder.total_reviews) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-xs">{Number(count)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {reviewModalOpen && forwarder && (
        <ReviewModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          forwarderId={forwarder.id}
          onSuccess={handleReviewSuccess}
        />
      )}

      {/* WhatsApp Dialog */}
      {forwarder?.contact_info.phone && (
        <WhatsAppDialog
          open={whatsappDialogOpen}
          onOpenChange={setWhatsappDialogOpen}
          phone={forwarder.contact_info.phone}
          recipientName={forwarder.user_full_name}
          recipientCompany={forwarder.company_name}
        />
      )}
    </div>
  )
}

