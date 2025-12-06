"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { buyerProfileService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ShoppingCart,
  Edit,
  Mail,
  Phone,
  Globe,
  Package,
  MapPin,
  Building2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Rocket,
} from "lucide-react"
import type { BuyerProfile } from "@/lib/api/types"

export default function BuyerMyProfilePage() {
  const router = useRouter()
  const { isAuthenticated, isBuyer } = useAuthStore()
  const [profile, setProfile] = useState<BuyerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!isAuthenticated || !isBuyer()) {
      router.push("/login")
      return
    }

    fetchProfile()
  }, [mounted, isAuthenticated, router, isBuyer])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await buyerProfileService.getMyProfile()
      
      let profileData: BuyerProfile | null = null
      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        profileData = (response as any).data
      } else if (response && typeof response === 'object' && 'id' in response) {
        profileData = response as BuyerProfile
      }

      if (profileData) {
        setProfile(profileData)
      } else {
        setError("Profil buyer belum dibuat. Silakan buat profil terlebih dahulu.")
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Profil buyer belum dibuat. Silakan buat profil terlebih dahulu.")
      } else {
        setError(err.response?.data?.message || err.message || "Gagal memuat profil")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F0F9FF]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#0284C7] border-t-transparent"></div>
            <p className="mt-4 text-[#0284C7] font-medium">Memuat profil...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="flex h-screen bg-[#F0F9FF]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC4899] shadow-[0_4px_0_0_#db2777]">
                    <ShoppingCart className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                      Profil Buyer Saya
                    </h1>
                    <p className="text-[#0284C7] font-medium">
                      Kelola profil buyer Anda
                    </p>
                  </div>
                </div>
              </div>

              {/* Empty State Card */}
              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_8px_0_0_#e0f2fe] overflow-hidden">
                <div className="bg-gradient-to-br from-[#EC4899] via-[#db2777] to-[#be185d] p-12 text-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F59E0B]/20 rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-6 shadow-[0_8px_0_0_rgba(0,0,0,0.2)]">
                      <ShoppingCart className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white mb-3">
                      Mulai Perjalanan Import Anda! 🚀
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                      Buat profil buyer Anda sekarang dan temukan produk-produk berkualitas dari UMKM Indonesia yang siap diekspor
                    </p>
                    <Button
                      onClick={() => router.push("/buyers/profile")}
                      size="lg"
                      className="bg-white text-[#EC4899] hover:bg-[#FDF2F8] shadow-[0_6px_0_0_#d1d5db] text-lg font-extrabold px-8 py-6 rounded-2xl"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Buat Profil Sekarang
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-8">
                  <h3 className="text-xl font-extrabold text-[#0C4A6E] mb-6 text-center">
                    Mengapa Membuat Profil?
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 rounded-2xl bg-[#FDF2F8] border-2 border-[#fce7f3]">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#EC4899] mb-4 shadow-[0_4px_0_0_#db2777]">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-bold text-[#0C4A6E] mb-2">Temukan Produk Terbaik</h4>
                      <p className="text-sm text-gray-600">
                        UMKM dapat menemukan Anda dan menawarkan produk yang sesuai dengan kebutuhan import Anda
                      </p>
                    </div>

                    <div className="text-center p-6 rounded-2xl bg-[#FDF2F8] border-2 border-[#fce7f3]">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B] mb-4 shadow-[0_4px_0_0_#d97706]">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-bold text-[#0C4A6E] mb-2">Bangun Jaringan</h4>
                      <p className="text-sm text-gray-600">
                        Terhubung langsung dengan UMKM Indonesia yang memiliki produk sesuai kategori dan standar kualitas Anda
                      </p>
                    </div>

                    <div className="text-center p-6 rounded-2xl bg-[#FDF2F8] border-2 border-[#fce7f3]">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E] mb-4 shadow-[0_4px_0_0_#16a34a]">
                        <Rocket className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-bold text-[#0C4A6E] mb-2">Tingkatkan Bisnis</h4>
                      <p className="text-sm text-gray-600">
                        Dapatkan akses ke katalog produk lengkap dan informasi bisnis untuk memperluas portofolio import Anda
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#FDF2F8] to-[#fce7f3] rounded-2xl p-6 border-2 border-[#fce7f3]">
                    <h4 className="font-bold text-[#0C4A6E] mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />
                      Yang Perlu Disiapkan
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                        <span className="text-[#0C4A6E]">Informasi perusahaan (nama, email, telepon, alamat, website)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                        <span className="text-[#0C4A6E]">Kategori produk yang Anda minati (Makanan Olahan, Kerajinan, Tekstil, dll)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                        <span className="text-[#0C4A6E]">Negara sumber produk (contoh: ID untuk Indonesia)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                        <span className="text-[#0C4A6E]">Tipe bisnis Anda (Importir, Distributor, Retailer, Trading Company)</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Help Text */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Butuh bantuan? <span className="text-[#EC4899] font-bold">Hubungi tim support kami</span>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC4899] shadow-[0_4px_0_0_#db2777]">
                <ShoppingCart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Profil Buyer Saya
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Kelola profil buyer Anda
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/buyers/profile")}
              className="rounded-2xl shadow-[0_4px_0_0_#db2777] bg-[#EC4899] hover:bg-[#db2777]"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profil
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                  <div>
                    <Label className="text-[#0284C7] font-bold text-sm">Nama Perusahaan</Label>
                    <p className="mt-1 text-[#0C4A6E] font-medium text-lg">{profile.company_name}</p>
                  </div>
                  {profile.company_description && (
                    <p className="text-gray-600">{profile.company_description}</p>
                  )}
                  {profile.contact_info.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#0284C7]" />
                      <span className="text-[#0C4A6E]">{profile.contact_info.email}</span>
                    </div>
                  )}
                  {profile.contact_info.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#0284C7]" />
                      <span className="text-[#0C4A6E]">{profile.contact_info.phone}</span>
                    </div>
                  )}
                  {profile.contact_info.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#0284C7] mt-1" />
                      <span className="text-[#0C4A6E]">{profile.contact_info.address}</span>
                    </div>
                  )}
                  {profile.contact_info.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#0284C7]" />
                      <a href={profile.contact_info.website} target="_blank" rel="noopener noreferrer" className="text-[#0284C7] hover:underline">
                        {profile.contact_info.website}
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
                    {profile.preferred_product_categories.length > 0 ? (
                      profile.preferred_product_categories.map((category, idx) => (
                        <Badge key={idx} className="bg-[#FDF2F8] text-[#EC4899] border border-[#fce7f3] text-sm py-2 px-4">
                          {category}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">Belum ada kategori yang ditambahkan</p>
                    )}
                  </div>
                  {profile.preferred_product_categories_description && (
                    <p className="text-gray-600 text-sm">{profile.preferred_product_categories_description}</p>
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
                    {profile.source_countries.length > 0 ? (
                      profile.source_countries.map((country, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm py-2 px-4">
                          {country}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">Belum ada negara yang ditambahkan</p>
                    )}
                  </div>
                  {profile.source_countries_description && (
                    <p className="text-gray-600 text-sm">{profile.source_countries_description}</p>
                  )}
                </CardContent>
              </Card>

              {/* Business Type & Import Volume */}
              {(profile.business_type || profile.annual_import_volume) && (
                <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-extrabold text-[#0C4A6E] flex items-center gap-2">
                      <Building2 className="h-6 w-6 text-[#EC4899]" />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.business_type && (
                      <div>
                        <Label className="text-[#0284C7] font-bold text-sm">Business Type</Label>
                        <p className="mt-1 text-[#0C4A6E] font-medium">{profile.business_type}</p>
                      </div>
                    )}
                    {profile.business_type_description && (
                      <p className="text-gray-600 text-sm">{profile.business_type_description}</p>
                    )}
                    {profile.annual_import_volume && (
                      <div>
                        <Label className="text-[#0284C7] font-bold text-sm">Annual Import Volume</Label>
                        <p className="mt-1 text-[#0C4A6E] font-medium">{profile.annual_import_volume}</p>
                        {profile.annual_import_volume_description && (
                          <p className="text-gray-600 text-sm mt-2">{profile.annual_import_volume_description}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-[#EC4899] to-[#db2777] rounded-3xl p-6 shadow-[0_6px_0_0_#be185d] text-white">
                <h3 className="font-bold text-lg mb-4">Statistik Profil</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-2xl font-extrabold">
                        {profile.total_requests}
                      </span>
                    </div>
                    <p className="text-sm opacity-80">
                      Active Requests
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
                <CardContent className="p-6">
                  <h3 className="font-bold text-[#0C4A6E] mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl"
                      onClick={() => router.push(`/buyers/${profile.id}`)}
                    >
                      Lihat Profil Publik
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl"
                      onClick={() => router.push("/buyers/profile")}
                    >
                      Edit Profil
                    </Button>
                  </div>
                </CardContent>
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

