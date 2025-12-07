"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { forwarderService, countryService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Truck,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Globe,
  Package,
  Building2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ArrowRight,
} from "lucide-react"
import type { CreateForwarderProfileRequest, ForwarderProfile, ForwarderContactInfo, Country } from "@/lib/api/types"

interface RouteRow {
  id: string
  origin: string
  destination: string
}

interface OtherServiceRow {
  id: string
  value: string
}

const PREDEFINED_SERVICE_TYPES = [
  "Sea Freight",
  "Air Freight",
  "Road Freight",
  "Rail Freight",
  "Cold Chain",
  "Express Delivery",
  "Door-to-Door",
  "Warehousing",
  "Customs Clearance",
  "Cargo Insurance",
]

export default function ForwarderProfilePage() {
  const router = useRouter()
  const { isAuthenticated, isForwarder } = useAuthStore()
  const [countries, setCountries] = useState<Country[]>([])
  const [formData, setFormData] = useState<CreateForwarderProfileRequest>({
    company_name: "",
    contact_info: {
      phone: "",
      email: "",
      address: "",
      website: "",
    },
    specialization_routes: [],
    service_types: [],
  })
  const [routeRows, setRouteRows] = useState<RouteRow[]>([{ id: Date.now().toString(), origin: "ID", destination: "" }])
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [otherServiceRows, setOtherServiceRows] = useState<OtherServiceRow[]>([{ id: Date.now().toString(), value: "" }])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [profileId, setProfileId] = useState<number | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (!isAuthenticated || !isForwarder()) {
      router.push("/login")
      return
    }

    fetchCountries()
    checkExistingProfile()
  }, [isAuthenticated, router, isForwarder])

  const fetchCountries = async () => {
    try {
      setLoadingCountries(true)
      // Fetch countries from /api/v1/countries/ endpoint
      const response = await countryService.list()
      
      // Handle response format: { success: true, data: [...] }
      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        const countriesData = (response as any).data || []
        setCountries(countriesData)
      } else if (Array.isArray(response)) {
        // Handle direct array response (fallback)
        setCountries(response)
      } else {
        console.warn("Unexpected countries response format:", response)
        setCountries([])
      }
    } catch (err: any) {
      console.error("Error fetching countries:", err)
      setError(err.response?.data?.message || err.message || "Gagal memuat daftar negara")
      setCountries([]) // Set empty array on error
    } finally {
      setLoadingCountries(false)
    }
  }

  const checkExistingProfile = async () => {
    try {
      setLoadingProfile(true)
      
      // Try to get current user's forwarder profile
      const response = await forwarderService.getMyProfile()
      
      let profileData: ForwarderProfile | null = null
      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        profileData = (response as any).data
      } else if (response && typeof response === 'object' && 'id' in response) {
        profileData = response as ForwarderProfile
      }

      if (profileData) {
        setProfileId(profileData.id)
        
        // Pre-fill form with existing data
        setFormData({
          company_name: profileData.company_name || "",
          contact_info: profileData.contact_info || {
            phone: "",
            email: "",
            address: "",
            website: "",
          },
          specialization_routes: profileData.specialization_routes || [],
          service_types: profileData.service_types || [],
        })

        // Pre-fill routes (extract destination from route format "ORIGIN-DESTINATION")
        const routes: RouteRow[] = profileData.specialization_routes.length > 0
          ? profileData.specialization_routes.map((route) => {
              const parts = route.split('-')
              const destination = parts.length > 1 ? parts.slice(1).join('-') : "" // Handle multi-part destinations
              return {
                id: Date.now().toString() + Math.random(),
                origin: "ID", // Always set to ID (Indonesia)
                destination: destination || "",
              }
            })
          : [{ id: Date.now().toString(), origin: "ID", destination: "" }]
        setRouteRows(routes)

        // Pre-fill services
        const predefinedServices = new Set<string>()
        const otherServices: OtherServiceRow[] = []
        
        profileData.service_types.forEach((service) => {
          if (PREDEFINED_SERVICE_TYPES.includes(service)) {
            predefinedServices.add(service)
          } else {
            otherServices.push({
              id: Date.now().toString() + Math.random(),
              value: service,
            })
          }
        })

        setSelectedServices(predefinedServices)
        setOtherServiceRows(otherServices.length > 0 ? otherServices : [{ id: Date.now().toString(), value: "" }])
      } else {
        // No profile exists, start with empty form
        setRouteRows([{ id: Date.now().toString(), origin: "ID", destination: "" }])
        setOtherServiceRows([{ id: Date.now().toString(), value: "" }])
      }
    } catch (err: any) {
      // Profile doesn't exist yet, start with empty form
      if (err.response?.status !== 404) {
        console.error("Error fetching profile:", err)
      }
      setRouteRows([{ id: Date.now().toString(), origin: "ID", destination: "" }])
      setOtherServiceRows([{ id: Date.now().toString(), value: "" }])
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('contact_')) {
      const field = name.replace('contact_', '') as keyof ForwarderContactInfo
      setFormData((prev) => ({
        ...prev,
        contact_info: {
          ...prev.contact_info,
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Route management
  const handleRouteChange = (id: string, field: 'origin' | 'destination', value: string) => {
    // Origin is always "ID", only allow destination changes
    if (field === 'origin') return
    
    setRouteRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
    if (errors.routes) {
      setErrors((prev) => ({ ...prev, routes: "" }))
    }
  }

  const handleAddRouteRow = () => {
    setRouteRows((prev) => [
      ...prev,
      { id: Date.now().toString(), origin: "ID", destination: "" },
    ])
  }

  const handleRemoveRouteRow = (id: string) => {
    setRouteRows((prev) => prev.filter((row) => row.id !== id))
  }

  // Service types management
  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(service)) {
        newSet.delete(service)
      } else {
        newSet.add(service)
      }
      return newSet
    })
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: "" }))
    }
  }

  const handleOtherServiceChange = (id: string, value: string) => {
    setOtherServiceRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, value } : row))
    )
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: "" }))
    }
  }

  const handleAddOtherServiceRow = () => {
    setOtherServiceRows((prev) => [
      ...prev,
      { id: Date.now().toString(), value: "" },
    ])
  }

  const handleRemoveOtherServiceRow = (id: string) => {
    setOtherServiceRows((prev) => prev.filter((row) => row.id !== id))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.company_name.trim()) {
      newErrors.company_name = "Nama perusahaan harus diisi"
    }

    if (!formData.contact_info.email?.trim()) {
      newErrors.contact_email = "Email harus diisi"
    }

    if (!formData.contact_info.phone?.trim()) {
      newErrors.contact_phone = "Nomor telepon harus diisi"
    }

    // Validate routes (origin is always "ID")
    const validRoutes = routeRows
      .filter((row) => row.destination) // Only check destination since origin is always "ID"
      .map((row) => `ID-${row.destination}`) // Always use "ID" as origin
    
    if (validRoutes.length === 0) {
      newErrors.routes = "Minimal 1 route harus ditambahkan"
    }

    // Validate services
    const allServices = Array.from(selectedServices)
    const otherServices = otherServiceRows
      .filter((row) => row.value.trim())
      .map((row) => row.value.trim())
    allServices.push(...otherServices)
    
    if (allServices.length === 0) {
      newErrors.services = "Minimal 1 jenis layanan harus dipilih"
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
      // Build routes from rows (origin is always "ID")
      const routes = routeRows
        .filter((row) => row.destination) // Only check destination since origin is always "ID"
        .map((row) => `ID-${row.destination}`) // Always use "ID" as origin

      // Build services
      const services = Array.from(selectedServices)
      const otherServices = otherServiceRows
        .filter((row) => row.value.trim())
        .map((row) => row.value.trim())
      services.push(...otherServices)

      const payload: CreateForwarderProfileRequest = {
        ...formData,
        specialization_routes: routes,
        service_types: services,
      }

      if (profileId) {
        // Update existing profile
        await forwarderService.updateProfile(profileId, payload)
      } else {
        // Create new profile
        const response = await forwarderService.createProfile(payload)
        const profile = (response as any).success ? (response as any).data : response
        setProfileId((profile as ForwarderProfile).id)
      }

      // Show success animation
      setShowSuccess(true)
      
      // Redirect after a short delay to show success animation
      setTimeout(() => {
        router.push("/forwarders/my-profile")
      }, 1500)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Gagal menyimpan profil forwarder"
      )
      setLoading(false)
    }
  }

  // Calculate form completion percentage
  const calculateProgress = () => {
    let completed = 0
    let total = 6

    if (formData.company_name.trim()) completed++
    if (formData.contact_info.email?.trim()) completed++
    if (formData.contact_info.phone?.trim()) completed++
    if (routeRows.some(r => r.destination)) completed++ // Origin is always "ID", only check destination
    if (selectedServices.size > 0 || otherServiceRows.some(r => r.value.trim())) completed++
    if (formData.contact_info.address?.trim() || formData.contact_info.website?.trim()) completed++

    return Math.round((completed / total) * 100)
  }

  const progress = calculateProgress()

  // Check field validation
  const isFieldValid = (fieldName: string) => {
    return !errors[fieldName] && formData[fieldName as keyof typeof formData] !== undefined
  }

  const isRouteValid = (row: RouteRow) => {
    return row.destination // Origin is always "ID", only check destination
  }

  if (!isAuthenticated || !isForwarder() || loadingProfile) {
    return null
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
              onClick={() => router.push("/forwarders/my-profile")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6366F1] shadow-[0_4px_0_0_#4f46e5]">
                <Truck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  {profileId ? "Edit Profil Forwarder" : "Buat Profil Forwarder"}
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Kelola profil forwarder Anda
                </p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          {!profileId && (
            <Card className="bg-gradient-to-r from-[#6366F1] to-[#4f46e5] rounded-3xl p-6 shadow-[0_6px_0_0_#4338ca] mb-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-[#F59E0B]" />
                  <h3 className="text-lg font-extrabold">Progress Pembuatan Profil</h3>
                </div>
                <span className="text-2xl font-extrabold">{progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-4 mb-2 overflow-hidden">
                <div 
                  className="h-full bg-[#F59E0B] rounded-full transition-all duration-500 ease-out shadow-[0_2px_0_0_#d97706]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm opacity-90">
                {progress === 100 
                  ? "🎉 Profil Anda sudah lengkap! Siap untuk disimpan." 
                  : progress >= 80
                  ? "Hampir selesai! Lengkapi beberapa detail lagi."
                  : progress >= 50
                  ? "Bagus! Lanjutkan mengisi form."
                  : "Mulai dengan mengisi informasi dasar perusahaan."}
              </p>
            </Card>
          )}

          {/* Success Animation */}
          {showSuccess && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <Card className="bg-white rounded-3xl p-8 shadow-[0_8px_0_0_#22C55E] max-w-md mx-4 animate-bounce">
                <div className="text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E] mx-auto mb-4 shadow-[0_4px_0_0_#16a34a]">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#0C4A6E] mb-2">
                    Profil Berhasil Disimpan! 🎉
                  </h3>
                  <p className="text-[#0284C7] font-medium">
                    Mengarahkan ke halaman profil...
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Error Display - More Creative */}
          {error && (
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl border-2 border-red-200 p-6 shadow-[0_4px_0_0_#fecaca] mb-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-red-800 mb-1">Oops! Ada yang perlu diperbaiki</h4>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </Card>
          )}

          <form onSubmit={handleSubmit}>
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
              <CardHeader className="bg-gradient-to-r from-[#F0F9FF] to-[#e0f2fe] rounded-t-3xl -m-6 mb-6 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6366F1] shadow-[0_4px_0_0_#4f46e5]">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-extrabold text-[#0C4A6E]">
                    Informasi Perusahaan
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Name */}
                <div>
                  <Label htmlFor="company_name" className="text-[#0C4A6E] font-bold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#6366F1]" />
                    Nama Perusahaan <span className="text-red-500">*</span>
                    {formData.company_name.trim() && !errors.company_name && (
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    )}
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      placeholder="Contoh: PT Logistik Global"
                      className={`rounded-2xl border-2 pr-10 ${
                        errors.company_name 
                          ? 'border-red-300 bg-red-50' 
                          : formData.company_name.trim()
                          ? 'border-[#22C55E] bg-green-50'
                          : 'border-[#e0f2fe]'
                      }`}
                      required
                    />
                    {formData.company_name.trim() && !errors.company_name && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#22C55E]" />
                    )}
                  </div>
                  {errors.company_name && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-xl">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.company_name}</span>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_email" className="text-[#0C4A6E] font-bold flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#6366F1]" />
                      Email <span className="text-red-500">*</span>
                      {formData.contact_info.email?.trim() && !errors.contact_email && (
                        <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                      )}
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="contact_email"
                        name="contact_email"
                        type="email"
                        value={formData.contact_info.email}
                        onChange={handleChange}
                        className={`rounded-2xl border-2 pr-10 ${
                          errors.contact_email 
                            ? 'border-red-300 bg-red-50' 
                            : formData.contact_info.email?.trim()
                            ? 'border-[#22C55E] bg-green-50'
                            : 'border-[#e0f2fe]'
                        }`}
                        required
                      />
                      {formData.contact_info.email?.trim() && !errors.contact_email && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#22C55E]" />
                      )}
                    </div>
                    {errors.contact_email && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-xl">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.contact_email}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="contact_phone" className="text-[#0C4A6E] font-bold flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#6366F1]" />
                      Nomor Telepon <span className="text-red-500">*</span>
                      {formData.contact_info.phone?.trim() && !errors.contact_phone && (
                        <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                      )}
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="contact_phone"
                        name="contact_phone"
                        value={formData.contact_info.phone}
                        onChange={handleChange}
                        className={`rounded-2xl border-2 pr-10 ${
                          errors.contact_phone 
                            ? 'border-red-300 bg-red-50' 
                            : formData.contact_info.phone?.trim()
                            ? 'border-[#22C55E] bg-green-50'
                            : 'border-[#e0f2fe]'
                        }`}
                        required
                      />
                      {formData.contact_info.phone?.trim() && !errors.contact_phone && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#22C55E]" />
                      )}
                    </div>
                    {errors.contact_phone && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-xl">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.contact_phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact_address" className="text-[#0C4A6E] font-bold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#6366F1]" />
                    Alamat
                    {formData.contact_info.address?.trim() && (
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    )}
                  </Label>
                  <Textarea
                    id="contact_address"
                    name="contact_address"
                    value={formData.contact_info.address}
                    onChange={handleChange}
                    rows={3}
                    className={`mt-2 rounded-2xl border-2 ${
                      formData.contact_info.address?.trim()
                        ? 'border-[#22C55E] bg-green-50'
                        : 'border-[#e0f2fe]'
                    }`}
                  />
                </div>

                <div>
                  <Label htmlFor="contact_website" className="text-[#0C4A6E] font-bold flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-[#6366F1]" />
                    Website
                    {formData.contact_info.website?.trim() && (
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    )}
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="contact_website"
                      name="contact_website"
                      type="url"
                      value={formData.contact_info.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className={`rounded-2xl border-2 pr-10 ${
                        formData.contact_info.website?.trim()
                          ? 'border-[#22C55E] bg-green-50'
                          : 'border-[#e0f2fe]'
                      }`}
                    />
                    {formData.contact_info.website?.trim() && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#22C55E]" />
                    )}
                  </div>
                </div>

                {/* Routes - Improved UX */}
                <div className="pt-6 border-t-2 border-[#e0f2fe]">
                  <Label className="text-[#0C4A6E] font-bold flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-[#6366F1]" />
                    Specialization Routes <span className="text-red-500">*</span>
                    {routeRows.some(r => r.destination) && !errors.routes && (
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    )}
                  </Label>
                  <p className="text-sm text-gray-500 mb-4">Pilih destination untuk setiap route (Origin selalu Indonesia)</p>
                  
                  <div className="space-y-3">
                    {routeRows.map((row, index) => {
                      const isValid = isRouteValid(row)
                      return (
                        <div 
                          key={row.id} 
                          className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                            isValid
                              ? 'bg-green-50 border-[#22C55E] shadow-[0_2px_0_0_#16a34a]'
                              : 'bg-[#F0F9FF] border-[#e0f2fe]'
                          }`}
                        >
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs font-bold text-gray-600 mb-1 block flex items-center gap-1">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6366F1] text-white text-xs font-extrabold">
                                  {index + 1}
                                </span>
                                Origin
                              </Label>
                              <Input
                                value="Indonesia - ID"
                                disabled
                                className="rounded-xl border-2 border-[#e0f2fe] bg-gray-100 text-gray-600 cursor-not-allowed"
                              />
                            </div>
                            <div>
                              <Label className="text-xs font-bold text-gray-600 mb-1 block flex items-center gap-1">
                                <ArrowRight className="h-4 w-4 text-[#6366F1]" />
                                Destination
                              </Label>
                              <Select
                                value={row.destination}
                                onChange={(e) => handleRouteChange(row.id, 'destination', e.target.value)}
                                disabled={loadingCountries || countries.length === 0}
                                className={`rounded-xl border-2 ${
                                  row.destination ? 'border-[#22C55E]' : 'border-[#e0f2fe]'
                                } ${loadingCountries ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <option value="">
                                  {loadingCountries ? 'Memuat negara...' : 'Pilih Destination'}
                                </option>
                                {countries.map((country) => (
                                  <option key={country.country_code} value={country.country_code}>
                                    {country.country_name} ({country.country_code})
                                  </option>
                                ))}
                              </Select>
                            </div>
                          </div>
                          {isValid && (
                            <CheckCircle2 className="h-6 w-6 text-[#22C55E] flex-shrink-0" />
                          )}
                          {routeRows.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveRouteRow(row.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddRouteRow}
                    className="mt-3 rounded-2xl border-2 border-[#6366F1] text-[#6366F1] hover:bg-[#F0F9FF]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Route
                  </Button>

                  {errors.routes && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span>{errors.routes}</span>
                    </div>
                  )}
                </div>

                {/* Services - Improved UX with Checkboxes */}
                <div className="pt-6 border-t-2 border-[#e0f2fe]">
                  <Label className="text-[#0C4A6E] font-bold flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-[#6366F1]" />
                    Service Types <span className="text-red-500">*</span>
                    {(selectedServices.size > 0 || otherServiceRows.some(r => r.value.trim())) && !errors.services && (
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    )}
                  </Label>
                  <p className="text-sm text-gray-500 mb-4">Pilih jenis layanan yang Anda sediakan</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {PREDEFINED_SERVICE_TYPES.map((service) => {
                      const isSelected = selectedServices.has(service)
                      return (
                        <label
                          key={service}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#22C55E]/10 border-[#22C55E] shadow-[0_2px_0_0_#16a34a]'
                              : 'border-[#e0f2fe] hover:bg-[#F0F9FF] hover:border-[#6366F1]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleServiceToggle(service)}
                            className="h-4 w-4 text-[#6366F1] rounded border-[#e0f2fe] focus:ring-[#6366F1]"
                          />
                          <span className={`text-sm font-medium flex-1 ${
                            isSelected ? 'text-[#0C4A6E]' : 'text-[#0C4A6E]'
                          }`}>
                            {service}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                          )}
                        </label>
                      )
                    })}
                  </div>

                  {/* Other Service Option - Multiple Rows */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-[#F0F9FF] to-[#e0f2fe] rounded-2xl border-2 border-[#e0f2fe]">
                    <Label className="text-[#0C4A6E] font-bold mb-2 block flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#F59E0B]" />
                      Layanan Lainnya (Opsional)
                    </Label>
                    <p className="text-sm text-gray-500 mb-3">Tambahkan jenis layanan custom lainnya</p>
                    
                    <div className="space-y-3">
                      {otherServiceRows.map((row) => {
                        const hasValue = row.value.trim()
                        return (
                          <div 
                            key={row.id} 
                            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                              hasValue
                                ? 'bg-green-50 border-[#22C55E]'
                                : 'bg-white border-[#e0f2fe]'
                            }`}
                          >
                            <Input
                              value={row.value}
                              onChange={(e) => handleOtherServiceChange(row.id, e.target.value)}
                              placeholder="Ketik jenis layanan lainnya..."
                              className={`flex-1 rounded-xl border-2 pr-10 ${
                                hasValue ? 'border-[#22C55E]' : 'border-[#e0f2fe]'
                              }`}
                            />
                            {hasValue && (
                              <CheckCircle2 className="h-5 w-5 text-[#22C55E] flex-shrink-0" />
                            )}
                            {otherServiceRows.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveOtherServiceRow(row.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddOtherServiceRow}
                      className="mt-3 rounded-2xl border-2 border-[#F59E0B] text-[#F59E0B] hover:bg-[#FEF3C7]"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Layanan Lainnya
                    </Button>
                  </div>

                  {errors.services && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span>{errors.services}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-[#6366F1] to-[#4f46e5] rounded-3xl shadow-[0_6px_0_0_#4338ca]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-white">
                  <p className="font-bold text-lg mb-1">
                    {progress === 100 
                      ? "🎉 Profil Anda sudah lengkap!" 
                      : `Lengkapi ${100 - progress}% lagi untuk menyelesaikan profil`}
                  </p>
                  <p className="text-sm opacity-90">
                    {profileId ? "Klik tombol di bawah untuk memperbarui profil Anda" : "Klik tombol di bawah untuk membuat profil forwarder Anda"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/forwarders/my-profile")}
                    className="rounded-2xl bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || progress < 100}
                    className="rounded-2xl shadow-[0_4px_0_0_#22C55E] bg-[#22C55E] hover:bg-[#16a34a] text-white font-extrabold px-8"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Menyimpan...</span>
                      </div>
                    ) : profileId ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Update Profil</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Buat Profil</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
