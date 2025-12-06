"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  FileText,
  Settings,
  ArrowLeft,
  Rocket
} from "lucide-react"
import Link from "next/link"

export default function EducationalAdminPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (!isAuthenticated || !token) {
      router.push("/login")
      return
    }

    if (!isAdmin()) {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, router, isAdmin])

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
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  onClick={() => router.back()}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-[0_4px_0_0_#065985]">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-white mb-1">
                    Kelola Materi Edukasi 📚
                  </h1>
                  <p className="text-[#7DD3FC] font-medium">
                    Kelola modul dan artikel edukasi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Modules Management */}
            <Link href="/educational/admin/modules">
              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_6px_0_0_#bae6fd] p-8 hover:shadow-[0_8px_0_0_#7dd3fc] transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0369a1] shadow-[0_4px_0_0_#065985] group-hover:scale-110 transition-transform">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#0C4A6E] mb-1">
                      Kelola Modul
                    </h2>
                    <p className="text-sm text-[#7DD3FC]">
                      Buat, edit, dan atur urutan modul
                    </p>
                  </div>
                </div>
                <p className="text-[#0284C7] font-medium">
                  Kelola kategori dan topik materi edukasi →
                </p>
              </Card>
            </Link>

            {/* Articles Management */}
            <Link href="/educational/admin/articles">
              <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_6px_0_0_#bae6fd] p-8 hover:shadow-[0_8px_0_0_#7dd3fc] transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#16a34a] shadow-[0_4px_0_0_#15803d] group-hover:scale-110 transition-transform">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#0C4A6E] mb-1">
                      Kelola Artikel
                    </h2>
                    <p className="text-sm text-[#7DD3FC]">
                      Buat, edit, dan atur urutan artikel
                    </p>
                  </div>
                </div>
                <p className="text-[#0284C7] font-medium">
                  Kelola konten artikel dalam modul →
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

