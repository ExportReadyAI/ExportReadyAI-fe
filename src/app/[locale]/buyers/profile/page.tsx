"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { buyerProfileService, countryService } from "@/lib/api/services"
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
  ShoppingCart,
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
} from "lucide-react"
import type { CreateBuyerProfileRequest, BuyerProfile, BuyerContactInfo, Country } from "@/lib/api/types"

interface CategoryRow {
  id: string
  value: string
}

const BUSINESS_TYPES = [
  "Importir",
  "Distributor",
  "Retailer",
  "Trading Company",
]

const COMMON_PRODUCT_CATEGORIES = [
  "Makanan Olahan",
  "Kerajinan",
  "Tekstil",
  "Furniture",
  "Elektronik",
  "Kosmetik",
  "Makanan & Minuman",
  "Pertanian",
  "Perikanan",
  "Perhiasan",
]

export default function BuyerProfilePage() {
  const router = useRouter()
  const { isAuthenticated, isBuyer } = useAuthStore()
  const [countries, setCountries] = useState<Country[]>([])
  const [formData, setFormData] = useState<CreateBuyerProfileRequest>({
    company_name: "",
    company_description: "",
    contact_info: {
      phone: "",
      email: "",
      address: "",
      website: "",
    },
    preferred_product_categories: [],
    preferred_product_categories_description: "",
    source_countries: [],
    source_countries_description: "",
    business_type: "",
    business_type_description: "",
    annual_import_volume: "",
    annual_import_volume_description: "",
  })
  const [categoryRows, setCategoryRows] = useState<CategoryRow[]>([{ id: Date.now().toString(), value: "" }])
  const [selectedCommonCategories, setSelectedCommonCategories] = useState<Set<string>>(new Set())
  const [selectedSourceCountries, setSelectedSourceCountries] = useState<Set<string>>(new Set())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [profileId, setProfileId] = useState<number | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !isBuyer()) {
      router.push("/login")
      return
    }

    fetchCountries()
    checkExistingProfile()
  }, [isAuthenticated, router, isBuyer])

  const fetchCountries = async () => {
    try {
      setLoadingCountries(true)
      const response = await countryService.list()
      
      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        setCountries((response as any).data || [])
      } else if (Array.isArray(response)) {
        setCountries(response)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat negara")
    } finally {
      setLoadingCountries(false)
    }
  }

  const checkExistingProfile = async () => {
    try {
      setLoadingProfile(true)
      
      const response = await buyerProfileService.getMyProfile()
      
      let profileData: BuyerProfile | null = null
      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        profileData = (response as any).data
      } else if (response && typeof response === 'object' && 'id' in response) {
        profileData = response as BuyerProfile
      }

      if (profileData) {
        setProfileId(profileData.id)
        
        setFormData({
          company_name: profileData.company_name || "",
          company_description: profileData.company_description || "",
          contact_info: profileData.contact_info || {
            phone: "",
            email: "",
            address: "",
            website: "",
          },
          preferred_product_categories: profileData.preferred_product_categories || [],
          preferred_product_categories_description: profileData.preferred_product_categories_description || "",
          source_countries: profileData.source_countries || [],
          source_countries_description: profileData.source_countries_description || "",
          business_type: profileData.business_type || "",
          business_type_description: profileData.business_type_description || "",
          annual_import_volume: profileData.annual_import_volume || "",
          annual_import_volume_description: profileData.annual_import_volume_description || "",
        })

        // Separate common and custom categories
        const commonCategories = profileData.preferred_product_categories.filter(cat => 
          COMMON_PRODUCT_CATEGORIES.includes(cat)
        )
        const customCategories = profileData.preferred_product_categories.filter(cat => 
          !COMMON_PRODUCT_CATEGORIES.includes(cat)
        )
        
        // Store selected common categories in separate state
        setSelectedCommonCategories(new Set(commonCategories))
        
        // Only store custom categories in categoryRows (rows are for "other" only)
        // Always show at least one empty row for "other"
        const categoryRowsData: CategoryRow[] = customCategories.length > 0
          ? [...customCategories.map(cat => ({ id: Date.now().toString() + Math.random(), value: cat })), { id: Date.now().toString(), value: "" }]
          : [{ id: Date.now().toString(), value: "" }]
        
        setCategoryRows(categoryRowsData)

        setSelectedSourceCountries(new Set(profileData.source_countries))
      } else {
        // No profile exists, start with empty form - one empty row for "other"
        setCategoryRows([{ id: Date.now().toString(), value: "" }])
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error("Error fetching profile:", err)
      }
      // No profile exists, start with empty form - one empty row for "other"
      setCategoryRows([{ id: Date.now().toString(), value: "" }])
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('contact_')) {
      const field = name.replace('contact_', '') as keyof BuyerContactInfo
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

  const handleCategoryChange = (id: string, value: string) => {
    setCategoryRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, value } : row))
    )
    if (errors.categories) {
      setErrors((prev) => ({ ...prev, categories: "" }))
    }
  }

  const handleRemoveCategoryRow = (id: string) => {
    setCategoryRows((prev) => prev.filter((row) => row.id !== id))
  }

  const handleSourceCountryToggle = (countryCode: string) => {
    setSelectedSourceCountries((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(countryCode)) {
        newSet.delete(countryCode)
      } else {
        newSet.add(countryCode)
      }
      return newSet
    })
    if (errors.source_countries) {
      setErrors((prev) => ({ ...prev, source_countries: "" }))
    }
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

    // Check if at least one category is selected (common or custom)
    const validCustomCategories = categoryRows
      .filter((row) => row.value.trim() && !COMMON_PRODUCT_CATEGORIES.includes(row.value))
      .map((row) => row.value.trim())
    
    if (selectedCommonCategories.size === 0 && validCustomCategories.length === 0) {
      newErrors.categories = "Minimal 1 kategori produk harus ditambahkan"
    }

    if (selectedSourceCountries.size === 0) {
      newErrors.source_countries = "Minimal 1 negara sumber harus dipilih"
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
      // Get categories from both selected checkboxes and custom input rows
      const commonCategoriesList = Array.from(selectedCommonCategories)
      const customCategories = categoryRows
        .filter((row) => row.value.trim() && !COMMON_PRODUCT_CATEGORIES.includes(row.value))
        .map((row) => row.value.trim())
      const categories = [...commonCategoriesList, ...customCategories]

      const payload: CreateBuyerProfileRequest = {
        ...formData,
        preferred_product_categories: categories,
        source_countries: Array.from(selectedSourceCountries),
      }

      if (profileId) {
        await buyerProfileService.updateProfile(profileId, payload)
      } else {
        const response = await buyerProfileService.createProfile(payload)
        const profile = (response as any).success ? (response as any).data : response
        setProfileId((profile as BuyerProfile).id)
      }

      setShowSuccess(true)
      
      setTimeout(() => {
        router.push("/buyers/my-profile")
      }, 1500)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Gagal menyimpan profil buyer"
      )
      setLoading(false)
    }
  }

  const calculateProgress = () => {
    let completed = 0
    let total = 6

    if (formData.company_name.trim()) completed++
    if (formData.contact_info.email?.trim()) completed++
    if (formData.contact_info.phone?.trim()) completed++
    if (selectedCommonCategories.size > 0 || categoryRows.some(r => r.value.trim() && !COMMON_PRODUCT_CATEGORIES.includes(r.value))) completed++
    if (selectedSourceCountries.size > 0) completed++
    if (formData.business_type) completed++

    return Math.round((completed / total) * 100)
  }

  const progress = calculateProgress()

  if (!isAuthenticated || !isBuyer() || loadingProfile) {
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
              onClick={() => router.push("/buyers/my-profile")}
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
                  {profileId ? "Edit Profil Buyer" : "Buat Profil Buyer"}
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Kelola profil buyer Anda
                </p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          {!profileId && (
            <Card className="bg-gradient-to-r from-[#EC4899] to-[#db2777] rounded-3xl p-6 shadow-[0_6px_0_0_#be185d] mb-6 text-white">
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

          {/* Error Display */}
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
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#FDF2F8] to-[#fce7f3] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EC4899] shadow-[0_4px_0_0_#db2777]">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-extrabold text-[#0C4A6E]">
                    Informasi Perusahaan
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Company Name */}
                <div>
                  <Label htmlFor="company_name" className="text-[#0C4A6E] font-bold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#EC4899]" />
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
                      placeholder="Contoh: PT Import Global"
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

                {/* Company Description */}
                <div>
                  <Label htmlFor="company_description" className="text-[#0C4A6E] font-bold">
                    Deskripsi Perusahaan
                  </Label>
                  <Textarea
                    id="company_description"
                    name="company_description"
                    value={formData.company_description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Deskripsi singkat tentang perusahaan Anda..."
                    className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_email" className="text-[#0C4A6E] font-bold flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#EC4899]" />
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
                      <Phone className="h-4 w-4 text-[#EC4899]" />
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
                    <MapPin className="h-4 w-4 text-[#EC4899]" />
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
                    <ExternalLink className="h-4 w-4 text-[#EC4899]" />
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

                {/* Preferred Product Categories */}
                <div className="pt-6 border-t-2 border-[#e0f2fe]">
                  <Label className="text-[#0C4A6E] font-bold flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-[#EC4899]" />
                    Preferred Product Categories <span className="text-red-500">*</span>
                    {(selectedCommonCategories.size > 0 || categoryRows.some(r => r.value.trim() && !COMMON_PRODUCT_CATEGORIES.includes(r.value))) && !errors.categories && (
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    )}
                  </Label>
                  <p className="text-sm text-gray-500 mb-4">Pilih kategori produk yang Anda minati</p>
                  
                  {/* Common Categories as Checkboxes */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {COMMON_PRODUCT_CATEGORIES.map((category) => {
                      const isSelected = selectedCommonCategories.has(category)
                      return (
                        <label
                          key={category}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#22C55E]/10 border-[#22C55E] shadow-[0_2px_0_0_#16a34a]'
                              : 'border-[#e0f2fe] hover:bg-[#FDF2F8] hover:border-[#EC4899]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedCommonCategories((prev) => {
                                const newSet = new Set(prev)
                                if (newSet.has(category)) {
                                  newSet.delete(category)
                                } else {
                                  newSet.add(category)
                                }
                                return newSet
                              })
                              if (errors.categories) {
                                setErrors((prev) => ({ ...prev, categories: "" }))
                              }
                            }}
                            className="h-4 w-4 text-[#EC4899] rounded border-[#e0f2fe] focus:ring-[#EC4899]"
                          />
                          <span className="text-sm font-medium text-[#0C4A6E] flex-1">{category}</span>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-[#22C55E] flex-shrink-0" />
                          )}
                        </label>
                      )
                    })}
                  </div>

                  {/* Other Categories - Input Rows Only */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-[#FDF2F8] to-[#fce7f3] rounded-2xl border-2 border-[#fce7f3]">
                    <Label className="text-[#0C4A6E] font-bold mb-2 block flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#F59E0B]" />
                      Kategori Lainnya (Opsional)
                    </Label>
                    <p className="text-sm text-gray-500 mb-3">Tambahkan kategori custom lainnya</p>
                    
                    <div className="space-y-3">
                      {categoryRows
                        .filter(row => !COMMON_PRODUCT_CATEGORIES.includes(row.value))
                        .map((row) => {
                          const hasValue = row.value.trim()
                          const otherRows = categoryRows.filter(r => !COMMON_PRODUCT_CATEGORIES.includes(r.value))
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
                                onChange={(e) => handleCategoryChange(row.id, e.target.value)}
                                placeholder="Ketik kategori produk lainnya..."
                                className={`flex-1 rounded-xl border-2 pr-10 ${
                                  hasValue ? 'border-[#22C55E]' : 'border-[#e0f2fe]'
                                }`}
                              />
                              {hasValue && (
                                <CheckCircle2 className="h-5 w-5 text-[#22C55E] flex-shrink-0" />
                              )}
                              {otherRows.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveCategoryRow(row.id)}
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
                      onClick={() => {
                        // Only add row for other categories (not common ones)
                        const otherRows = categoryRows.filter(r => !COMMON_PRODUCT_CATEGORIES.includes(r.value))
                        setCategoryRows(prev => [...prev, { id: Date.now().toString(), value: "" }])
                      }}
                      className="mt-3 rounded-2xl border-2 border-[#F59E0B] text-[#F59E0B] hover:bg-[#FEF3C7]"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Kategori Lainnya
                    </Button>
                  </div>

                  {errors.categories && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span>{errors.categories}</span>
                    </div>
                  )}
                </div>

                {/* Source Countries */}
                <div className="pt-6 border-t-2 border-[#e0f2fe]">
                  <Label className="text-[#0C4A6E] font-bold flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-[#EC4899]" />
                    Source Countries <span className="text-red-500">*</span>
                    {selectedSourceCountries.size > 0 && !errors.source_countries && (
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    )}
                  </Label>
                  <p className="text-sm text-gray-500 mb-4">Pilih negara sumber produk</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {countries.map((country) => {
                      const isSelected = selectedSourceCountries.has(country.country_code)
                      return (
                        <label
                          key={country.country_code}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#22C55E]/10 border-[#22C55E] shadow-[0_2px_0_0_#16a34a]'
                              : 'border-[#e0f2fe] hover:bg-[#FDF2F8] hover:border-[#EC4899]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSourceCountryToggle(country.country_code)}
                            className="h-4 w-4 text-[#EC4899] rounded border-[#e0f2fe] focus:ring-[#EC4899]"
                          />
                          <span className="text-sm font-medium text-[#0C4A6E]">
                            {country.country_name} ({country.country_code})
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                          )}
                        </label>
                      )
                    })}
                  </div>

                  {errors.source_countries && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span>{errors.source_countries}</span>
                    </div>
                  )}
                </div>

                {/* Business Type */}
                <div className="pt-6 border-t-2 border-[#e0f2fe]">
                  <Label htmlFor="business_type" className="text-[#0C4A6E] font-bold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#EC4899]" />
                    Business Type
                    {formData.business_type && (
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    )}
                  </Label>
                  <Select
                    id="business_type"
                    name="business_type"
                    value={formData.business_type}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, business_type: e.target.value }))
                      if (errors.business_type) {
                        setErrors((prev) => ({ ...prev, business_type: "" }))
                      }
                    }}
                    className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                  >
                    <option value="">Pilih Business Type</option>
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </div>

                {/* Business Type Description */}
                {formData.business_type && (
                  <div>
                    <Label htmlFor="business_type_description" className="text-[#0C4A6E] font-bold">
                      Business Type Description
                    </Label>
                    <Textarea
                      id="business_type_description"
                      name="business_type_description"
                      value={formData.business_type_description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Jelaskan operasi bisnis dan saluran distribusi Anda..."
                      className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                    />
                  </div>
                )}

                {/* Annual Import Volume */}
                <div>
                  <Label htmlFor="annual_import_volume" className="text-[#0C4A6E] font-bold">
                    Annual Import Volume
                  </Label>
                  <Input
                    id="annual_import_volume"
                    name="annual_import_volume"
                    value={formData.annual_import_volume}
                    onChange={handleChange}
                    placeholder="Contoh: 1000-5000 containers"
                    className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                  />
                  {formData.annual_import_volume && (
                    <Textarea
                      id="annual_import_volume_description"
                      name="annual_import_volume_description"
                      value={formData.annual_import_volume_description}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Jelaskan kapasitas import dan tren..."
                      className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-[#EC4899] to-[#db2777] rounded-3xl shadow-[0_6px_0_0_#be185d]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-white">
                  <p className="font-bold text-lg mb-1">
                    {progress === 100 
                      ? "🎉 Profil Anda sudah lengkap!" 
                      : `Lengkapi ${100 - progress}% lagi untuk menyelesaikan profil`}
                  </p>
                  <p className="text-sm opacity-90">
                    {profileId ? "Klik tombol di bawah untuk memperbarui profil Anda" : "Klik tombol di bawah untuk membuat profil buyer Anda"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/buyers/my-profile")}
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

