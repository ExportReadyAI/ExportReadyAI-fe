"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Globe, FileText, Loader2 } from "lucide-react"
import { countryService } from "@/lib/api/services"
import type { CountryDetail } from "@/lib/api/types"

interface CountryDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  countryCode: string | null
}

export function CountryDetailModal({
  open,
  onOpenChange,
  countryCode,
}: CountryDetailModalProps) {
  const [country, setCountry] = useState<CountryDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && countryCode) {
      fetchCountry()
    } else {
      setCountry(null)
      setError(null)
    }
  }, [open, countryCode])

  const fetchCountry = async () => {
    if (!countryCode) return

    try {
      setLoading(true)
      setError(null)
      const response = await countryService.get(countryCode)

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          setCountry((response as any).data)
        } else {
          setCountry(response as CountryDetail)
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white max-h-[85vh] overflow-y-auto">
        <DialogClose onClose={() => onOpenChange(false)} />
        
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22C55E] shadow-[0_4px_0_0_#16a34a]">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              {country ? (
                <>
                  <div>{country.country_name}</div>
                  <div className="text-base font-medium text-[#0284C7]">
                    {country.country_code} • {country.region}
                  </div>
                </>
              ) : (
                "Detail Negara"
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="h-8 w-8 mx-auto text-[#0284C7] animate-spin mb-3" />
            <p className="text-lg font-bold text-[#0C4A6E]">Memuat data...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : country ? (
          <div className="space-y-4">
            {/* Country Info */}
            <div className="bg-[#F0F9FF] rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-bold text-[#7DD3FC] uppercase mb-1">Kode Negara</p>
                  <p className="font-bold text-[#0C4A6E]">{country.country_code}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#7DD3FC] uppercase mb-1">Region</p>
                  <p className="font-bold text-[#0C4A6E]">{country.region}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-bold text-[#7DD3FC] uppercase mb-1">Total Regulasi</p>
                  <p className="font-bold text-[#0C4A6E]">{country.regulations?.length || 0} regulasi</p>
                </div>
              </div>
            </div>

            {/* Regulations by Category */}
            {country.regulations_by_category && Object.keys(country.regulations_by_category).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(country.regulations_by_category).map(([category, regulations]) => (
                  <div key={category} className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4">
                    <h4 className="font-extrabold text-[#0C4A6E] mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#0284C7]" />
                      {category}
                      <Badge variant="secondary" className="ml-auto">
                        {regulations.length}
                      </Badge>
                    </h4>
                    <div className="space-y-3">
                      {regulations.map((regulation) => (
                        <div
                          key={regulation.id}
                          className="bg-[#F0F9FF] rounded-xl p-3 border border-[#e0f2fe]"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-bold text-[#0C4A6E] text-sm">
                              {regulation.rule_key}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {regulation.rule_value}
                            </Badge>
                          </div>
                          {regulation.description && (
                            <p className="text-sm text-[#0284C7]">
                              {regulation.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert variant="default">
                <AlertDescription>
                  Tidak ada regulasi tersedia untuk negara ini.
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}


