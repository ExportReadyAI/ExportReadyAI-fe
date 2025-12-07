"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { exportAnalysisService, productService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "@/components/shared/CircularProgress"
import { DeleteAnalysisModal } from "@/components/shared/DeleteAnalysisModal"
import { ReanalyzeModal } from "@/components/shared/ReanalyzeModal"
import { ProductChangedAlert } from "@/components/shared/ProductChangedAlert"
import { InlineComplianceEditor } from "@/components/shared/InlineComplianceEditor"
import ReactMarkdown from "react-markdown"
import {
  ArrowLeft,
  FileText,
  Globe,
  Package,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  Trash2,
  Download,
  RefreshCw,
  BookOpen,
} from "lucide-react"
import type { ExportAnalysis, Product } from "@/lib/api/types"

export default function ExportAnalysisDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [analysis, setAnalysis] = useState<ExportAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [reanalyzeModalOpen, setReanalyzeModalOpen] = useState(false)
  const [reanalyzing, setReanalyzing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)

  const analysisId = params?.id as string

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (analysisId) {
      fetchAnalysis()
    }
  }, [isAuthenticated, router, analysisId])

  const fetchAnalysis = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await exportAnalysisService.get(analysisId)

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          const analysisData = (response as any).data
          setAnalysis(analysisData)
          // Fetch product data
          if (analysisData?.product || analysisData?.product_id) {
            await fetchProductData(analysisData.product || analysisData.product_id)
          }
        } else {
          setAnalysis(response as ExportAnalysis)
          // Fetch product data
          if ((response as ExportAnalysis)?.product || (response as ExportAnalysis)?.product_id) {
            await fetchProductData((response as ExportAnalysis).product || (response as ExportAnalysis).product_id!)
          }
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const fetchProductData = async (productId: number) => {
    try {
      const response = await productService.get(productId)
      const productData = 'data' in response ? (response as any).data : response
      setCurrentProduct(productData)
    } catch (err) {
      console.error('Failed to fetch product:', err)
    }
  }

  const handleReanalyze = async () => {
    if (!analysis) return

    try {
      setReanalyzing(true)
      const response = await exportAnalysisService.reanalyze(analysis.id)
      if (response.success && response.data) {
        setAnalysis((response.data as any) || response.data)
        setReanalyzeModalOpen(false)
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal re-analyze")
    } finally {
      setReanalyzing(false)
    }
  }

  const handleDelete = async () => {
    if (!analysis) return

    try {
      await exportAnalysisService.delete(analysis.id)
      router.push("/export-analysis")
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Gagal menghapus analisis")
    }
  }

  // Helper: Get product ID (support both field names)
  const getProductId = () => {
    return analysis?.product || analysis?.product_id || 0
  }

  const getScoreColor = (score: number) => {
    if (score < 50) return "#EF4444"
    if (score <= 75) return "#F59E0B"
    return "#22C55E"
  }

  const getScoreLabel = (score: number) => {
    if (score < 50) return "Not Ready"
    if (score <= 75) return "Need Improvement"
    return "Ready"
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
      case "major":
        return <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
      default:
        return <Info className="h-5 w-5 text-[#0284C7]" />
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "major":
        return "accent"
      default:
        return "outline"
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F9FF]">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#0284C7] shadow-[0_6px_0_0_#065985] animate-bounce">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-bold text-[#0C4A6E]">Memuat analisis...</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="flex h-screen bg-[#F0F9FF]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8">
            <Alert variant="destructive">
              <AlertDescription>
                {error || "Analisis tidak ditemukan"}
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    )
  }

  const scoreColor = getScoreColor(analysis.readiness_score)

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
              Kembali
            </button>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0284C7] shadow-[0_4px_0_0_#065985]">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                    {analysis.product_name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="h-4 w-4 text-[#0284C7]" />
                    <span className="text-[#0284C7] font-medium">
                      {analysis.country_name} ({analysis.target_country_code})
                    </span>
                  </div>
                </div>
              </div>
              {!isAdmin() && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/export-analysis/${analysis.id}/regulation-recommendations`)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Detail Rekomendasi
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setReanalyzeModalOpen(true)}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Re-analyze
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                  <Button variant="secondary">
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Product Changed Warning */}
          {analysis.product_changed && (
            <ProductChangedAlert
              productName={analysis.snapshot_product_name || analysis.product_name}
              onReanalyze={() => setReanalyzeModalOpen(true)}
              loading={reanalyzing}
            />
          )}

          {/* Score Section */}
          <div className="bg-linear-to-r from-[#0284C7] to-[#0369a1] rounded-3xl p-8 shadow-[0_6px_0_0_#064e7a] mb-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-extrabold text-white mb-2">
                  Readiness Score
                </h2>
                <p className="text-[#7DD3FC] font-medium mb-4">
                  {getScoreLabel(analysis.readiness_score)}
                </p>
                <Badge 
                  variant={analysis.status_grade === "Ready" ? "success" : analysis.status_grade === "Warning" ? "accent" : "destructive"}
                  className="text-base px-4 py-2"
                >
                  {analysis.status_grade}
                </Badge>
              </div>
              <CircularProgress
                value={analysis.readiness_score}
                size={160}
                strokeWidth={16}
                color={scoreColor}
                label={getScoreLabel(analysis.readiness_score)}
              />
            </div>
          </div>

          {/* Compliance Issues & Inline Editor */}
          <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
                Compliance Issues & Product Attributes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isAdmin() && analysis.compliance_issues && analysis.compliance_issues.length > 0 ? (
                <div className="space-y-6">
                  {/* Show issues summary */}
                  <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-2xl p-4">
                    <h4 className="font-bold text-[#92400E] mb-2">Found {analysis.compliance_issues.length} Issues:</h4>
                    <ul className="space-y-1">
                      {analysis.compliance_issues.map((issue, index) => (
                        <li key={index} className="text-sm text-[#92400E] flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                          <span><strong>{issue.type}:</strong> {issue.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Inline Editor */}
                  <InlineComplianceEditor
                    productId={getProductId()}
                    complianceIssues={analysis.compliance_issues}
                    currentProduct={currentProduct}
                    onSaveComplete={fetchAnalysis}
                  />
                </div>
              ) : analysis.compliance_issues && analysis.compliance_issues.length > 0 ? (
                <div className="space-y-3">
                  {analysis.compliance_issues.map((issue, index) => (
                    <div
                      key={index}
                      className="bg-[#F0F9FF] rounded-2xl p-4 border-2 border-[#e0f2fe]"
                    >
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getSeverityBadgeVariant(issue.severity) as any}>
                              {issue.severity}
                            </Badge>
                            <span className="text-sm font-bold text-[#0C4A6E]">
                              {issue.type}
                            </span>
                          </div>
                          <p className="text-sm text-[#0C4A6E] mb-2">
                            {issue.description}
                          </p>
                          {issue.your_value && issue.required_value && (
                            <>
                              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                <div className="bg-white rounded-xl p-2">
                                  <p className="font-bold text-[#7DD3FC]">Your Value</p>
                                  <p className="font-bold text-[#0C4A6E]">{issue.your_value}</p>
                                </div>
                                <div className="bg-white rounded-xl p-2">
                                  <p className="font-bold text-[#7DD3FC]">Required</p>
                                  <p className="font-bold text-[#0C4A6E]">{issue.required_value}</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-[#22C55E] mx-auto mb-3" />
                  <p className="font-bold text-[#0C4A6E]">Tidak Ada Issues!</p>
                  <p className="text-sm text-[#7DD3FC]">Produk memenuhi semua regulasi</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-1">

            {/* Recommendations */}
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#F59E0B]" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.recommendations ? (
                  <div className="bg-[#F0F9FF] rounded-2xl p-4">
                    <div className="prose prose-sm max-w-none text-[#0C4A6E]">
                      <ReactMarkdown
                        components={{
                          h1: ({...props}) => <h1 className="text-xl font-bold text-[#0C4A6E] mb-3" {...props} />,
                          h2: ({...props}) => <h2 className="text-lg font-bold text-[#0C4A6E] mb-2" {...props} />,
                          h3: ({...props}) => <h3 className="text-base font-bold text-[#0284C7] mb-2" {...props} />,
                          p: ({...props}) => <p className="text-sm text-[#0C4A6E] mb-2 leading-relaxed" {...props} />,
                          ul: ({...props}) => <ul className="list-disc list-inside space-y-1 mb-3" {...props} />,
                          ol: ({...props}) => <ol className="list-decimal list-inside space-y-1 mb-3" {...props} />,
                          li: ({...props}) => <li className="text-sm text-[#0C4A6E] font-medium" {...props} />,
                          strong: ({...props}) => <strong className="font-bold text-[#0369a1]" {...props} />,
                          em: ({...props}) => <em className="italic text-[#0284C7]" {...props} />,
                          code: ({...props}) => <code className="bg-[#E0F2FE] px-2 py-1 rounded text-xs font-mono text-[#0C4A6E]" {...props} />,
                          blockquote: ({...props}) => <blockquote className="border-l-4 border-[#0284C7] pl-4 italic text-[#64748b]" {...props} />,
                        }}
                      >
                        {analysis.recommendations}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#7DD3FC]">Tidak ada rekomendasi</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Metadata */}
          <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] mt-6">
            <CardContent className="p-6">
              <p className="text-sm text-[#7DD3FC]">
                Dianalisis pada: {new Date(analysis.analyzed_at).toLocaleString("id-ID")}
              </p>
            </CardContent>
          </Card>

          <DeleteAnalysisModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onConfirm={handleDelete}
            productName={analysis.product_name}
            countryName={analysis.country_name}
          />

          <ReanalyzeModal
            open={reanalyzeModalOpen}
            onOpenChange={setReanalyzeModalOpen}
            onConfirm={handleReanalyze}
            productName={analysis.product_name}
            countryName={analysis.country_name}
          />
        </div>
      </main>
    </div>
  )
}


