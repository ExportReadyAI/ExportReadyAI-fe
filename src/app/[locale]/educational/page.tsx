"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { educationalService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { EducationalModulesAccordion } from "@/components/educational/EducationalModulesAccordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  BookOpen, 
  Search, 
  AlertCircle,
  Rocket,
  Loader2
} from "lucide-react"
import type { EducationalModule } from "@/lib/api/types"

export default function EducationalMaterialsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [modules, setModules] = useState<EducationalModule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (!isAuthenticated || !token) {
      router.push("/login")
      return
    }

    fetchModules()
  }, [isAuthenticated, router])

  const fetchModules = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await educationalService.modules.list({ limit: 100 })
      
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
      console.error("Error fetching modules:", err)
      setError(err.response?.data?.message || "Gagal memuat materi edukasi")
    } finally {
      setLoading(false)
    }
  }

  const filteredModules = modules.filter((module) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      module.title.toLowerCase().includes(query) ||
      module.description?.toLowerCase().includes(query) ||
      module.articles?.some(article => 
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      )
    )
  })

  if (!mounted) {
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

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8 bg-gradient-to-r from-[#0284C7] to-[#0369a1] rounded-3xl p-8 shadow-[0_6px_0_0_#064e7a] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-[#F59E0B]/20 rounded-full translate-y-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-[0_4px_0_0_#065985]">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-white mb-1">
                    Materi Edukasi 📚
                  </h1>
                  <p className="text-[#7DD3FC] font-medium">
                    Pelajari panduan ekspor dan tips bisnis untuk mengembangkan usaha Anda
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7DD3FC]" />
              <Input
                type="text"
                placeholder="Cari modul atau artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-2xl border-2 border-[#e0f2fe] bg-white text-[#0C4A6E] placeholder:text-[#7DD3FC] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800 font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block h-12 w-12 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg font-bold text-[#0C4A6E]">Memuat materi edukasi...</p>
              <p className="text-sm text-[#7DD3FC] mt-2">Mohon tunggu sebentar</p>
            </div>
          )}

          {/* Modules List */}
          {!loading && !error && (
            <>
              {filteredModules.length > 0 ? (
                <div className="mb-6">
                  <p className="text-sm font-medium text-[#7DD3FC] mb-4">
                    Menampilkan {filteredModules.length} modul
                  </p>
                  <EducationalModulesAccordion
                    modules={filteredModules}
                    maxModules={filteredModules.length}
                    showViewAll={false}
                  />
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#bae6fd]">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F0F9FF] mx-auto mb-4">
                    <BookOpen className="h-10 w-10 text-[#7DD3FC]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0C4A6E] mb-2">
                    {searchQuery ? "Tidak ada hasil pencarian" : "Belum ada materi edukasi"}
                  </h3>
                  <p className="text-[#7DD3FC]">
                    {searchQuery 
                      ? "Coba gunakan kata kunci lain untuk mencari"
                      : "Materi edukasi akan segera tersedia"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

