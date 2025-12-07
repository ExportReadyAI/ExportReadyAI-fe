"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { businessProfileService, educationalService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { EducationalModulesAccordion } from "@/components/educational/EducationalModulesAccordion"
import type { EducationalModule } from "@/lib/api/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Package,
  ArrowRight,
  Users,
  AlertCircle,
  Rocket,
  BookMarked,
  TrendingUp,
  ShoppingBag,
  GraduationCap,
  Sparkles,
  Plus,
} from "lucide-react"
import type { DashboardSummaryUMKM, DashboardSummaryAdmin } from "@/lib/api/types"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin } = useAuthStore()
  const [summary, setSummary] = useState<DashboardSummaryUMKM | DashboardSummaryAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modules, setModules] = useState<EducationalModule[]>([])
  const [loadingModules, setLoadingModules] = useState(true)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    if (!isAuthenticated || !token) {
      router.push("/login")
      return
    }

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

      let modulesData: EducationalModule[] = []
      if (Array.isArray(response)) {
        modulesData = response
      } else if ((response as any).success && (response as any).data) {
        modulesData = (response as any).data
      } else if ((response as any).results) {
        modulesData = (response as any).results
      }

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

          {/* UMKM: Business Profile Warning */}
          {!isAdmin() && umkmSummary && !umkmSummary.has_business_profile && (
            <div className="mb-6 bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-3xl p-6 shadow-[0_4px_0_0_#d97706]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F59E0B] shadow-[0_3px_0_0_#d97706]">
                  <AlertCircle className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-extrabold text-[#92400e]">
                    Lengkapi Profil Bisnis Anda!
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
            </div>
          )}

          {/* Stats Cards */}
          {isAdmin() ? (
            // ===== ADMIN DASHBOARD =====
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Users */}
              <div className="bg-white rounded-2xl border-2 border-[#bae6fd] p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0284C7]">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#0C4A6E]">{adminSummary?.users?.total ?? 0}</p>
                    <p className="text-sm text-[#7DD3FC] font-medium">Total Users</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-[#F0F9FF] rounded-lg text-[#0284C7] font-medium">
                    {adminSummary?.users?.umkm ?? 0} UMKM
                  </span>
                  <span className="px-2 py-1 bg-[#F0F9FF] rounded-lg text-[#0284C7] font-medium">
                    {adminSummary?.users?.buyers ?? 0} Buyers
                  </span>
                </div>
              </div>

              {/* Products */}
              <div className="bg-white rounded-2xl border-2 border-[#bbf7d0] p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#0C4A6E]">{adminSummary?.products?.total ?? 0}</p>
                    <p className="text-sm text-[#7DD3FC] font-medium">Total Produk</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-[#f0fdf4] rounded-lg text-[#22C55E] font-medium">
                    {adminSummary?.products?.with_enrichment ?? 0} AI Enriched
                  </span>
                </div>
              </div>

              {/* Catalogs */}
              <div className="bg-white rounded-2xl border-2 border-[#ddd6fe] p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B5CF6]">
                    <BookMarked className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#0C4A6E]">{adminSummary?.catalogs?.total ?? 0}</p>
                    <p className="text-sm text-[#7DD3FC] font-medium">Total Katalog</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-[#f5f3ff] rounded-lg text-[#8B5CF6] font-medium">
                    {adminSummary?.catalogs?.published ?? 0} Published
                  </span>
                  <span className="px-2 py-1 bg-[#fef3c7] rounded-lg text-[#F59E0B] font-medium">
                    {adminSummary?.catalogs?.draft ?? 0} Draft
                  </span>
                </div>
              </div>

              {/* Educational Materials - Admin Focus */}
              <div className="bg-white rounded-2xl border-2 border-[#fbcfe8] p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EC4899]">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#0C4A6E]">{modules.length}</p>
                    <p className="text-sm text-[#7DD3FC] font-medium">Modul Edukasi</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/educational")}
                  className="text-xs px-3 py-1.5 bg-[#fdf2f8] rounded-lg text-[#EC4899] font-bold hover:bg-[#fce7f3] transition-colors"
                >
                  Kelola Materi →
                </button>
              </div>
            </div>
          ) : (
            // ===== UMKM DASHBOARD =====
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Products */}
              <div className="bg-white rounded-2xl border-2 border-[#bae6fd] p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0284C7]">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#0C4A6E]">{umkmSummary?.products?.total ?? 0}</p>
                    <p className="text-sm text-[#7DD3FC] font-medium">Produk Saya</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/products")}
                  className="text-xs px-3 py-1.5 bg-[#F0F9FF] rounded-lg text-[#0284C7] font-bold hover:bg-[#e0f2fe] transition-colors"
                >
                  Lihat Produk →
                </button>
              </div>

              {/* Catalogs */}
              <div className="bg-white rounded-2xl border-2 border-[#ddd6fe] p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B5CF6]">
                    <BookMarked className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#0C4A6E]">{umkmSummary?.catalogs?.total ?? 0}</p>
                    <p className="text-sm text-[#7DD3FC] font-medium">Katalog Saya</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-[#f5f3ff] rounded-lg text-[#8B5CF6] font-medium">
                    {umkmSummary?.catalogs?.published ?? 0} Published
                  </span>
                  <span className="px-2 py-1 bg-[#fef3c7] rounded-lg text-[#F59E0B] font-medium">
                    {umkmSummary?.catalogs?.draft ?? 0} Draft
                  </span>
                </div>
              </div>

              {/* Materi Edukasi */}
              <div className="bg-white rounded-2xl border-2 border-[#bbf7d0] p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#0C4A6E]">{modules.length}</p>
                    <p className="text-sm text-[#7DD3FC] font-medium">Materi Edukasi</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/educational")}
                  className="text-xs px-3 py-1.5 bg-[#f0fdf4] rounded-lg text-[#22C55E] font-bold hover:bg-[#dcfce7] transition-colors"
                >
                  Lihat Materi →
                </button>
              </div>

              {/* Buyer Requests */}
              <div className="bg-white rounded-2xl border-2 border-[#fde68a] p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#0C4A6E]">{umkmSummary?.buyer_requests?.pending ?? 0}</p>
                    <p className="text-sm text-[#7DD3FC] font-medium">Request Terbuka</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-[#fef3c7] rounded-lg text-[#F59E0B] font-medium">
                    {umkmSummary?.buyer_requests?.total ?? 0} Total
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-6 mb-8">
            <h2 className="text-lg font-bold text-[#0C4A6E] mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {isAdmin() ? (
                <>
                  <button
                    onClick={() => router.push("/users")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#F0F9FF] hover:bg-[#e0f2fe] transition-colors text-left"
                  >
                    <Users className="h-5 w-5 text-[#0284C7]" />
                    <span className="font-medium text-[#0C4A6E] text-sm">Kelola Users</span>
                  </button>
                  <button
                    onClick={() => router.push("/products")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#f0fdf4] hover:bg-[#dcfce7] transition-colors text-left"
                  >
                    <Package className="h-5 w-5 text-[#22C55E]" />
                    <span className="font-medium text-[#0C4A6E] text-sm">Lihat Produk</span>
                  </button>
                  <button
                    onClick={() => router.push("/educational")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#fdf2f8] hover:bg-[#fce7f3] transition-colors text-left"
                  >
                    <GraduationCap className="h-5 w-5 text-[#EC4899]" />
                    <span className="font-medium text-[#0C4A6E] text-sm">Kelola Materi</span>
                  </button>
                  <button
                    onClick={() => router.push("/buyer-requests")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] transition-colors text-left"
                  >
                    <ShoppingBag className="h-5 w-5 text-[#F59E0B]" />
                    <span className="font-medium text-[#0C4A6E] text-sm">Buyer Requests</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/products/create")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#F0F9FF] hover:bg-[#e0f2fe] transition-colors text-left"
                  >
                    <Plus className="h-5 w-5 text-[#0284C7]" />
                    <span className="font-medium text-[#0C4A6E] text-sm">Tambah Produk</span>
                  </button>
                  <button
                    onClick={() => router.push("/catalogs/create")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#f5f3ff] hover:bg-[#ede9fe] transition-colors text-left"
                  >
                    <BookMarked className="h-5 w-5 text-[#8B5CF6]" />
                    <span className="font-medium text-[#0C4A6E] text-sm">Buat Katalog</span>
                  </button>
                  <button
                    onClick={() => router.push("/marketing")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#fdf2f8] hover:bg-[#fce7f3] transition-colors text-left"
                  >
                    <TrendingUp className="h-5 w-5 text-[#EC4899]" />
                    <span className="font-medium text-[#0C4A6E] text-sm">Marketing AI</span>
                  </button>
                  <button
                    onClick={() => router.push("/buyer-requests")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] transition-colors text-left"
                  >
                    <ShoppingBag className="h-5 w-5 text-[#F59E0B]" />
                    <span className="font-medium text-[#0C4A6E] text-sm">Buyer Requests</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Educational Materials Section */}
          {modules.length > 0 && (
            <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0284C7]">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0C4A6E]">Materi Edukasi</h2>
                    <p className="text-xs text-[#7DD3FC]">Pelajari panduan ekspor</p>
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
