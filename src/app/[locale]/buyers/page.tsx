"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Plus, FileText } from "lucide-react"
import BuyerRequestsTab from "@/components/buyers/BuyerRequestsTab"
import BuyerProfilesTab from "@/components/buyers/BuyerProfilesTab"

export default function BuyersPage() {
  const router = useRouter()
  const { isAuthenticated, isUMKM, isAdmin } = useAuthStore()
  const [activeTab, setActiveTab] = useState<"requests" | "profiles">("requests")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token || (!isAuthenticated || (!isUMKM() && !isAdmin()))) {
      router.push("/login")
      return
    }
  }, [mounted, router, isAuthenticated, isUMKM, isAdmin])

  if (!mounted) {
    return null
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) {
    return null
  }

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC4899] shadow-[0_4px_0_0_#db2777]">
                <ShoppingCart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                  Buyers
                </h1>
                <p className="text-[#0284C7] font-medium">
                  Kelola buyer requests dan lihat buyer profiles
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] mb-6">
            <CardContent className="p-0">
              <div className="flex border-b-2 border-[#e0f2fe]">
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`flex-1 px-6 py-4 font-bold text-lg transition-all ${
                    activeTab === "requests"
                      ? "text-[#EC4899] border-b-4 border-[#EC4899] bg-[#FDF2F8]"
                      : "text-gray-500 hover:text-[#EC4899] hover:bg-[#FDF2F8]"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>Requests</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("profiles")}
                  className={`flex-1 px-6 py-4 font-bold text-lg transition-all ${
                    activeTab === "profiles"
                      ? "text-[#EC4899] border-b-4 border-[#EC4899] bg-[#FDF2F8]"
                      : "text-gray-500 hover:text-[#EC4899] hover:bg-[#FDF2F8]"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Profiles</span>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Tab Content */}
          {activeTab === "requests" && <BuyerRequestsTab />}
          {activeTab === "profiles" && <BuyerProfilesTab />}
        </div>
      </main>
    </div>
  )
}

