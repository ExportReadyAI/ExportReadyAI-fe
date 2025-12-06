"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { buyerProfileService, countryService } from "@/lib/api/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Search, 
  Eye, 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Globe,
  Package,
  Building2,
} from "lucide-react"
import type { BuyerProfile, Country } from "@/lib/api/types"

export default function BuyerProfilesTab() {
  const router = useRouter()
  const [buyers, setBuyers] = useState<BuyerProfile[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>("all")
  const [sourceCountryFilter, setSourceCountryFilter] = useState<string>("all")
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("company_name")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchCountries()
    fetchBuyers()
  }, [page, searchTerm, productCategoryFilter, sourceCountryFilter, businessTypeFilter, sortBy])

  const fetchCountries = async () => {
    try {
      const response = await countryService.list()
      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        setCountries((response as any).data || [])
      } else if (Array.isArray(response)) {
        setCountries(response)
      }
    } catch (err) {
      console.error("Error fetching countries:", err)
    }
  }

  const fetchBuyers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = {
        page,
        limit: 12,
        sort: sortBy,
      }

      if (searchTerm) {
        params.search = searchTerm
      }

      if (productCategoryFilter !== "all") {
        params.product_category = productCategoryFilter
      }

      if (sourceCountryFilter !== "all") {
        params.source_country = sourceCountryFilter
      }

      if (businessTypeFilter !== "all") {
        params.business_type = businessTypeFilter
      }

      const response = await buyerProfileService.list(params)

      let buyersData: BuyerProfile[] = []
      let totalCountValue = 0
      let totalPagesValue = 1

      if (response && typeof response === 'object' && 'success' in response && (response as any).success) {
        buyersData = Array.isArray((response as any).data) ? (response as any).data : []
        if ((response as any).pagination) {
          totalCountValue = (response as any).pagination.count || 0
          totalPagesValue = (response as any).pagination.total_pages || 1
        }
      } else if (Array.isArray(response)) {
        buyersData = response
      } else if (response && typeof response === 'object' && 'results' in response) {
        buyersData = (response as any).results || []
        totalCountValue = (response as any).count || 0
        totalPagesValue = Math.ceil(totalCountValue / 12) || 1
      }

      setBuyers(buyersData)
      setTotalCount(totalCountValue || buyersData.length)
      setTotalPages(totalPagesValue || 1)
    } catch (err: any) {
      console.error("Error fetching buyer profiles:", err)
      setError(err.response?.data?.message || err.message || "Gagal memuat data buyer profiles")
    } finally {
      setLoading(false)
    }
  }

  const productCategories = Array.from(new Set(buyers.flatMap(b => b.preferred_product_categories))).filter(Boolean)
  const businessTypes = Array.from(new Set(buyers.map(b => b.business_type).filter(Boolean)))

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-[#0284C7]" />
          <h3 className="font-bold text-[#0C4A6E]">Filter & Pencarian</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari buyer..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className="pl-10 rounded-2xl border-2 border-[#e0f2fe]"
            />
          </div>
          <Select 
            value={productCategoryFilter} 
            onChange={(e) => { setProductCategoryFilter(e.target.value); setPage(1) }}
            className="rounded-2xl border-2 border-[#e0f2fe]"
          >
            <option value="all">Semua Kategori</option>
            {productCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
          <Select 
            value={sourceCountryFilter} 
            onChange={(e) => { setSourceCountryFilter(e.target.value); setPage(1) }}
            className="rounded-2xl border-2 border-[#e0f2fe]"
          >
            <option value="all">Semua Negara</option>
            {countries.map(country => (
              <option key={country.country_code} value={country.country_code}>
                {country.country_name}
              </option>
            ))}
          </Select>
          <Select 
            value={businessTypeFilter} 
            onChange={(e) => { setBusinessTypeFilter(e.target.value); setPage(1) }}
            className="rounded-2xl border-2 border-[#e0f2fe]"
          >
            <option value="all">Semua Tipe</option>
            {businessTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
          <Select 
            value={sortBy} 
            onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
            className="rounded-2xl border-2 border-[#e0f2fe]"
          >
            <option value="company_name">Nama A-Z</option>
            <option value="created_at">Terbaru</option>
          </Select>
        </div>
      </Card>

      {/* Buyer Profiles Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#0284C7] border-t-transparent"></div>
          <p className="mt-4 text-[#0284C7] font-medium">Memuat data...</p>
        </div>
      ) : buyers.length === 0 ? (
        <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-12 shadow-[0_4px_0_0_#e0f2fe] text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#0C4A6E] mb-2">
            Belum ada buyer profile
          </h3>
          <p className="text-gray-500">
            Tidak ada buyer yang sesuai dengan filter Anda
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {buyers.map((buyer) => (
              <Card 
                key={buyer.id} 
                className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] hover:shadow-[0_6px_0_0_#EC4899] transition-all cursor-pointer"
                onClick={() => router.push(`/buyers/${buyer.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-5 w-5 text-[#EC4899]" />
                        <h3 className="text-lg font-extrabold text-[#0C4A6E]">
                          {buyer.company_name}
                        </h3>
                      </div>
                      {buyer.business_type && (
                        <Badge className="bg-[#F0F9FF] text-[#0284C7] border border-[#e0f2fe] mb-2">
                          {buyer.business_type}
                        </Badge>
                      )}
                      {buyer.total_requests > 0 && (
                        <p className="text-xs text-gray-500">
                          {buyer.total_requests} active requests
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {buyer.preferred_product_categories.length > 0 && (
                      <div className="flex items-start gap-1 text-sm text-gray-600">
                        <Package className="h-4 w-4 text-[#EC4899] mt-0.5" />
                        <div className="flex-1">
                          <span className="font-medium">Kategori: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {buyer.preferred_product_categories.slice(0, 2).map((cat, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                            {buyer.preferred_product_categories.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{buyer.preferred_product_categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {buyer.source_countries.length > 0 && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Globe className="h-4 w-4 text-[#0284C7]" />
                        <span className="font-medium">Source: </span>
                        <span className="text-xs">
                          {buyer.source_countries.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-2xl"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/buyers/${buyer.id}`)
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan {((page - 1) * 12) + 1} - {Math.min(page * 12, totalCount)} dari {totalCount} buyer
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-2xl"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm font-medium text-[#0C4A6E]">
                  Halaman {page} dari {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-2xl"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

