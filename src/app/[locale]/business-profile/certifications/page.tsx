"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { businessProfileService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Award, ArrowLeft, Check, Rocket } from "lucide-react"
import type { BusinessProfile, Certification } from "@/lib/api/types"

const CERTIFICATION_OPTIONS: { value: Certification; label: string; description: string }[] = [
  { value: "Halal", label: "Halal", description: "Sertifikasi produk halal dari MUI" },
  { value: "ISO", label: "ISO", description: "Standar manajemen mutu internasional" },
  { value: "HACCP", label: "HACCP", description: "Keamanan pangan berbasis risiko" },
  { value: "SVLK", label: "SVLK", description: "Legalitas kayu untuk produk kehutanan" },
]

export default function ManageCertificationsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [selectedCerts, setSelectedCerts] = useState<Certification[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

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
        const profileData = Array.isArray(response.data)
          ? response.data[0]
          : (response.data as BusinessProfile)
        
        if (profileData) {
          setProfile(profileData)
          setSelectedCerts(profileData.certifications || [])
        }
      }
    } catch (err: any) {
      setError("Gagal memuat profil bisnis")
    } finally {
      setLoading(false)
    }
  }

  const toggleCertification = (cert: Certification) => {
    setSelectedCerts((prev) =>
      prev.includes(cert)
        ? prev.filter((c) => c !== cert)
        : [...prev, cert]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!profile) {
      return
    }

    setSubmitting(true)

    try {
      const response = await businessProfileService.updateCertifications(
        profile.id,
        { certifications: selectedCerts }
      )

      if (response.success) {
        setSuccess(true)
        setProfile(response.data)
        setTimeout(() => {
          router.push("/business-profile")
        }, 1500)
      } else {
        setError(response.message || "Gagal mengupdate sertifikasi")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Terjadi kesalahan saat mengupdate sertifikasi"
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F9FF]">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#F59E0B] shadow-[0_6px_0_0_#d97706] animate-bounce">
            <Award className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-bold text-[#0C4A6E]">Memuat sertifikasi...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    router.push("/business-profile/create")
    return null
  }

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8 max-w-2xl">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#0284C7] hover:text-[#0369a1] font-bold mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Kembali
            </button>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F59E0B] shadow-[0_4px_0_0_#d97706]">
                <Award className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Kelola Sertifikasi
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Pilih sertifikasi yang dimiliki
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-8 shadow-[0_6px_0_0_#e0f2fe]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert variant="success">
                  <AlertDescription>
                    ✅ Sertifikasi berhasil diupdate! Mengalihkan...
                  </AlertDescription>
                </Alert>
              )}

              {/* Certification Options */}
              <div className="space-y-3">
                {CERTIFICATION_OPTIONS.map((cert) => {
                  const isSelected = selectedCerts.includes(cert.value)
                  return (
                    <button
                      key={cert.value}
                      type="button"
                      onClick={() => toggleCertification(cert.value)}
                      disabled={submitting}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        isSelected
                          ? "border-[#22C55E] bg-[#f0fdf4] shadow-[0_4px_0_0_#bbf7d0]"
                          : "border-[#e0f2fe] bg-white hover:border-[#7DD3FC] hover:bg-[#F0F9FF]"
                      }`}
                    >
                      <div 
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                          isSelected 
                            ? "bg-[#22C55E] shadow-[0_3px_0_0_#16a34a]" 
                            : "bg-[#F0F9FF] border-2 border-[#e0f2fe]"
                        }`}
                      >
                        {isSelected ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <Award className={`h-5 w-5 ${isSelected ? "text-white" : "text-[#7DD3FC]"}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${isSelected ? "text-[#166534]" : "text-[#0C4A6E]"}`}>
                          {cert.label}
                        </p>
                        <p className={`text-sm ${isSelected ? "text-[#22C55E]" : "text-[#7DD3FC]"}`}>
                          {cert.description}
                        </p>
                      </div>
                      {isSelected && (
                        <Badge variant="success">Aktif</Badge>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Selected Summary */}
              {selectedCerts.length > 0 && (
                <div className="bg-[#F0F9FF] rounded-2xl p-4">
                  <p className="text-sm font-bold text-[#0284C7] mb-3">
                    📋 {selectedCerts.length} sertifikasi dipilih:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCerts.map((cert) => (
                      <Badge key={cert} variant="success" className="text-sm">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.back()}
                  disabled={submitting}
                  className="flex-1 sm:flex-none"
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  variant="accent"
                  size="lg"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Rocket className="h-5 w-5" />
                      <span>Simpan Perubahan</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
