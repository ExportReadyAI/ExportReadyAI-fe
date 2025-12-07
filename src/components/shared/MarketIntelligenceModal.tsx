"use client"

import { useEffect, useState } from "react"
import { productService } from "@/lib/api/services"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Globe,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Target,
  BarChart3,
  Lightbulb,
  Shield,
  ArrowRight,
  MapPin,
  RefreshCw,
  Truck,
  Star,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react"
import type { MarketIntelligence, RecommendedCountry, CountryToAvoid } from "@/lib/api/types"

interface MarketIntelligenceModalProps {
  productId: number | null
  productName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MarketIntelligenceModal({
  productId,
  productName,
  open,
  onOpenChange,
}: MarketIntelligenceModalProps) {
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<MarketIntelligence | null>(null)
  const [hasExisting, setHasExisting] = useState(false)

  useEffect(() => {
    if (open && productId) {
      fetchExistingData()
    }
  }, [open, productId])

  const fetchExistingData = async () => {
    if (!productId) return

    setLoading(true)
    setError(null)

    try {
      const response = await productService.getMarketIntelligence(productId)

      // Handle various response formats
      let intelligenceData: MarketIntelligence | null = null

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          intelligenceData = (response as any).data
        } else if ('product_id' in response) {
          intelligenceData = response as MarketIntelligence
        }
      }

      if (intelligenceData) {
        setData(intelligenceData)
        setHasExisting(true)
      } else {
        setData(null)
        setHasExisting(false)
      }
    } catch (err: any) {
      // 404 means no existing data, which is fine
      if (err.response?.status === 404) {
        setData(null)
        setHasExisting(false)
      } else {
        setError(err.response?.data?.message || "Gagal memuat data")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!productId) return

    setGenerating(true)
    setError(null)

    try {
      const response = await productService.createMarketIntelligence(productId)

      let intelligenceData: MarketIntelligence | null = null

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          intelligenceData = (response as any).data
        } else if ('product_id' in response) {
          intelligenceData = response as unknown as MarketIntelligence
        }
      }

