"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { exportAnalysisService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Shield,
  Package,
  Tag,
  Truck,
  ClipboardCheck,
  Copyright,
  DollarSign,
  Globe,
  AlertCircle,
  Loader2,
} from "lucide-react"
import type { RegulationRecommendationsResponse, RegulationSection } from "@/lib/api/types"

export default function RegulationRecommendationsPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated } = useAuthStore()
  const [data, setData] = useState<RegulationRecommendationsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState<'id' | 'en'>('id')

  const analysisId = params?.id as string

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (analysisId) {
      fetchRecommendations()
    }
  }, [isAuthenticated, router, analysisId, language])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await exportAnalysisService.getRegulationRecommendations(
        analysisId,
        language
      )

      if (response && typeof response === 'object') {
        if ('success' in response && response.success) {
          setData((response as any).data)
        } else {
          setData(response as RegulationRecommendationsResponse)
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengambil rekomendasi")
    } finally {
      setLoading(false)
    }
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'id' ? 'en' : 'id')
  }

  const sections = [
    { key: 'overview', icon: BookOpen, title: 'Overview', color: '#0284C7' },
    { key: 'prohibited_items', icon: Shield, title: 'Prohibited Items', color: '#EF4444' },
    { key: 'import_restrictions', icon: AlertCircle, title: 'Import Restrictions', color: '#F59E0B' },
    { key: 'certifications', icon: FileText, title: 'Certifications', color: '#8B5CF6' },
    { key: 'labeling_requirements', icon: Tag, title: 'Labeling Requirements', color: '#10B981' },
    { key: 'customs_procedures', icon: ClipboardCheck, title: 'Customs Procedures', color: '#3B82F6' },
    { key: 'testing_inspection', icon: Package, title: 'Testing & Inspection', color: '#EC4899' },
    { key: 'intellectual_property', icon: Copyright, title: 'Intellectual Property', color: '#6366F1' },
    { key: 'shipping_logistics', icon: Truck, title: 'Shipping & Logistics', color: '#14B8A6' },
    { key: 'timeline_costs', icon: DollarSign, title: 'Timeline & Costs', color: '#F97316' },
  ]

  if (!isAuthenticated || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F9FF]">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#0284C7] shadow-[0_6px_0_0_#065985]">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <p className="text-lg font-bold text-[#0C4A6E]">
            {language === 'id' ? 'Memuat rekomendasi...' : 'Loading recommendations...'}
          </p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-screen bg-[#F0F9FF]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8">
            <Alert variant="destructive">
              <AlertDescription>
                {error || (language === 'id' ? 'Rekomendasi tidak ditemukan' : 'Recommendations not found')}
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#0284C7] hover:text-[#0369a1] font-bold mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              {language === 'id' ? 'Kembali' : 'Back'}
            </button>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0284C7] shadow-[0_4px_0_0_#065985]">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                    {language === 'id' ? 'Rekomendasi Regulasi' : 'Regulation Recommendations'}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#0284C7] font-medium">
                      {data.product_name} → {data.country_code}
                    </span>
                    {data.from_cache && (
                      <span className="text-xs text-[#7DD3FC] bg-[#E0F2FE] px-2 py-1 rounded-lg">
                        {language === 'id' ? '⚡ Dari Cache' : '⚡ From Cache'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={toggleLanguage}
                variant="outline"
                className="rounded-xl"
              >
                🌐 {language === 'id' ? 'English' : 'Bahasa Indonesia'}
              </Button>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map(({ key, icon: Icon, title, color }) => {
              const section = data.recommendations[key as keyof typeof data.recommendations] as RegulationSection
              if (!section) return null

              return (
                <Card
                  key={key}
                  className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-6 w-6" style={{ color }} />
                      <span style={{ color }}>{title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Summary */}
                    {section.summary && (
                      <div className="bg-[#F0F9FF] rounded-2xl p-4 border-2 border-[#e0f2fe]">
                        <p className="text-[#0C4A6E] font-medium leading-relaxed">
                          {section.summary}
                        </p>
                      </div>
                    )}

                    {/* Key Points */}
                    {section.key_points && section.key_points.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-[#0C4A6E] mb-2">
                          {language === 'id' ? '📌 Poin Penting:' : '📌 Key Points:'}
                        </h4>
                        <ul className="space-y-2">
                          {section.key_points.map((point, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-[#0C4A6E]"
                            >
                              <span className="text-[#0284C7] font-bold">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Details */}
                    {section.details && (
                      <div className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                        {section.details}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
