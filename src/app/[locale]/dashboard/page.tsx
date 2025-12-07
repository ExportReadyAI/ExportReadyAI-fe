"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { businessProfileService, educationalService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { EducationalModulesAccordion } from "@/components/educational/EducationalModulesAccordion"
import type { EducationalModule } from "@/lib/api/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Package,
  FileText,
  Building2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  AlertCircle,
  Rocket,
  BookMarked,
  Globe,
  DollarSign,
  ShoppingBag,
  Award,
  BarChart3,
  Truck
} from "lucide-react"
import type { DashboardSummaryUMKM, DashboardSummaryAdmin } from "@/lib/api/types"

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  shadowColor: string
  iconBg: string
  subStats?: { label: string; value: number | string; highlight?: boolean }[]
}

function StatCard({ title, value, icon, color, shadowColor, iconBg, subStats }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-3xl border-2 p-6 transition-all duration-200 hover:-translate-y-1 cursor-default"
      style={{
        borderColor: color,
        boxShadow: `0 6px 0 0 ${shadowColor}`
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <p className="text-sm font-bold text-[#7DD3FC] uppercase tracking-wider">
            {title}
          </p>
          <p
            className="text-4xl font-extrabold"
            style={{ color }}
          >
            {value}
          </p>
        </div>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: iconBg,
            boxShadow: `0 4px 0 0 ${shadowColor}`
          }}
        >
          {icon}
        </div>
      </div>
      {subStats && subStats.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#e0f2fe]">
          {subStats.map((stat, idx) => (
            <div key={idx} className="text-center p-2 bg-[#F0F9FF] rounded-xl">
              <p className="text-xs text-[#7DD3FC] font-medium">{stat.label}</p>
              <p className={`text-lg font-bold ${stat.highlight ? 'text-[#22C55E]' : 'text-[#0C4A6E]'}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin } = useAuthStore()
  const [summary, setSummary] = useState<DashboardSummaryUMKM | DashboardSummaryAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modules, setModules] = useState<EducationalModule[]>([])
  const [loadingModules, setLoadingModules] = useState(true)

  useEffect(() => {
    // Check both Zustand state and localStorage for token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (!isAuthenticated || !token) {
      console.log("Not authenticated or no token, redirecting to login") // Debug
      router.push("/login")
      return
    }

    console.log("Fetching dashboard summary with token:", token.substring(0, 20) + "...") // Debug
    fetchDashboardSummary()
    fetchEducationalModules()
  }, [isAuthenticated, router])

  const fetchDashboardSummary = async () => {
    try {
      setLoading(true)
      const response = await businessProfileService.getDashboardSummary()
      
      if (response.success && response.data) {
        setSummary(response.data)
      } else {
        setError("Gagal memuat data dashboard")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const fetchEducationalModules = async () => {
    try {
      setLoadingModules(true)
      const response = await educationalService.modules.list({ limit: 3 })
      
      // Handle different response formats
      let modulesData: EducationalModule[] = []
      if (Array.isArray(response)) {
        modulesData = response
      } else if ((response as any).success && (response as any).data) {
        modulesData = (response as any).data
      } else if ((response as any).results) {
        modulesData = (response as any).results
      }
      
      // Sort by order_index
      modulesData.sort((a, b) => a.order_index - b.order_index)
      setModules(modulesData)
    } catch (err: any) {
      console.error("Error fetching educational modules:", err)
    } finally {
      setLoadingModules(false)
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F9FF]">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#0284C7] shadow-[0_6px_0_0_#065985] animate-bounce">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-bold text-[#0C4A6E]">Memuat...</p>
        </div>
      </div>
    )
  }

  const umkmSummary = summary as DashboardSummaryUMKM
  const adminSummary = summary as DashboardSummaryAdmin

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8 bg-gradient-to-r from-[#0284C7] to-[#0369a1] rounded-3xl p-8 shadow-[0_6px_0_0_#064e7a] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-[#F59E0B]/20 rounded-full translate-y-1/2" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">👋</span>
                  <h1 className="text-3xl font-extrabold text-white">
                    Selamat datang, {user?.full_name}!
                  </h1>
                </div>
                <p className="text-[#7DD3FC] font-medium text-lg">
                  Dashboard ExportReady.AI - {isAdmin() ? "Administrator" : "UMKM"}
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                <Sparkles className="h-5 w-5 text-[#F59E0B]" />
                <span className="text-white font-bold">AI Powered</span>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isAdmin() && umkmSummary && !umkmSummary.has_business_profile && (
            <div className="mb-6 bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-3xl p-6 shadow-[0_4px_0_0_#d97706]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F59E0B] shadow-[0_3px_0_0_#d97706]">
                  <AlertCircle className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-extrabold text-[#92400e]">
                    Lengkapi Profil Bisnis Anda! 📝
                  </h3>
                  <p className="text-[#92400e]/80 font-medium">
                    Profil bisnis diperlukan untuk mengakses semua fitur ekspor.
                  </p>
                </div>
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => router.push("/business-profile/create")}
                  className="hidden sm:flex"
                >
                  Lengkapi Profil
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              <Button
                variant="accent"
                className="w-full mt-4 sm:hidden"
                onClick={() => router.push("/business-profile/create")}
              >
                Lengkapi Profil
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {isAdmin() ? (
              <>
                {/* Users Card */}
                <StatCard
                  title="Total Users"
                  value={adminSummary?.users?.total ?? 0}
                  icon={<Users className="h-7 w-7 text-white" />}
                  color="#0284C7"
                  shadowColor="#bae6fd"
                  iconBg="#0284C7"
                  subStats={[
                    { label: "UMKM", value: adminSummary?.users?.umkm ?? 0 },
                    { label: "Buyers", value: adminSummary?.users?.buyers ?? 0 },
                    { label: "Forwarders", value: adminSummary?.users?.forwarders ?? 0 },
                    { label: "Profiles", value: adminSummary?.business_profiles?.total ?? 0 },
                  ]}
                />
                {/* Products Card */}
                <StatCard
                  title="Total Produk"
                  value={adminSummary?.products?.total ?? 0}
                  icon={<Package className="h-7 w-7 text-white" />}
                  color="#22C55E"
                  shadowColor="#bbf7d0"
                  iconBg="#22C55E"
                  subStats={[
                    { label: "AI Enriched", value: adminSummary?.products?.with_enrichment ?? 0, highlight: true },
                    { label: "Market Intel", value: adminSummary?.products?.with_market_intelligence ?? 0 },
                    { label: "Pricing", value: adminSummary?.products?.with_pricing ?? 0 },
                  ]}
                />
                {/* Catalogs Card */}
                <StatCard
                  title="Total Katalog"
                  value={adminSummary?.catalogs?.total ?? 0}
                  icon={<BookMarked className="h-7 w-7 text-white" />}
                  color="#8B5CF6"
                  shadowColor="#ddd6fe"
                  iconBg="#8B5CF6"
                  subStats={[
                    { label: "Published", value: adminSummary?.catalogs?.published ?? 0, highlight: true },
                    { label: "Draft", value: adminSummary?.catalogs?.draft ?? 0 },
                  ]}
                />
                {/* Buyer Requests Card */}
                <StatCard
                  title="Buyer Requests"
                  value={adminSummary?.buyer_requests?.total ?? 0}
                  icon={<ShoppingBag className="h-7 w-7 text-white" />}
                  color="#F59E0B"
                  shadowColor="#fde68a"
                  iconBg="#F59E0B"
                />
              </>
            ) : (
              <>
                {/* Products Card */}
                <StatCard
                  title="Produk Saya"
                  value={umkmSummary?.products?.total ?? 0}
                  icon={<Package className="h-7 w-7 text-white" />}
                  color="#0284C7"
                  shadowColor="#bae6fd"
                  iconBg="#0284C7"
                  subStats={[
                    { label: "AI Enriched", value: umkmSummary?.products?.with_enrichment ?? 0, highlight: true },
                    { label: "Market Intel", value: umkmSummary?.products?.with_market_intelligence ?? 0 },
                    { label: "Pricing", value: umkmSummary?.products?.with_pricing ?? 0 },
                  ]}
                />
                {/* Catalogs Card */}
                <StatCard
                  title="Katalog Saya"
                  value={umkmSummary?.catalogs?.total ?? 0}
                  icon={<BookMarked className="h-7 w-7 text-white" />}
                  color="#8B5CF6"
                  shadowColor="#ddd6fe"
                  iconBg="#8B5CF6"
                  subStats={[
                    { label: "Published", value: umkmSummary?.catalogs?.published ?? 0, highlight: true },
                    { label: "Draft", value: umkmSummary?.catalogs?.draft ?? 0 },
                  ]}
                />
                {/* Business Profile Card */}
                <StatCard
                  title="Profil Bisnis"
                  value={umkmSummary?.business_profile?.certification_count ?? 0}
                  icon={<Award className="h-7 w-7 text-white" />}
                  color="#22C55E"
                  shadowColor="#bbf7d0"
                  iconBg="#22C55E"
                  subStats={[
                    { label: "Sertifikasi", value: umkmSummary?.business_profile?.certification_count ?? 0, highlight: true },
                  ]}
                />
                {/* Buyer Requests Card */}
                <StatCard
                  title="Buyer Requests"
                  value={umkmSummary?.buyer_requests?.pending ?? 0}
                  icon={<ShoppingBag className="h-7 w-7 text-white" />}
                  color="#F59E0B"
                  shadowColor="#fde68a"
                  iconBg="#F59E0B"
                  subStats={[
                    { label: "Total", value: umkmSummary?.buyer_requests?.total ?? 0 },
                    { label: "Open", value: umkmSummary?.buyer_requests?.pending ?? 0, highlight: true },
                  ]}
                />
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_6px_0_0_#e0f2fe]">
            <h2 className="text-xl font-extrabold text-[#0C4A6E] mb-4">
              Aksi Cepat 🚀
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {isAdmin() ? (
                <>
                  <button
                    onClick={() => router.push("/users")}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 border-[#7DD3FC] bg-[#F0F9FF] hover:bg-[#e0f2fe] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#bae6fd] text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0284C7]">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0C4A6E]">Kelola Users</p>
                      <p className="text-xs text-[#7DD3FC]">Lihat semua pengguna</p>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push("/products")}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 border-[#7DD3FC] bg-[#F0F9FF] hover:bg-[#e0f2fe] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#bae6fd] text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E]">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0C4A6E]">Lihat Produk</p>
                      <p className="text-xs text-[#7DD3FC]">Semua produk UMKM</p>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push("/catalogs")}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 border-[#7DD3FC] bg-[#F0F9FF] hover:bg-[#e0f2fe] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#bae6fd] text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6]">
                      <BookMarked className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0C4A6E]">Lihat Katalog</p>
                      <p className="text-xs text-[#7DD3FC]">Semua katalog ekspor</p>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push("/buyer-requests")}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 border-[#7DD3FC] bg-[#F0F9FF] hover:bg-[#e0f2fe] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#bae6fd] text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]">
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0C4A6E]">Buyer Requests</p>
                      <p className="text-xs text-[#7DD3FC]">Lihat semua request</p>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/products/create")}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 border-[#7DD3FC] bg-[#F0F9FF] hover:bg-[#e0f2fe] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#bae6fd] text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0284C7]">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0C4A6E]">Tambah Produk</p>
                      <p className="text-xs text-[#7DD3FC]">Daftarkan produk baru</p>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push("/catalogs/create")}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 border-[#7DD3FC] bg-[#F0F9FF] hover:bg-[#e0f2fe] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#bae6fd] text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6]">
                      <BookMarked className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0C4A6E]">Buat Katalog</p>
                      <p className="text-xs text-[#7DD3FC]">Katalog ekspor baru</p>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push("/marketing")}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 border-[#7DD3FC] bg-[#F0F9FF] hover:bg-[#e0f2fe] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#bae6fd] text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EC4899]">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0C4A6E]">Marketing AI</p>
                      <p className="text-xs text-[#7DD3FC]">Insight pasar & harga</p>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push("/buyer-requests")}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 border-[#7DD3FC] bg-[#F0F9FF] hover:bg-[#e0f2fe] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#bae6fd] text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]">
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0C4A6E]">Buyer Requests</p>
                      <p className="text-xs text-[#7DD3FC]">Lihat permintaan buyer</p>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Educational Materials Section */}
          {modules.length > 0 && (
            <div className="mt-8 bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_6px_0_0_#bae6fd]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0369a1] shadow-[0_4px_0_0_#065985]">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#0C4A6E]">
                      Materi Edukasi 📚
                    </h2>
                    <p className="text-sm text-[#7DD3FC]">
                      Pelajari panduan ekspor dan tips bisnis
                    </p>
                  </div>
                </div>
              </div>
              
              {loadingModules ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
                  <p className="mt-2 text-sm text-[#7DD3FC]">Memuat materi...</p>
                </div>
              ) : (
                <EducationalModulesAccordion
                  modules={modules}
                  maxModules={3}
                  showViewAll={true}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
