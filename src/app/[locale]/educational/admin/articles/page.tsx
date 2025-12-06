"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { educationalService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select } from "@/components/ui/select"
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  ArrowLeft,
  AlertCircle,
  Rocket,
  Loader2,
  Save,
  X,
  Upload,
  Video,
  Download
} from "lucide-react"
import type { EducationalArticle, EducationalModule } from "@/lib/api/types"

export default function AdminArticlesPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [articles, setArticles] = useState<EducationalArticle[]>([])
  const [modules, setModules] = useState<EducationalModule[]>([])
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<EducationalArticle | null>(null)
  const [formData, setFormData] = useState({
    module_id: 0,
    title: "",
    content: "",
    video_url: "",
    file_url: "",
    order_index: 0,
  })
  const [saving, setSaving] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string>("")

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

    fetchModules()
  }, [isAuthenticated, router, isAdmin])

  useEffect(() => {
    if (mounted && modules.length > 0) {
      if (selectedModuleId) {
        fetchArticles(selectedModuleId)
      } else {
        fetchAllArticles()
      }
    }
  }, [mounted, selectedModuleId, modules])

  const fetchModules = async () => {
    try {
      const response = await educationalService.modules.list({ limit: 100 })
      let modulesData: EducationalModule[] = []
      if (Array.isArray(response)) {
        modulesData = response
      } else if ((response as any).success && (response as any).data) {
        modulesData = (response as any).data
      } else if ((response as any).results) {
        modulesData = (response as any).results
      }
      modulesData.sort((a, b) => a.order_index - b.order_index)
      setModules(modulesData)
      if (modulesData.length > 0 && !selectedModuleId) {
        setSelectedModuleId(modulesData[0].id)
      }
    } catch (err: any) {
      console.error("Error fetching modules:", err)
    }
  }

  const fetchAllArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await educationalService.articles.list({ limit: 100 })
      
      let articlesData: EducationalArticle[] = []
      if (Array.isArray(response)) {
        articlesData = response
      } else if ((response as any).success && (response as any).data) {
        articlesData = (response as any).data
      } else if ((response as any).results) {
        articlesData = (response as any).results
      }
      
      articlesData.sort((a, b) => a.order_index - b.order_index)
      setArticles(articlesData)
    } catch (err: any) {
      console.error("Error fetching articles:", err)
      setError(err.response?.data?.message || "Gagal memuat artikel")
    } finally {
      setLoading(false)
    }
  }

  const fetchArticles = async (moduleId: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await educationalService.articles.list({ module_id: moduleId, limit: 100 })
      
      let articlesData: EducationalArticle[] = []
      if (Array.isArray(response)) {
        articlesData = response
      } else if ((response as any).success && (response as any).data) {
        articlesData = (response as any).data
      } else if ((response as any).results) {
        articlesData = (response as any).results
      }
      
      articlesData.sort((a, b) => a.order_index - b.order_index)
      setArticles(articlesData)
    } catch (err: any) {
      console.error("Error fetching articles:", err)
      setError(err.response?.data?.message || "Gagal memuat artikel")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingArticle(null)
    setSelectedFile(null)
    setSelectedFileName("")
    const moduleId = selectedModuleId || (modules.length > 0 ? modules[0].id : 0)
    const moduleArticles = articles.filter(a => a.module === moduleId)
    setFormData({
      module_id: moduleId,
      title: "",
      content: "",
      video_url: "",
      file_url: "",
      order_index: moduleArticles.length > 0 ? Math.max(...moduleArticles.map(a => a.order_index)) + 1 : 0,
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (article: EducationalArticle) => {
    setEditingArticle(article)
    setSelectedFile(null)
    setSelectedFileName("")
    setFormData({
      module_id: article.module,
      title: article.title,
      content: article.content,
      video_url: article.video_url || "",
      file_url: article.file_url || "",
      order_index: article.order_index,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError("Judul artikel harus diisi")
      return
    }
    if (!formData.content.trim()) {
      setError("Konten artikel harus diisi")
      return
    }
    if (!formData.module_id) {
      setError("Modul harus dipilih")
      return
    }

    try {
      setSaving(true)
      setError(null)

      const payload = {
        ...formData,
        video_url: formData.video_url.trim() || null,
        file_url: formData.file_url.trim() || null,
      }

      let articleId: number

      if (editingArticle) {
        await educationalService.articles.update(editingArticle.id, payload)
        articleId = editingArticle.id
      } else {
        const response = await educationalService.articles.create(payload)
        // Get the created article ID
        let createdArticle: EducationalArticle
        if ((response as any).success && (response as any).data) {
          createdArticle = (response as any).data
        } else {
          createdArticle = response as EducationalArticle
        }
        articleId = createdArticle.id
      }

      // If a file was selected during creation or editing, upload it
      if (selectedFile) {
        try {
          setUploadingFile(true)
          const uploadResponse = await educationalService.articles.uploadFile(articleId, selectedFile)
          
          // Update formData with the uploaded file URL
          if ((uploadResponse as any).success && (uploadResponse as any).data) {
            setFormData({ ...formData, file_url: (uploadResponse as any).data.file_url })
          } else {
            const uploadedArticle = uploadResponse as EducationalArticle
            setFormData({ ...formData, file_url: uploadedArticle.file_url || "" })
          }
        } catch (uploadErr: any) {
          console.error("Error uploading file:", uploadErr)
          setError(uploadErr.response?.data?.message || "Artikel berhasil dibuat tetapi gagal mengunggah file. Anda dapat mengunggah file nanti saat edit.")
        } finally {
          setUploadingFile(false)
        }
      }

      setIsDialogOpen(false)
      setSelectedFile(null)
      setSelectedFileName("")
      if (selectedModuleId) {
        fetchArticles(selectedModuleId)
      } else {
        fetchAllArticles()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan artikel")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      return
    }

    try {
      await educationalService.articles.delete(id)
      if (selectedModuleId) {
        fetchArticles(selectedModuleId)
      } else {
        fetchAllArticles()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menghapus artikel")
    }
  }

  const handleReorder = async (id: number, direction: "up" | "down") => {
    const filteredArticles = selectedModuleId 
      ? articles.filter(a => a.module === selectedModuleId)
      : articles
    
    const index = filteredArticles.findIndex(a => a.id === id)
    if (index === -1) return

    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= filteredArticles.length) return

    const newArticles = [...articles]
    const article1 = newArticles.find(a => a.id === id)!
    const article2 = newArticles.find(a => a.id === filteredArticles[newIndex].id)!

    const temp = article1.order_index
    article1.order_index = article2.order_index
    article2.order_index = temp

    // Optimistically update UI
    setArticles([...newArticles].sort((a, b) => a.order_index - b.order_index))

    try {
      await educationalService.articles.update(article1.id, {
        order_index: article1.order_index,
      })
      await educationalService.articles.update(article2.id, {
        order_index: article2.order_index,
      })
      if (selectedModuleId) {
        fetchArticles(selectedModuleId)
      } else {
        fetchAllArticles()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengubah urutan")
      if (selectedModuleId) {
        fetchArticles(selectedModuleId)
      } else {
        fetchAllArticles()
      }
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setSelectedFileName(file.name)

    // If editing an existing article, upload immediately
    if (editingArticle) {
      handleFileUpload(file)
    }
    // If creating new article, the file will be uploaded after article creation in handleSave
  }

  const handleFileUpload = async (file: File) => {
    if (!editingArticle) return

    try {
      setUploadingFile(true)
      setError(null)
      const response = await educationalService.articles.uploadFile(editingArticle.id, file)
      
      if ((response as any).success && (response as any).data) {
        setFormData({ ...formData, file_url: (response as any).data.file_url })
        setEditingArticle({ ...editingArticle, file_url: (response as any).data.file_url })
        setSelectedFile(null)
        setSelectedFileName("")
      } else {
        const article = response as EducationalArticle
        setFormData({ ...formData, file_url: article.file_url || "" })
        setEditingArticle({ ...editingArticle, file_url: article.file_url || "" })
        setSelectedFile(null)
        setSelectedFileName("")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengunggah file")
      setSelectedFile(null)
      setSelectedFileName("")
    } finally {
      setUploadingFile(false)
    }
  }

  const filteredArticles = selectedModuleId
    ? articles.filter(a => a.module === selectedModuleId)
    : articles

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
          <div className="mb-8 bg-gradient-to-r from-[#22C55E] to-[#16a34a] rounded-3xl p-8 shadow-[0_6px_0_0_#15803d] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Button
                  onClick={() => router.push("/educational/admin")}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
                <Button
                  onClick={handleOpenCreate}
                  className="bg-[#0284C7] hover:bg-[#0369a1] text-white font-bold shadow-[0_4px_0_0_#065985]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Artikel
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-[0_4px_0_0_#15803d]">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-white mb-1">
                    Kelola Artikel 📄
                  </h1>
                  <p className="text-[#D1FAE5] font-medium">
                    Buat, edit, dan atur urutan artikel edukasi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Module Filter */}
          <div className="mb-6">
            <Label className="text-[#0C4A6E] font-bold mb-2 block">
              Filter Modul
            </Label>
            <Select
              value={selectedModuleId?.toString() || "all"}
              onChange={(e) => {
                const value = e.target.value
                setSelectedModuleId(value === "all" ? null : parseInt(value))
              }}
              className="rounded-2xl border-2 border-[#e0f2fe]"
            >
              <option value="all">Semua Modul</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id.toString()}>
                  {module.title}
                </option>
              ))}
            </Select>
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
              <div className="inline-block h-12 w-12 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg font-bold text-[#0C4A6E]">Memuat artikel...</p>
            </div>
          )}

          {/* Articles List */}
          {!loading && (
            <div className="space-y-3">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article, index) => {
                  const moduleTitle = modules.find(m => m.id === article.module)?.title || "Unknown"
                  return (
                    <Card
                      key={article.id}
                      className="bg-white rounded-2xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#bae6fd] p-6"
                    >
                      <div className="flex items-center gap-4">
                        {/* Reorder Buttons */}
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReorder(article.id, "up")}
                            disabled={index === 0}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReorder(article.id, "down")}
                            disabled={index === filteredArticles.length - 1}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Article Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16a34a] shadow-[0_4px_0_0_#15803d]">
                              <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-extrabold text-[#0C4A6E]">
                                {article.title}
                              </h3>
                              <p className="text-xs text-[#7DD3FC] mt-1">
                                Modul: {moduleTitle}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-[#7DD3FC] ml-16">
                            <span>Urutan: {article.order_index}</span>
                            {article.video_url && (
                              <span className="flex items-center gap-1">
                                <Video className="h-3 w-3" />
                                Video
                              </span>
                            )}
                            {article.file_url && (
                              <span className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                File
                              </span>
                            )}
                            <span>
                              Dibuat: {new Date(article.created_at).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(article)}
                            className="border-[#22C55E] text-[#22C55E] hover:bg-[#D1FAE5]"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#bae6fd]">
                  <FileText className="h-16 w-16 text-[#7DD3FC] mx-auto mb-4" />
                  <h3 className="text-xl font-extrabold text-[#0C4A6E] mb-2">
                    Belum ada artikel
                  </h3>
                  <p className="text-[#7DD3FC] mb-4">
                    {selectedModuleId ? "Mulai dengan membuat artikel pertama dalam modul ini" : "Mulai dengan membuat artikel pertama Anda"}
                  </p>
                  <Button
                    onClick={handleOpenCreate}
                    className="bg-[#22C55E] hover:bg-[#16a34a] text-white font-bold"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Artikel
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-[#0C4A6E]">
              {editingArticle ? "Edit Artikel" : "Tambah Artikel Baru"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="module_id" className="text-[#0C4A6E] font-bold">
                  Modul <span className="text-red-500">*</span>
                </Label>
                <Select
                  id="module_id"
                  value={formData.module_id}
                  onChange={(e) => setFormData({ ...formData, module_id: parseInt(e.target.value) || 0 })}
                  className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                >
                  <option value="0">Pilih Modul</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.title}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="order_index" className="text-[#0C4A6E] font-bold">
                  Urutan Tampil
                </Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="title" className="text-[#0C4A6E] font-bold">
                Judul Artikel <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Regulasi dan Sertifikasi Jepang"
                className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-[#0C4A6E] font-bold">
                Konten (Markdown) <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={`# Judul\n\n## Subjudul\n\nKonten artikel dalam format Markdown...\n\n- List item 1\n- List item 2\n\n**Bold text** dan *italic text*`}
                rows={12}
                className="mt-2 rounded-2xl border-2 border-[#e0f2fe] font-mono text-sm"
              />
              <p className="text-xs text-[#7DD3FC] mt-1">
                Gunakan format Markdown: # untuk heading, ** untuk bold, * untuk italic, - untuk list
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="video_url" className="text-[#0C4A6E] font-bold">
                  Video URL (YouTube/Vimeo)
                </Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
                />
              </div>

              <div>
                <Label htmlFor="file_url" className="text-[#0C4A6E] font-bold">
                  File URL atau Unggah File
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="file_url"
                    value={formData.file_url}
                    onChange={(e) => {
                      setFormData({ ...formData, file_url: e.target.value })
                      // Clear selected file if user types URL manually
                      if (e.target.value.trim()) {
                        setSelectedFile(null)
                        setSelectedFileName("")
                      }
                    }}
                    placeholder="URL file atau unggah file"
                    className="flex-1 rounded-2xl border-2 border-[#e0f2fe]"
                    disabled={!!selectedFile}
                  />
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload-input"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                      disabled={uploadingFile}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingFile}
                      onClick={() => {
                        const fileInput = document.getElementById('file-upload-input') as HTMLInputElement
                        if (fileInput) {
                          fileInput.click()
                        }
                      }}
                      className="rounded-2xl border-2 border-[#22C55E] text-[#22C55E] hover:bg-[#D1FAE5] whitespace-nowrap"
                    >
                      {uploadingFile ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-1" />
                          {editingArticle ? "Unggah" : "Pilih File"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                {selectedFileName && !uploadingFile && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-[#22C55E] bg-[#D1FAE5] px-3 py-2 rounded-xl">
                    <FileText className="h-4 w-4" />
                    <span className="flex-1 truncate">{selectedFileName}</span>
                    {editingArticle ? (
                      <span className="text-xs">File akan diunggah saat disimpan</span>
                    ) : (
                      <span className="text-xs">File akan diunggah setelah artikel dibuat</span>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null)
                        setSelectedFileName("")
                      }}
                      className="h-6 w-6 p-0 text-[#22C55E] hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {formData.file_url && !selectedFile && (
                  <p className="text-xs text-[#7DD3FC] mt-1">
                    File URL saat ini: {formData.file_url}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="flex-1 rounded-2xl"
              >
                <X className="mr-2 h-4 w-4" />
                Batal
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !formData.title.trim() || !formData.content.trim() || !formData.module_id}
                className="flex-1 rounded-2xl bg-[#22C55E] hover:bg-[#16a34a] text-white font-bold"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

