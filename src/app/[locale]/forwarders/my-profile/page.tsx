"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { forwarderService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Truck,
  Edit,
  Star,
  Mail,
  Phone,
  Globe,
  Package,
  MapPin,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Users,
  Award,
} from "lucide-react"
import type { ForwarderProfile } from "@/lib/api/types"

export default function ForwarderMyProfilePage() {
  const router = useRouter()
  const { isAuthenticated, isForwarder } = useAuthStore()
  const [profile, setProfile] = useState<ForwarderProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!isAuthenticated || !isForwarder()) {
      router.push("/login")
      return
    }

    fetchProfile()
  }, [mounted, isAuthenticated, router, isForwarder])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await forwarderService.getMyProfile()
      
      // Handle different response formats
      let profileData: ForwarderProfile | null = null
      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        profileData = (response as any).data
      } else if (response && typeof response === 'object' && 'id' in response) {
        profileData = response as ForwarderProfile
      }

      if (profileData) {
        setProfile(profileData)
      } else {
        setError("Profil forwarder belum dibuat. Silakan buat profil terlebih dahulu.")
      }
    } catch (err: any) {
      // Handle 404 or other errors - profile might not exist yet
      if (err.response?.status === 404) {
        setError("Profil forwarder belum dibuat. Silakan buat profil terlebih dahulu.")
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
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6366F1] shadow-[0_4px_0_0_#4f46e5]">
                    <Truck className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                      Profil Forwarder Saya
                    </h1>
                    <p className="text-[#0284C7] font-medium">
                      Kelola profil forwarder Anda
                    </p>
                  </div>
                </div>
              </div>

              {/* Empty State Card */}
              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_8px_0_0_#e0f2fe] overflow-hidden">
                <div className="bg-gradient-to-br from-[#6366F1] via-[#4f46e5] to-[#4338ca] p-12 text-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F59E0B]/20 rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-6 shadow-[0_8px_0_0_rgba(0,0,0,0.2)]">
                      <Truck className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white mb-3">
                      Mulai Perjalanan Anda! 🚀
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                      Buat profil forwarder Anda sekarang dan mulai terhubung dengan UMKM yang membutuhkan jasa logistik Anda
                    </p>
                    <Button
                      onClick={() => router.push("/forwarders/profile")}
                      size="lg"
                      className="bg-white text-[#6366F1] hover:bg-[#F0F9FF] shadow-[0_6px_0_0_#d1d5db] text-lg font-extrabold px-8 py-6 rounded-2xl"
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
                    <div className="text-center p-6 rounded-2xl bg-[#F0F9FF] border-2 border-[#e0f2fe]">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#6366F1] mb-4 shadow-[0_4px_0_0_#4f46e5]">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-bold text-[#0C4A6E] mb-2">Temukan Klien Baru</h4>
                      <p className="text-sm text-gray-600">
                        UMKM dapat menemukan dan menghubungi Anda berdasarkan spesialisasi route dan layanan
                      </p>
                    </div>

                    <div className="text-center p-6 rounded-2xl bg-[#F0F9FF] border-2 border-[#e0f2fe]">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B] mb-4 shadow-[0_4px_0_0_#d97706]">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-bold text-[#0C4A6E] mb-2">Bangun Reputasi</h4>
                      <p className="text-sm text-gray-600">
                        Dapatkan review dan rating dari klien untuk membangun kepercayaan
                      </p>
                    </div>

                    <div className="text-center p-6 rounded-2xl bg-[#F0F9FF] border-2 border-[#e0f2fe]">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E] mb-4 shadow-[0_4px_0_0_#16a34a]">
                        <Rocket className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-bold text-[#0C4A6E] mb-2">Tingkatkan Bisnis</h4>
                      <p className="text-sm text-gray-600">
                        Terhubung dengan lebih banyak peluang ekspor dan perluas jangkauan bisnis Anda
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#F0F9FF] to-[#e0f2fe] rounded-2xl p-6 border-2 border-[#e0f2fe]">
                    <h4 className="font-bold text-[#0C4A6E] mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />
                      Yang Perlu Disiapkan
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                        <span className="text-[#0C4A6E]">Informasi perusahaan (nama, email, telepon, alamat)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                        <span className="text-[#0C4A6E]">Route spesialisasi (origin-destination, contoh: ID-JP, ID-US)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                        <span className="text-[#0C4A6E]">Jenis layanan yang Anda sediakan (Sea Freight, Air Freight, dll)</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Help Text */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Butuh bantuan? <span className="text-[#0284C7] font-bold">Hubungi tim support kami</span>
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
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6366F1] shadow-[0_4px_0_0_#4f46e5]">
                <Truck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Profil Forwarder Saya
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Kelola profil forwarder Anda
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/forwarders/profile")}
              className="rounded-2xl shadow-[0_4px_0_0_#4f46e5]"
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
                    {profile.specialization_routes.length > 0 ? (
                      profile.specialization_routes.map((route, idx) => (
                        <Badge key={idx} className="bg-[#F0F9FF] text-[#0284C7] border border-[#e0f2fe] text-sm py-2 px-4">
                          {route}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">Belum ada routes yang ditambahkan</p>
                    )}
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
                    {profile.service_types.length > 0 ? (
                      profile.service_types.map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm py-2 px-4">
                          {service}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">Belum ada service types yang ditambahkan</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-[#6366F1] to-[#4f46e5] rounded-3xl p-6 shadow-[0_6px_0_0_#4338ca] text-white">
                <h3 className="font-bold text-lg mb-4">Statistik Profil</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-[#F59E0B]" />
                      <span className="text-2xl font-extrabold">
                        {Number(profile.average_rating) > 0 ? Number(profile.average_rating).toFixed(1) : '0.0'}
                      </span>
                    </div>
                    <p className="text-sm opacity-80">
                      Average Rating
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-2xl font-extrabold">
                        {profile.total_reviews}
                      </span>
                    </div>
                    <p className="text-sm opacity-80">
                      Total Reviews
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
                      onClick={() => router.push(`/forwarders/${profile.id}`)}
                    >
                      Lihat Profil Publik
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl"
                      onClick={() => router.push("/forwarders/profile")}
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

