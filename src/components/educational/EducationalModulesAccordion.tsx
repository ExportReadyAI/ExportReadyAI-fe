"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { educationalService } from "@/lib/api/services"
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  FileText,
  Video,
  Download,
  ExternalLink,
  Loader2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { EducationalModule, EducationalArticle } from "@/lib/api/types"

interface EducationalModulesAccordionProps {
  modules: EducationalModule[]
  maxModules?: number
  showViewAll?: boolean
  onViewAll?: () => void
}

export function EducationalModulesAccordion({
  modules,
  maxModules = 3,
  showViewAll = true,
  onViewAll,
}: EducationalModulesAccordionProps) {
  const router = useRouter()
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set())
  const [loadingArticles, setLoadingArticles] = useState<Set<number>>(new Set())
  const [modulesWithArticles, setModulesWithArticles] = useState<Map<number, EducationalArticle[]>>(new Map())
  
  const displayedModules = modules.slice(0, maxModules)
  const hasMore = modules.length > maxModules

  const fetchModuleArticles = async (moduleId: number) => {
    // If articles already loaded, skip
    if (modulesWithArticles.has(moduleId)) {
      return
    }

    setLoadingArticles((prev) => new Set(prev).add(moduleId))
    try {
      const response = await educationalService.modules.get(moduleId)
      let moduleData: EducationalModule
      if ((response as any).success && (response as any).data) {
        moduleData = (response as any).data
      } else {
        moduleData = response as EducationalModule
      }
      
      if (moduleData.articles) {
        setModulesWithArticles((prev) => {
          const newMap = new Map(prev)
          newMap.set(moduleId, moduleData.articles!)
          return newMap
        })
      }
    } catch (err) {
      console.error("Error fetching module articles:", err)
    } finally {
      setLoadingArticles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(moduleId)
        return newSet
      })
    }
  }

  const toggleModule = async (moduleId: number) => {
    const isExpanding = !expandedModules.has(moduleId)
    
    setExpandedModules((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })

    // Fetch articles when expanding
    if (isExpanding) {
      const module = modules.find(m => m.id === moduleId)
      // Only fetch if articles not already loaded
      if (module && (!module.articles || module.articles.length === 0)) {
        await fetchModuleArticles(moduleId)
      }
    }
  }

  const getModuleArticles = (moduleId: number): EducationalArticle[] => {
    // Check if we have articles from fetch
    if (modulesWithArticles.has(moduleId)) {
      return modulesWithArticles.get(moduleId)!
    }
    // Otherwise use articles from module prop
    const module = modules.find(m => m.id === moduleId)
    return module?.articles || []
  }

  const handleArticleClick = (articleId: number) => {
    router.push(`/educational/articles/${articleId}`)
  }

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll()
    } else {
      router.push("/educational")
    }
  }

  if (modules.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {displayedModules.map((module) => {
        const isExpanded = expandedModules.has(module.id)
        const articles = getModuleArticles(module.id)
        const sortedArticles = [...articles].sort((a, b) => a.order_index - b.order_index)
        const isLoading = loadingArticles.has(module.id)

        return (
          <Card
            key={module.id}
            className="bg-white rounded-2xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#bae6fd] overflow-hidden transition-all hover:shadow-[0_6px_0_0_#7dd3fc]"
          >
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F0F9FF]/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369a1] shadow-[0_4px_0_0_#065985]">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-extrabold text-[#0C4A6E] mb-1">
                    {module.title}
                  </h3>
                  {module.description && (
                    <p className="text-sm text-[#0284C7]/70 line-clamp-1">
                      {module.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-medium text-[#7DD3FC] bg-[#F0F9FF] px-2 py-1 rounded-lg">
                      {module.article_count || articles.length} artikel
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-[#0284C7]" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-[#0284C7]" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t-2 border-[#e0f2fe] bg-[#F0F9FF]/30">
                <div className="p-4 space-y-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-[#0284C7] animate-spin mr-2" />
                      <span className="text-sm text-[#7DD3FC]">Memuat artikel...</span>
                    </div>
                  ) : sortedArticles.length > 0 ? (
                    sortedArticles.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => handleArticleClick(article.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-[#e0f2fe] bg-white hover:bg-[#F0F9FF] hover:border-[#0284C7] transition-all text-left group"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0284C7]/10 group-hover:bg-[#0284C7]/20 transition-colors">
                          <FileText className="h-5 w-5 text-[#0284C7]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#0C4A6E] text-sm mb-1 truncate">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            {article.video_url && (
                              <span className="inline-flex items-center gap-1 text-xs text-[#F59E0B] bg-[#FEF3C7] px-2 py-0.5 rounded">
                                <Video className="h-3 w-3" />
                                Video
                              </span>
                            )}
                            {article.file_url && (
                              <span className="inline-flex items-center gap-1 text-xs text-[#22C55E] bg-[#D1FAE5] px-2 py-0.5 rounded">
                                <Download className="h-3 w-3" />
                                File
                              </span>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-[#7DD3FC] group-hover:text-[#0284C7] transition-colors flex-shrink-0" />
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-[#7DD3FC]">
                      Belum ada artikel dalam modul ini
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        )
      })}

      {hasMore && showViewAll && (
        <div className="pt-2">
          <Button
            onClick={handleViewAll}
            className="w-full rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#0284C7] text-white font-bold shadow-[0_4px_0_0_#065985] hover:shadow-[0_6px_0_0_#065985] transition-all"
          >
            Lihat Lainnya ({modules.length - maxModules} modul lainnya)
          </Button>
        </div>
      )}
    </div>
  )
}

