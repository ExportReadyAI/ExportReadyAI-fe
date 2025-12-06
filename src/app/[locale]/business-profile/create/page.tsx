"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { businessProfileService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, ArrowLeft, MapPin, Factory, Calendar, Rocket } from "lucide-react"

export default function CreateBusinessProfilePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [formData, setFormData] = useState({
    company_name: "",
    address: "",
    production_capacity_per_month: "",
    year_established: new Date().getFullYear().toString(),
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const currentYear = new Date().getFullYear()

    if (!formData.company_name.trim()) {
      newErrors.company_name = "Nama perusahaan harus diisi"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Alamat harus diisi"
    }

    if (!formData.production_capacity_per_month) {
      newErrors.production_capacity_per_month =
        "Kapasitas produksi harus diisi"
    } else if (Number(formData.production_capacity_per_month) <= 0) {
      newErrors.production_capacity_per_month =
        "Kapasitas produksi harus lebih dari 0"
    }

    if (!formData.year_established) {
      newErrors.year_established = "Tahun berdiri harus diisi"
    } else {
      const year = Number(formData.year_established)
      if (year > currentYear) {
        newErrors.year_established =
          "Tahun berdiri tidak boleh lebih dari tahun sekarang"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await businessProfileService.create({
        company_name: formData.company_name,
        address: formData.address,
        production_capacity_per_month: Number(
          formData.production_capacity_per_month
        ),
        year_established: Number(formData.year_established),
      })

      if (response.success) {
        router.push("/business-profile")
      } else {
        setError(response.message || "Gagal membuat profil bisnis")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Terjadi kesalahan saat membuat profil bisnis"
      )
    } finally {
      setLoading(false)
    }
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
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#22C55E] shadow-[0_4px_0_0_#16a34a]">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Buat Profil Bisnis
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Lengkapi informasi usaha Anda
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

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company_name" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#0284C7]" />
                  Nama Perusahaan *
                </Label>
                <Input
                  id="company_name"
                  name="company_name"
                  placeholder="Contoh: PT Maju Bersama"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                {errors.company_name && (
                  <p className="text-sm font-medium text-[#EF4444]">
                    {errors.company_name}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#0284C7]" />
                  Alamat Lengkap *
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Jl. Contoh No. 123, Kota, Provinsi"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows={3}
                />
                {errors.address && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.address}</p>
                )}
              </div>

              {/* Production & Year */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="production_capacity_per_month" className="flex items-center gap-2">
                    <Factory className="h-4 w-4 text-[#0284C7]" />
                    Kapasitas Produksi/Bulan *
                  </Label>
                  <Input
                    id="production_capacity_per_month"
                    name="production_capacity_per_month"
                    type="number"
                    min="1"
                    placeholder="1000"
                    value={formData.production_capacity_per_month}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-[#7DD3FC]">Dalam satuan unit</p>
                  {errors.production_capacity_per_month && (
                    <p className="text-sm font-medium text-[#EF4444]">
                      {errors.production_capacity_per_month}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year_established" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#0284C7]" />
                    Tahun Berdiri *
                  </Label>
                  <Input
                    id="year_established"
                    name="year_established"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    placeholder="2020"
                    value={formData.year_established}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  {errors.year_established && (
                    <p className="text-sm font-medium text-[#EF4444]">
                      {errors.year_established}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="flex-1 sm:flex-none"
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  variant="success"
                  size="lg"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Rocket className="h-5 w-5" />
                      <span>Buat Profil</span>
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
