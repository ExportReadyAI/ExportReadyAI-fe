"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { educationalService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  FileText, 
  Video, 
  Download,
  ExternalLink,
  AlertCircle,
  Rocket,
  Loader2,
  BookOpen
} from "lucide-react"
import type { EducationalArticle } from "@/lib/api/types"
import ReactMarkdown from "react-markdown"

export default function ArticleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string
  const { isAuthenticated } = useAuthStore()
  const [article, setArticle] = useState<EducationalArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (!isAuthenticated || !token) {
      router.push("/login")
      return
    }

    if (articleId) {
      fetchArticle()
    }
  }, [isAuthenticated, router, articleId])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await educationalService.articles.get(articleId)
      
      // Handle different response formats
      let articleData: EducationalArticle
      if ((response as any).success && (response as any).data) {
        articleData = (response as any).data
      } else {
        articleData = response as EducationalArticle
      }
      
      setArticle(articleData)
    } catch (err: any) {
      console.error("Error fetching article:", err)
      setError(err.response?.data?.message || "Gagal memuat artikel")
    } finally {
      setLoading(false)
    }
  }

  const getYouTubeEmbedUrl = (url: string) => {
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    const videoId = match && match[2].length === 11 ? match[2] : null
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`
    }
    
    // Try Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
    
    return null
  }

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
        <div className="container mx-auto px-8 py-8 max-w-4xl">
          {/* Back Button */}
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-6 text-[#0284C7] hover:text-[#0369a1] hover:bg-[#F0F9FF]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block h-12 w-12 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg font-bold text-[#0C4A6E]">Memuat artikel...</p>
            </div>
          )}

          {/* Error Display */}
          {error && !loading && (
            <Alert className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800 font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Article Content */}
          {!loading && !error && article && (
            <Card className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_6px_0_0_#bae6fd] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0284C7] to-[#0369a1] p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-white">
                    {article.title}
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#7DD3FC]">
                  <span>
                    Dibuat: {new Date(article.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  {article.updated_at !== article.created_at && (
                    <span>
                      Diperbarui: {new Date(article.updated_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Media Section - Video and File */}
                {(article.video_url || article.file_url) && (
                  <div className="space-y-4">
                    {/* Video */}
                    {article.video_url && (
                  <div className="rounded-2xl overflow-hidden border-2 border-[#e0f2fe] bg-[#F0F9FF] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Video className="h-5 w-5 text-[#F59E0B]" />
                      <h3 className="font-bold text-[#0C4A6E]">Video</h3>
                    </div>
                    {getYouTubeEmbedUrl(article.video_url) ? (
                      <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-xl">
                        <iframe
                          src={getYouTubeEmbedUrl(article.video_url)!}
                          className="absolute top-0 left-0 w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <a
                        href={article.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#0284C7] hover:text-[#0369a1] font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Buka video di tab baru
                      </a>
                    )}
                    </div>
                  )}

                    {/* File Download */}
                    {article.file_url && (
                      <div className="rounded-2xl border-2 border-[#e0f2fe] bg-[#F0F9FF] p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Download className="h-5 w-5 text-[#22C55E]" />
                            <div>
                              <h3 className="font-bold text-[#0C4A6E]">File Terlampir</h3>
                              <p className="text-sm text-[#7DD3FC]">
                                Unduh file pendukung artikel ini
                              </p>
                            </div>
                          </div>
                          <a
                            href={article.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#22C55E] hover:bg-[#16a34a] text-white font-bold shadow-[0_4px_0_0_#15803d] hover:shadow-[0_6px_0_0_#15803d] transition-all"
                          >
                            <Download className="h-4 w-4" />
                            Unduh
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Markdown Content */}
                <div className="prose prose-lg max-w-none">
                  <div className="markdown-content text-[#0C4A6E]">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-3xl font-extrabold text-[#0C4A6E] mb-4 mt-6" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-[#0284C7] mb-3 mt-5" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-bold text-[#0369a1] mb-2 mt-4" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                        li: ({node, ...props}) => <li className="ml-4" {...props} />,
                        a: ({node, ...props}) => <a className="text-[#0284C7] hover:text-[#0369a1] underline" target="_blank" rel="noopener noreferrer" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                        code: ({node, ...props}) => <code className="bg-[#F0F9FF] px-2 py-1 rounded text-sm font-mono text-[#0284C7]" {...props} />,
                      }}
                    >
                      {article.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

