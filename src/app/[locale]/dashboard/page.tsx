"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { businessProfileService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  FileText, 
  Calculator, 
  Building2, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  AlertCircle,
  Rocket
} from "lucide-react"
import type { DashboardSummaryUMKM, DashboardSummaryAdmin } from "@/lib/api/types"

interface StatCardProps {
  title: string
  value: number | string
  subtitle: string
  icon: React.ReactNode
  color: string
  shadowColor: string
  iconBg: string
}

function StatCard({ title, value, subtitle, icon, color, shadowColor, iconBg }: StatCardProps) {
  return (
    <div 
      className="bg-white rounded-3xl border-2 p-6 transition-all duration-200 hover:-translate-y-1 cursor-default"
      style={{ 
        borderColor: color,
        boxShadow: `0 6px 0 0 ${shadowColor}`
      }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-bold text-[#7DD3FC] uppercase tracking-wider">
            {title}
          </p>
          <p 
            className="text-4xl font-extrabold"
            style={{ color }}
          >
            {value}
          </p>
          <p className="text-sm font-medium text-[#0C4A6E]/70">
            {subtitle}
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
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin } = useAuthStore()
  const [summary, setSummary] = useState<DashboardSummaryUMKM | DashboardSummaryAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {isAdmin() ? (
              <>
                <StatCard
                  title="Total Users"
                  value={adminSummary?.total_users ?? 0}
                  subtitle="Pengguna terdaftar"
                  icon={<Users className="h-7 w-7 text-white" />}
                  color="#0284C7"
                  shadowColor="#bae6fd"
                  iconBg="#0284C7"
                />
                <StatCard
                  title="Total Products"
                  value={adminSummary?.total_products ?? 0}
                  subtitle="Produk terdaftar"
                  icon={<Package className="h-7 w-7 text-white" />}
                  color="#22C55E"
                  shadowColor="#bbf7d0"
                  iconBg="#22C55E"
                />
                <StatCard
                  title="Total Analysis"
                  value={adminSummary?.total_analysis ?? 0}
                  subtitle="Analisis ekspor"
                  icon={<TrendingUp className="h-7 w-7 text-white" />}
                  color="#F59E0B"
                  shadowColor="#fde68a"
                  iconBg="#F59E0B"
                />
              </>
            ) : (
              <>
                <StatCard
                  title="Jumlah Produk"
                  value={umkmSummary?.product_count ?? 0}
                  subtitle="Produk terdaftar"
                  icon={<Package className="h-7 w-7 text-white" />}
                  color="#0284C7"
                  shadowColor="#bae6fd"
                  iconBg="#0284C7"
                />
                <StatCard
                  title="Jumlah Analisis"
                  value={umkmSummary?.analysis_count ?? 0}
                  subtitle="Analisis ekspor"
                  icon={<FileText className="h-7 w-7 text-white" />}
                  color="#22C55E"
                  shadowColor="#bbf7d0"
                  iconBg="#22C55E"
                />
                <StatCard
                  title="Jumlah Costing"
                  value={umkmSummary?.costing_count ?? 0}
                  subtitle="Perhitungan biaya"
                  icon={<Calculator className="h-7 w-7 text-white" />}
                  color="#F59E0B"
                  shadowColor="#fde68a"
                  iconBg="#F59E0B"
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
                onClick={() => router.push("/business-profile")}
                className="flex items-center gap-3 p-4 rounded-2xl border-2 border-[#7DD3FC] bg-[#F0F9FF] hover:bg-[#e0f2fe] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#bae6fd] text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E]">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-[#0C4A6E]">Profil Bisnis</p>
                  <p className="text-xs text-[#7DD3FC]">Kelola profil usaha</p>
                </div>
              </button>

              <button 
                onClick={() => router.push("/products")}
                className="flex items-center gap-3 p-4 rounded-2xl border-2 border-[#7DD3FC] bg-[#F0F9FF] hover:bg-[#e0f2fe] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#bae6fd] text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-[#0C4A6E]">AI Enrichment</p>
                  <p className="text-xs text-[#7DD3FC]">Analisis produk AI</p>
                </div>
              </button>

              <button 
                onClick={() => router.push("/products")}
                className="flex items-center gap-3 p-4 rounded-2xl border-2 border-[#7DD3FC] bg-[#F0F9FF] hover:bg-[#e0f2fe] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#bae6fd] text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6]">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-[#0C4A6E]">Daftar Produk</p>
                  <p className="text-xs text-[#7DD3FC]">Lihat semua produk</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
