"use client"

import { useEffect, useState, useCallback } from "react"
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
import {
  ArrowLeft,
  FileText,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  Trash2,
  Download,
  RefreshCw,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  FolderOpen,
  FileCheck,
  Target,
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
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const analysisId = params?.id as string

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const fetchProductData = async (productId: number) => {
    try {
      const response = await productService.get(productId)
      const productData = 'data' in response ? (response as { data: Product }).data : response
      setCurrentProduct(productData)
    } catch (err) {
      console.error('Failed to fetch product:', err)
    }
  }

  const fetchAnalysis = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await exportAnalysisService.get(analysisId)

      if (response && typeof response === 'object') {
        if ('success' in response && (response as { success: boolean; data: ExportAnalysis }).success) {
          const analysisData = (response as { success: boolean; data: ExportAnalysis }).data
          setAnalysis(analysisData)
          // Fetch product data
          const productId = analysisData?.product || analysisData?.product_id
          if (productId) {
            await fetchProductData(productId)
          }
        } else {
          setAnalysis(response as ExportAnalysis)
          // Fetch product data
          if ((response as ExportAnalysis)?.product || (response as ExportAnalysis)?.product_id) {
            await fetchProductData((response as ExportAnalysis).product || (response as ExportAnalysis).product_id!)
          }
        }
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }, [analysisId])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (analysisId) {
      fetchAnalysis()
    }
  }, [isAuthenticated, router, analysisId, fetchAnalysis])

  const handleReanalyze = async () => {
    if (!analysis) return

    try {
      setReanalyzing(true)
      const response = await exportAnalysisService.reanalyze(analysis.id)
      if (response.success && response.data) {
        setAnalysis(response.data || (response as unknown as { data: ExportAnalysis }).data)
        setReanalyzeModalOpen(false)
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      throw new Error(error.response?.data?.message || "Gagal re-analyze")
    } finally {
      setReanalyzing(false)
    }
  }

  const handleDelete = async () => {
    if (!analysis) return

    try {
      await exportAnalysisService.delete(analysis.id)
      router.push("/export-analysis")
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      throw new Error(error.response?.data?.message || "Gagal menghapus analisis")
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

          {/* Compliance Issues & Product Editor */}
          <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] lg:col-span-2 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
                Compliance Issues & Product Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isAdmin() && currentProduct ? (
                <div className="space-y-6">
                  {/* Compliance Issues sebagai catatan/panduan */}
                  {analysis.compliance_issues && analysis.compliance_issues.length > 0 && (
                    <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-2xl p-4">
                      <h4 className="font-bold text-[#92400E] mb-2 flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Catatan: {analysis.compliance_issues.length} Issues Ditemukan
                      </h4>
                      <p className="text-sm text-[#92400E] mb-3">
                        Gunakan daftar berikut sebagai panduan untuk mengedit atribut produk di bawah:
                      </p>
                      <ul className="space-y-1">
                        {analysis.compliance_issues.map((issue, index) => (
                          <li key={index} className="text-sm text-[#92400E] flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                            <span><strong>{issue.type}:</strong> {issue.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Full Product Editor */}
                  <InlineComplianceEditor
                    productId={getProductId()}
                    complianceIssues={analysis.compliance_issues || []}
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
                            <Badge variant={getSeverityBadgeVariant(issue.severity) as "outline" | "destructive" | "accent"}>
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
                  <div className="space-y-2">
                    {(() => {
                      // Parse recommendations into structured items
                      const lines = analysis.recommendations.split('\n')
                      const items: Array<{ title: string; details: string[]; problem?: string; solutions?: string[] }> = []
                      let currentItem: { title: string; details: string[]; problem?: string; solutions?: string[] } | null = null
                      let inProblemSection = false
                      let inSolutionSection = false

                      lines.forEach(line => {
                        // First clean the line
                        let cleanLine = line
                          .replace(/^#{1,6}\s+/, '')
                          .replace(/\*\*([^*]+)\*\*/g, '$1')
                          .replace(/\*([^*]+)\*/g, '$1')
                          .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
                          .replace(/`([^`]+)`/g, '$1')
                          .trim()

                        // Skip empty lines or lines with only bullets
                        if (!cleanLine || cleanLine === '•' || cleanLine === '-' || cleanLine === '--' || cleanLine === '–' || cleanLine === '—') return

                        // Check if it's a numbered item OR week/minggu format (main point)
                        const numberedMatch = cleanLine.match(/^(\d+)\.\s*(.+)/)
                        const weekMatch = cleanLine.match(/^(Minggu|Week)\s+(\d+)[-:]?\s*(.+)?/i)
                        
                        if (numberedMatch || weekMatch) {
                          if (currentItem) {
                            items.push(currentItem)
                          }
                          
                          if (weekMatch) {
                            // Week format - don't create accordion, just show as info card
                            const weekNum = weekMatch[2]
                            const weekTitle = weekMatch[3] || ''
                            currentItem = { 
                              title: `Minggu ${weekNum}${weekTitle ? ': ' + weekTitle : ''}`, 
                              details: [],
                              isWeek: true as any
                            }
                          } else {
                            currentItem = { title: numberedMatch[2], details: [] }
                          }
                          
                          inProblemSection = false
                          inSolutionSection = false
                          return
                        }

                        // Check for section markers
                        if (cleanLine.match(/^(Masalah|Problem)\s*:?\s*$/i)) {
                          inProblemSection = true
                          inSolutionSection = false
                          return
                        }
                        
                        if (cleanLine.match(/^(Langkah Konkret|Solusi|Solution|Langkah)\s*:?\s*$/i)) {
                          inProblemSection = false
                          inSolutionSection = true
                          if (currentItem && !currentItem.solutions) {
                            currentItem.solutions = []
                          }
                          return
                        }

                        // If we have a current item, add content based on section
                        if (currentItem) {
                          // Remove leading bullets/dashes
                          cleanLine = cleanLine.replace(/^[•\-–—*]+\s*/, '').trim()
                          
                          // Skip if empty after cleaning
                          if (!cleanLine) return
                          
                          // Categorize the content
                          if (inProblemSection) {
                            currentItem.problem = cleanLine
                          } else if (inSolutionSection) {
                            if (!currentItem.solutions) currentItem.solutions = []
                            currentItem.solutions.push(cleanLine)
                          } else {
                            currentItem.details.push(cleanLine)
                          }
                        }
                      })

                      // Push the last item
                      if (currentItem) {
                        items.push(currentItem)
                      }

                      return items.map((item, idx) => {
                        // Check if this is a week item (no accordion needed)
                        if ((item as any).isWeek) {
                          return (
                            <div key={idx} className="bg-gradient-to-r from-[#E0F2FE] to-[#BAE6FD] rounded-xl p-4 border-2 border-[#0284C7]">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0284C7] text-white font-bold text-sm">
                                  {idx + 1}
                                </div>
                                <span className="text-sm font-bold text-[#0C4A6E]">{item.title}</span>
                              </div>
                              {item.details.length > 0 && (
                                <div className="mt-3 ml-11 space-y-1">
                                  {item.details.map((detail, dIdx) => (
                                    <p key={dIdx} className="text-sm text-[#0C4A6E]">{detail}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        }

                        // Check if item has content (details, problem, or solutions)
                        const hasContent = (item.details && item.details.length > 0) || 
                                          item.problem || 
                                          (item.solutions && item.solutions.length > 0)

                        // If no content, show as info card instead of accordion
                        if (!hasContent) {
                          return (
                            <div key={idx} className="bg-[#F0F9FF] rounded-xl p-4 border-2 border-[#BAE6FD]">
                              <div className="flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0284C7] text-white font-bold text-sm flex-shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="text-sm font-bold text-[#0C4A6E]">{item.title}</span>
                              </div>
                            </div>
                          )
                        }

                        // Regular accordion item with content
                        return (
                        <div key={idx} className="bg-[#F0F9FF] rounded-xl border-2 border-[#BAE6FD] overflow-hidden">
                          <button
                            onClick={() => toggleItem(idx)}
                            className="w-full flex items-center justify-between gap-3 p-4 hover:bg-[#E0F2FE] transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 text-left">
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0284C7] text-white font-bold text-sm flex-shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-sm font-bold text-[#0C4A6E] uppercase">
                                {item.title}
                              </span>
                            </div>
                            {expandedItems.has(idx) ? (
                              <ChevronDown className="h-5 w-5 text-[#0284C7] flex-shrink-0" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-[#0284C7] flex-shrink-0" />
                            )}
                          </button>
                          {expandedItems.has(idx) && (item.details.length > 0 || item.problem || item.solutions) && (
                            <div className="px-4 pb-4 pt-2 bg-white border-t border-[#BAE6FD]">
                              {/* Show Problem Section if exists */}
                              {item.problem && (
                                <div className="mb-4 bg-[#FEE2E2] rounded-lg p-3 border-l-4 border-[#EF4444]">
                                  <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-5 w-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                                    <div>
                                      <p className="text-xs font-bold text-[#991B1B] uppercase mb-1">Masalah</p>
                                      <p className="text-sm text-[#991B1B] font-medium">{item.problem}</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Show Solutions Section if exists */}
                              {item.solutions && item.solutions.length > 0 && (
                                <div className="mb-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />
                                    <p className="text-xs font-bold text-[#0C4A6E] uppercase">Langkah Penyelesaian</p>
                                  </div>
                                  {(() => {
                                    // Check content type for solutions
                                    const hasTimeline = item.solutions.some(d => d.toLowerCase().includes('timeline') || d.toLowerCase().includes('bulan'))
                                    const hasBudget = item.solutions.some(d => d.toLowerCase().includes('budget') || d.toLowerCase().includes('rp'))
                                    const hasDocuments = item.solutions.some(d => d.toLowerCase().includes('certificate') || d.toLowerCase().includes('gacc') || d.toLowerCase().includes('gb standards'))
                                    
                                    if (hasTimeline && hasBudget) {
                                      return (
                                        <div className="grid gap-3 md:grid-cols-2">
                                          {item.solutions.map((detail, dIdx) => {
                                            const isTimeline = detail.toLowerCase().includes('timeline')
                                            const isBudget = detail.toLowerCase().includes('budget')
                                            
                                            if (isTimeline || isBudget) {
                                              const match = detail.match(/:\s*(.+)/)
                                              const value = match ? match[1] : detail
                                              
                                              return (
                                                <div key={dIdx} className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-xl p-4 border-2 border-[#F59E0B] shadow-sm">
                                                  <div className="flex items-start gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F59E0B] text-white flex-shrink-0">
                                                      {isTimeline ? <Clock className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />}
                                                    </div>
                                                    <div>
                                                      <p className="text-xs font-bold text-[#92400E] uppercase mb-1">
                                                        {isTimeline ? 'Timeline' : 'Budget Total'}
                                                      </p>
                                                      <p className="text-sm font-extrabold text-[#92400E]">{value}</p>
                                                    </div>
                                                  </div>
                                                </div>
                                              )
                                            }
                                            return null
                                          })}
                                        </div>
                                      )
                                    }
                                    
                                    if (hasDocuments) {
                                      return (
                                        <div className="grid gap-2 sm:grid-cols-2">
                                          {item.solutions.map((detail, dIdx) => {
                                            if (detail.toLowerCase().includes('folder digital') || detail.toLowerCase().includes('berikan copy') || detail.toLowerCase().includes('backup')) {
                                              return (
                                                <div key={dIdx} className="col-span-2 flex items-start gap-2 text-sm text-[#0C4A6E] leading-relaxed mb-2 font-medium">
                                                  <Info className="h-4 w-4 mt-0.5 text-[#0284C7] flex-shrink-0" />
                                                  <span>{detail}</span>
                                                </div>
                                              )
                                            }
                                            
                                            return (
                                              <div key={dIdx} className="bg-[#F0F9FF] rounded-lg p-3 border border-[#BAE6FD] hover:border-[#0284C7] transition-colors">
                                                <div className="flex items-start gap-2">
                                                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#22C55E] flex-shrink-0" />
                                                  <span className="text-xs text-[#0C4A6E] leading-relaxed font-medium">{detail}</span>
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      )
                                    }
                                    
                                    return (
                                      <ul className="space-y-2">
                                        {item.solutions.map((detail, dIdx) => {
                                          const isPriority = detail.toLowerCase().includes('prioritas') || detail.toLowerCase().includes('penting')
                                          
                                          if (isPriority) {
                                            return (
                                              <li key={dIdx} className="bg-gradient-to-r from-[#FEE2E2] to-[#FECACA] rounded-lg p-3 border-2 border-[#EF4444]">
                                                <div className="flex items-start gap-2">
                                                  <Target className="h-5 w-5 mt-0.5 text-[#DC2626] flex-shrink-0" />
                                                  <span className="text-sm text-[#991B1B] font-bold leading-relaxed">{detail}</span>
                                                </div>
                                              </li>
                                            )
                                          }
                                          
                                          return (
                                            <li key={dIdx} className="flex items-start gap-2 text-sm text-[#0C4A6E] leading-relaxed">
                                              <span className="text-[#22C55E] font-bold mt-0.5 flex-shrink-0">✓</span>
                                              <span>{detail}</span>
                                            </li>
                                          )
                                        })}
                                      </ul>
                                    )
                                  })()}
                                </div>
                              )}

                              {/* Show other details if no problem/solution structure */}
                              {!item.problem && !item.solutions && item.details.length > 0 && (
                                <ul className="space-y-2">
                                  {item.details.map((detail, dIdx) => (
                                    <li key={dIdx} className="flex items-start gap-2 text-sm text-[#0C4A6E] leading-relaxed">
                                      <span className="text-[#0284C7] font-bold mt-0.5 flex-shrink-0">•</span>
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      )
                      })
                    })()}
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


