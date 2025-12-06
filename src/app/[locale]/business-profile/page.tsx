"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { businessProfileService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Building2, 
  Edit, 
  Award, 
  Trash2, 
  MapPin, 
  Factory, 
  Calendar,
  Plus,
  Rocket
} from "lucide-react"
import { DeleteAccountModal } from "@/components/shared/DeleteAccountModal"
import { userService } from "@/lib/api/services"
import type { BusinessProfile } from "@/lib/api/types"

export default function BusinessProfilePage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const { user, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    fetchProfile()
  }, [isAuthenticated, router])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await businessProfileService.list()
      
      if (response.success) {
        if (Array.isArray(response.data)) {
          // Admin sees all profiles
          if (response.data.length > 0) {
            setProfile(response.data[0]) // For now, show first one
          }
        } else {
          // UMKM sees their own profile
          setProfile(response.data as BusinessProfile)
        }
      } else {
        setError("Gagal memuat profil bisnis")
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        // No profile exists yet
        setProfile(null)
      } else {
        setError(err.response?.data?.message || "Terjadi kesalahan")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    try {
      await userService.delete(user.id)
      logout()
      router.push("/login")
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Gagal menghapus akun"
      )
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F9FF]">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#22C55E] shadow-[0_6px_0_0_#16a34a] animate-bounce">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-bold text-[#0C4A6E]">Memuat profil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex h-screen bg-[#F0F9FF]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8">
            {/* Empty State */}
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-12 shadow-[0_6px_0_0_#e0f2fe]">
                <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-3xl bg-[#F0F9FF] mb-6">
                  <Building2 className="h-12 w-12 text-[#7DD3FC]" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#0C4A6E] mb-2">
                  Belum Ada Profil Bisnis 🏢
                </h2>
                <p className="text-[#0284C7] font-medium mb-6">
                  Buat profil bisnis Anda untuk melengkapi data usaha dan mengakses fitur ekspor.
                </p>
                <Button 
                  size="lg"
                  onClick={() => router.push("/business-profile/create")}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Buat Profil Bisnis
                </Button>
              </div>
            </div>
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
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#22C55E] shadow-[0_4px_0_0_#16a34a]">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Profil Bisnis
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Informasi perusahaan Anda
                </p>
              </div>
            </div>
            {!isAdmin() && (
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline"
                  onClick={() => router.push("/business-profile/edit")}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profil
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus Akun
                </Button>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Company Info Card */}
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] overflow-hidden shadow-[0_6px_0_0_#e0f2fe]">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#22C55E] to-[#16a34a] p-6 shadow-[0_4px_0_0_#15803d]">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Factory className="h-6 w-6" />
                  Informasi Perusahaan
                </h2>
              </div>
              
              {/* Card Content */}
              <div className="p-6 space-y-5">
                <div className="bg-[#F0F9FF] rounded-2xl p-4">
                  <p className="text-xs font-bold text-[#7DD3FC] uppercase mb-1">
                    Nama Perusahaan
                  </p>
                  <p className="text-xl font-extrabold text-[#0C4A6E]">
                    {profile.company_name}
                  </p>
                </div>

                <div className="bg-[#F0F9FF] rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#0284C7] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#7DD3FC] uppercase mb-1">
                        Alamat
                      </p>
                      <p className="font-medium text-[#0C4A6E]">{profile.address}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F0F9FF] rounded-2xl p-4 text-center">
                    <Factory className="h-6 w-6 text-[#F59E0B] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#7DD3FC] uppercase mb-1">
                      Kapasitas/Bulan
                    </p>
                    <p className="text-2xl font-extrabold text-[#0C4A6E]">
                      {profile.production_capacity_per_month}
                    </p>
                    <p className="text-xs text-[#7DD3FC]">unit</p>
                  </div>
                  <div className="bg-[#F0F9FF] rounded-2xl p-4 text-center">
                    <Calendar className="h-6 w-6 text-[#0284C7] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#7DD3FC] uppercase mb-1">
                      Tahun Berdiri
                    </p>
                    <p className="text-2xl font-extrabold text-[#0C4A6E]">
                      {profile.year_established}
                    </p>
                    <p className="text-xs text-[#7DD3FC]">
                      {new Date().getFullYear() - profile.year_established} tahun
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications Card */}
            <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] overflow-hidden shadow-[0_6px_0_0_#e0f2fe]">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#F59E0B] to-[#d97706] p-6 shadow-[0_4px_0_0_#b45309]">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Sertifikasi
                </h2>
              </div>
              
              {/* Card Content */}
              <div className="p-6">
                {profile.certifications && profile.certifications.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {profile.certifications.map((cert) => (
                        <Badge 
                          key={cert} 
                          variant="success"
                          className="text-base px-4 py-2"
                        >
                          <Award className="h-4 w-4 mr-2" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-[#0284C7] bg-[#F0F9FF] rounded-xl p-3">
                      ✅ Memiliki {profile.certifications.length} sertifikasi aktif
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#F0F9FF] mb-4">
                      <Award className="h-8 w-8 text-[#7DD3FC]" />
                    </div>
                    <p className="font-bold text-[#0C4A6E] mb-1">
                      Belum Ada Sertifikasi
                    </p>
                    <p className="text-sm text-[#7DD3FC] mb-4">
                      Tambahkan sertifikasi untuk meningkatkan kepercayaan
                    </p>
                  </div>
                )}
                
                {!isAdmin() && (
                  <Button
                    variant="accent"
                    className="w-full mt-4"
                    onClick={() => router.push("/business-profile/certifications")}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Kelola Sertifikasi
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 bg-gradient-to-r from-[#0284C7] to-[#0369a1] rounded-3xl p-6 shadow-[0_6px_0_0_#064e7a]">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Rocket className="h-8 w-8" />
                <div>
                  <p className="font-extrabold text-lg">Siap Ekspor?</p>
                  <p className="text-[#7DD3FC]">Mulai analisis produk Anda dengan AI</p>
                </div>
              </div>
              <Button 
                variant="secondary"
                onClick={() => router.push("/products")}
              >
                Lihat Produk
              </Button>
            </div>
          </div>

          <DeleteAccountModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onConfirm={handleDeleteAccount}
            userEmail={user?.email}
          />
        </div>
      </main>
    </div>
  )
}