      if (intelligenceData) {
        setData(intelligenceData)
        setHasExisting(true)
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError("Market intelligence sudah ada untuk produk ini. Silakan lihat hasil yang ada.")
        fetchExistingData()
      } else {
        setError(err.response?.data?.message || err.response?.data?.detail || "Gagal menghasilkan analisis")
      }
    } finally {
      setGenerating(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4" />
    if (score >= 60) return <Target className="h-4 w-4" />
    return <TrendingDown className="h-4 w-4" />
  }

  const handleClose = () => {
    onOpenChange(false)
    setData(null)
    setError(null)
    setHasExisting(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!max-w-[95vw] sm:!max-w-[95vw] !w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EC4899] shadow-[0_3px_0_0_#be185d]">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-[#0C4A6E]">Market Intelligence</span>
              <p className="text-sm font-medium text-[#0284C7] mt-0.5">{productName}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-[#EC4899]" />
              <p className="mt-4 text-[#0284C7] font-medium">Memuat data...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : !data && !hasExisting ? (
            /* Generate CTA */
            <div className="text-center py-8">
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-gradient-to-br from-[#EC4899] to-[#db2777] shadow-[0_6px_0_0_#be185d] mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0C4A6E] mb-2">
                Analisis Pasar dengan AI
              </h3>
              <p className="text-[#0284C7] font-medium mb-6 max-w-md mx-auto">
                Dapatkan rekomendasi negara tujuan ekspor, tren pasar, dan strategi masuk pasar yang optimal untuk produk Anda.
              </p>
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={generating}
                className="bg-[#EC4899] hover:bg-[#db2777] shadow-[0_4px_0_0_#be185d]"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    AI Sedang Menganalisis...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Dapatkan Insight Pasar
                  </>
                )}
              </Button>
            </div>
          ) : data ? (
            /* Results */
            <div className="space-y-6">
              {/* Recommended Countries */}
              <div className="bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] rounded-2xl border-2 border-[#bbf7d0] p-5">
                <h4 className="flex items-center gap-2 text-lg font-extrabold text-[#0C4A6E] mb-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Negara yang Direkomendasikan
                </h4>
                <div className="grid gap-6">
                  {data.recommended_countries?.map((country, index) => (
                    <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Country Info Card */}
                      <div className="lg:col-span-2 bg-white rounded-xl border-2 border-[#e0f2fe] p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F9FF] text-2xl">
                              <MapPin className="h-5 w-5 text-[#0284C7]" />
                            </div>
                            <div>
                              <h5 className="font-bold text-[#0C4A6E]">{country.country}</h5>
                              <Badge variant="outline" className="text-xs">
                                {country.country_code}
                              </Badge>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${getScoreColor(country.score)}`}>
                            {getScoreIcon(country.score)}
                            <span className="font-bold">{country.score}</span>
                          </div>
                        </div>
                        <p className="text-sm text-[#0284C7] mb-3">
                          {country.reason.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1')}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-[#7DD3FC]" />
                            <span className="text-[#0C4A6E]">Ukuran Pasar: <strong>{country.market_size}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-[#7DD3FC]" />
                            <span className="text-[#0C4A6E]">Kompetisi: <strong>{country.competition_level}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-[#7DD3FC]" />
                            <span className="text-[#0C4A6E]">Harga: <strong>{country.suggested_price_range}</strong></span>
                          </div>
                        </div>
                        {country.entry_strategy && (
                          <div className="mt-3 p-3 bg-[#F0F9FF] rounded-lg">
                            <p className="text-sm text-[#0284C7]">
                              <strong>Strategi Masuk:</strong> {country.entry_strategy.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1')}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Forwarder Recommendations Section */}
                      <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-[#6366F1] to-[#4f46e5] rounded-xl border-2 border-[#4338ca] p-4 shadow-[0_4px_0_0_#3730a3] h-full">
                          <div className="flex items-center gap-2 mb-3">
                            <Truck className="h-5 w-5 text-white" />
                            <h6 className="font-bold text-sm text-white">Forwarder Potensial</h6>
                          </div>
                          
                          {country.forwarders && country.forwarders.length > 0 ? (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                              {country.forwarders.map((forwarder) => (
                                <div
                                  key={forwarder.id}
                                  className="bg-white rounded-lg border border-white/20 p-3 hover:shadow-md transition-shadow"
                                >
                                  <div className="mb-2">
                                    <h6 className="font-bold text-sm text-[#0C4A6E] mb-1 line-clamp-1">{forwarder.company_name}</h6>
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-[#F59E0B] fill-[#F59E0B]" />
                                        <span className="text-xs font-bold text-[#0C4A6E]">
                                          {Number(forwarder.average_rating).toFixed(1)}
                                        </span>
                                      </div>
                                      <span className="text-xs text-[#7DD3FC]">
                                        ({forwarder.total_reviews} review{forwarder.total_reviews !== 1 ? 's' : ''})
                                      </span>
                                    </div>
                                    {forwarder.service_types && forwarder.service_types.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mb-2">
                                        {forwarder.service_types.slice(0, 2).map((service, idx) => (
                                          <Badge key={idx} variant="secondary" className="text-xs">
                                            {service}
                                          </Badge>
                                        ))}
                                        {forwarder.service_types.length > 2 && (
                                          <Badge variant="secondary" className="text-xs">
                                            +{forwarder.service_types.length - 2}
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {forwarder.contact_info && (
                                    <div className="space-y-1 text-xs text-[#0284C7] mb-2">
                                      {forwarder.contact_info.phone && (
                                        <div className="flex items-center gap-1">
                                          <Phone className="h-3 w-3" />
                                          <span className="truncate">{forwarder.contact_info.phone}</span>
                                        </div>
                                      )}
                                      {forwarder.contact_info.email && (
                                        <div className="flex items-center gap-1">
                                          <Mail className="h-3 w-3" />
                                          <span className="truncate text-[10px]">{forwarder.contact_info.email}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white h-7"
                                    onClick={() => window.open(`/forwarders/${forwarder.id}`, '_blank')}
                                  >
                                    <ExternalLink className="mr-1 h-3 w-3" />
                                    Lihat Profil
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-white/10 rounded-lg border border-white/20 p-4 text-center">
                              <Truck className="h-8 w-8 text-white/50 mx-auto mb-2" />
                              <p className="text-xs text-white/80 font-medium">
                                Belum ada forwarder yang direkomendasikan untuk rute ini
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Countries to Avoid */}
              {data.countries_to_avoid && data.countries_to_avoid.length > 0 && (
                <div className="bg-gradient-to-r from-[#fef2f2] to-[#fee2e2] rounded-2xl border-2 border-[#fecaca] p-5">
                  <h4 className="flex items-center gap-2 text-lg font-extrabold text-[#0C4A6E] mb-4">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Negara yang Tidak Direkomendasikan
                  </h4>
                  <div className="grid gap-3">
                    {data.countries_to_avoid.map((country, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl border border-[#fecaca] p-3 flex items-start gap-3"
                      >
                        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[#0C4A6E]">{country.country}</span>
                          <span className="text-[#7DD3FC] ml-2">({country.country_code})</span>
                          <p className="text-sm text-[#0284C7] mt-1">
                            {country.reason.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Market Trends */}
              {data.market_trends && data.market_trends.length > 0 && (
                <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-5">
                  <h4 className="flex items-center gap-2 text-lg font-extrabold text-[#0C4A6E] mb-4">
                    <TrendingUp className="h-5 w-5 text-[#0284C7]" />
                    Tren Pasar
                  </h4>
                  <ul className="space-y-2">
                    {data.market_trends.map((trend, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-[#7DD3FC] flex-shrink-0 mt-1" />
                        <span className="text-[#0C4A6E]">
                          {trend.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Competitive Landscape */}
              {data.competitive_landscape && (
                <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-5">
                  <h4 className="flex items-center gap-2 text-lg font-extrabold text-[#0C4A6E] mb-3">
                    <BarChart3 className="h-5 w-5 text-[#F59E0B]" />
                    Lanskap Kompetitif
                  </h4>
                  <div className="text-[#0284C7] leading-relaxed space-y-2">
                    {data.competitive_landscape.split('\n').map((line, idx) => {
                      const cleanLine = line
                        .replace(/#{1,6}\s/g, '')
                        .replace(/\*\*([^*]+)\*\*/g, '$1')
                        .replace(/\*([^*]+)\*/g, '$1')
                        .replace(/`([^`]+)`/g, '$1')
                        .replace(/^\s*[-*+]\s/g, '• ')
                        .trim()
                      if (!cleanLine) return null
                      return <p key={idx}>{cleanLine}</p>
                    }).filter(Boolean)}
                  </div>
                </div>
              )}

              {/* Growth Opportunities */}
              {data.growth_opportunities && data.growth_opportunities.length > 0 && (
                <div className="bg-gradient-to-r from-[#fffbeb] to-[#fef3c7] rounded-2xl border-2 border-[#fde68a] p-5">
                  <h4 className="flex items-center gap-2 text-lg font-extrabold text-[#0C4A6E] mb-4">
                    <Lightbulb className="h-5 w-5 text-[#F59E0B]" />
                    Peluang Pertumbuhan
                  </h4>
                  <ul className="space-y-2">
                    {data.growth_opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#F59E0B] flex-shrink-0 mt-1" />
                        <span className="text-[#0C4A6E]">
                          {opportunity.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risks and Challenges */}
              {data.risks_and_challenges && data.risks_and_challenges.length > 0 && (
                <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-5">
                  <h4 className="flex items-center gap-2 text-lg font-extrabold text-[#0C4A6E] mb-4">
                    <Shield className="h-5 w-5 text-[#6366F1]" />
                    Risiko & Tantangan
                  </h4>
                  <ul className="space-y-2">
                    {data.risks_and_challenges.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-[#6366F1] flex-shrink-0 mt-1" />
                        <span className="text-[#0C4A6E]">
                          {risk.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Overall Recommendation */}
              {data.overall_recommendation && (
                <div className="bg-gradient-to-r from-[#eff6ff] to-[#dbeafe] rounded-2xl border-2 border-[#bfdbfe] p-5">
                  <h4 className="flex items-center gap-2 text-lg font-extrabold text-[#0C4A6E] mb-3">
                    <Sparkles className="h-5 w-5 text-[#0284C7]" />
                    Rekomendasi AI
                  </h4>
                  <div className="text-[#0284C7] font-medium leading-relaxed space-y-2">
                    {data.overall_recommendation.split('\n').map((line, idx) => {
                      const cleanLine = line
                        .replace(/#{1,6}\s/g, '')
                        .replace(/\*\*([^*]+)\*\*/g, '$1')
                        .replace(/\*([^*]+)\*/g, '$1')
                        .replace(/`([^`]+)`/g, '$1')
                        .replace(/^\s*[-*+]\s/g, '• ')
                        .trim()
                      if (!cleanLine) return null
                      return <p key={idx}>{cleanLine}</p>
                    }).filter(Boolean)}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
