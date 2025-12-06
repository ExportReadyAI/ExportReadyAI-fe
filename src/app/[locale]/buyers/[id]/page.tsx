"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { buyerProfileService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  ShoppingCart,
  Mail,
  Phone,
  Globe,
  Package,
  MapPin,
  Building2,
  TrendingUp,
  MessageCircle,
} from "lucide-react"
import type { BuyerProfile } from "@/lib/api/types"
import { WhatsAppDialog } from "@/components/shared/WhatsAppDialog"

export default function BuyerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated } = useAuthStore()
  const [buyer, setBuyer] = useState<BuyerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false)

  const buyerId = params?.id as string

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !buyerId) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token || !isAuthenticated) {
      router.push("/login")
      return
    }

    fetchBuyer()
  }, [mounted, buyerId, router, isAuthenticated])

  const fetchBuyer = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await buyerProfileService.get(buyerId)
      const buyerData = (response as any).success ? (response as any).data : response
      setBuyer(buyerData as BuyerProfile)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Gagal memuat buyer profile")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || !buyerId) {
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

  if (error || !buyer) {
    return (
      <div className="flex h-screen bg-[#F0F9FF]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8">
            <Alert variant="destructive">
              <AlertDescription>{error || "Buyer profile tidak ditemukan"}</AlertDescription>
            </Alert>
            <Button onClick={() => router.push("/buyers")} className="mt-4">
              Kembali ke Daftar Buyer
            </Button>
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
              onClick={() => router.push("/buyers")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC4899] shadow-[0_4px_0_0_#db2777]">
                <ShoppingCart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  {buyer.company_name}
                </h1>
                {buyer.business_type && (
                  <Badge className="bg-[#F0F9FF] text-[#EC4899] border border-[#e0f2fe] mt-2">
                    {buyer.business_type}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Info */}
              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
                <CardHeader>
                  <CardTitle className="text-2xl font-extrabold text-[#0C4A6E] flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-[#EC4899]" />
                    Informasi Perusahaan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {buyer.company_description && (
                    <p className="text-gray-600">{buyer.company_description}</p>
                  )}
                  {buyer.contact_info.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#0284C7]" />
                      <span className="text-[#0C4A6E]">{buyer.contact_info.email}</span>
                    </div>
                  )}
                  {buyer.contact_info.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#0284C7]" />
                      <span className="text-[#0C4A6E]">{buyer.contact_info.phone}</span>
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
                  {buyer.contact_info.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#0284C7] mt-1" />
                      <span className="text-[#0C4A6E]">{buyer.contact_info.address}</span>
                    </div>
                  )}
                  {buyer.contact_info.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#0284C7]" />
                      <a href={buyer.contact_info.website} target="_blank" rel="noopener noreferrer" className="text-[#0284C7] hover:underline">
                        {buyer.contact_info.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preferred Product Categories */}
              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
                <CardHeader>
                  <CardTitle className="text-2xl font-extrabold text-[#0C4A6E] flex items-center gap-2">
                    <Package className="h-6 w-6 text-[#EC4899]" />
                    Preferred Product Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {buyer.preferred_product_categories.map((category, idx) => (
                      <Badge key={idx} className="bg-[#F0F9FF] text-[#EC4899] border border-[#e0f2fe]">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  {buyer.preferred_product_categories_description && (
                    <p className="text-gray-600 text-sm">{buyer.preferred_product_categories_description}</p>
                  )}
                </CardContent>
              </Card>

              {/* Source Countries */}
              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
                <CardHeader>
                  <CardTitle className="text-2xl font-extrabold text-[#0C4A6E] flex items-center gap-2">
                    <Globe className="h-6 w-6 text-[#EC4899]" />
                    Source Countries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {buyer.source_countries.map((country, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {country}
                      </Badge>
                    ))}
                  </div>
                  {buyer.source_countries_description && (
                    <p className="text-gray-600 text-sm">{buyer.source_countries_description}</p>
                  )}
                </CardContent>
              </Card>

              {/* Business Type & Import Volume */}
              {(buyer.business_type_description || buyer.annual_import_volume) && (
                <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extrabold text-[#0C4A6E] flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-[#EC4899]" />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {buyer.business_type_description && (
                      <div>
                        <h4 className="font-bold text-[#0C4A6E] mb-2">Business Type Description</h4>
                        <p className="text-gray-600 text-sm">{buyer.business_type_description}</p>
                      </div>
                    )}
                    {buyer.annual_import_volume && (
                      <div>
                        <h4 className="font-bold text-[#0C4A6E] mb-2">Annual Import Volume</h4>
                        <p className="text-gray-600 text-sm">{buyer.annual_import_volume}</p>
                        {buyer.annual_import_volume_description && (
                          <p className="text-gray-600 text-sm mt-2">{buyer.annual_import_volume_description}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-[#EC4899] to-[#db2777] rounded-3xl p-6 shadow-[0_6px_0_0_#be185d] text-white">
                <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-extrabold mb-1">
                      {buyer.total_requests}
                    </div>
                    <p className="text-sm opacity-80">
                      Active Requests
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* WhatsApp Dialog */}
      {buyer?.contact_info.phone && (
        <WhatsAppDialog
          open={whatsappDialogOpen}
          onOpenChange={setWhatsappDialogOpen}
          phone={buyer.contact_info.phone}
          recipientName={buyer.user_full_name}
          recipientCompany={buyer.company_name}
        />
      )}
    </div>
  )
}

