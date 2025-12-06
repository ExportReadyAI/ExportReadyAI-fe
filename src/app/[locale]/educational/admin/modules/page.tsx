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
import { 
  BookOpen, 
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
  X
} from "lucide-react"
import type { EducationalModule } from "@/lib/api/types"

export default function AdminModulesPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [modules, setModules] = useState<EducationalModule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<EducationalModule | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order_index: 0,
  })
  const [saving, setSaving] = useState(false)

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

  const fetchModules = async () => {
    try {
      setLoading(true)
      setError(null)
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
    } catch (err: any) {
      console.error("Error fetching modules:", err)
      setError(err.response?.data?.message || "Gagal memuat modul")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingModule(null)
    setFormData({
      title: "",
      description: "",
      order_index: modules.length > 0 ? Math.max(...modules.map(m => m.order_index)) + 1 : 0,
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (module: EducationalModule) => {
    setEditingModule(module)
    setFormData({
      title: module.title,
      description: module.description || "",
      order_index: module.order_index,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError("Judul modul harus diisi")
      return
    }

    try {
      setSaving(true)
      setError(null)

      if (editingModule) {
        await educationalService.modules.update(editingModule.id, formData)
      } else {
        await educationalService.modules.create(formData)
      }

      setIsDialogOpen(false)
      fetchModules()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan modul")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus modul ini? Semua artikel dalam modul ini juga akan dihapus.")) {
      return
    }

    try {
      await educationalService.modules.delete(id)
      fetchModules()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menghapus modul")
    }
  }

  const handleReorder = async (id: number, direction: "up" | "down") => {
    const index = modules.findIndex(m => m.id === id)
    if (index === -1) return

    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= modules.length) return

    const newModules = [...modules]
    const temp = newModules[index].order_index
    newModules[index].order_index = newModules[newIndex].order_index
    newModules[newIndex].order_index = temp

    // Optimistically update UI
    setModules([...newModules].sort((a, b) => a.order_index - b.order_index))

    try {
      // Update both modules
      await educationalService.modules.update(newModules[index].id, {
        order_index: newModules[index].order_index,
      })
      await educationalService.modules.update(newModules[newIndex].id, {
        order_index: newModules[newIndex].order_index,
      })
      fetchModules() // Refresh to ensure consistency
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengubah urutan")
      fetchModules() // Revert on error
    }
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
        <div className="container mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8 bg-gradient-to-r from-[#0284C7] to-[#0369a1] rounded-3xl p-8 shadow-[0_6px_0_0_#064e7a] relative overflow-hidden">
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
                  className="bg-[#22C55E] hover:bg-[#16a34a] text-white font-bold shadow-[0_4px_0_0_#15803d]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Modul
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-[0_4px_0_0_#065985]">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-white mb-1">
                    Kelola Modul 📚
                  </h1>
                  <p className="text-[#7DD3FC] font-medium">
                    Buat, edit, dan atur urutan modul edukasi
                  </p>
                </div>
              </div>
            </div>
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
              <div className="inline-block h-12 w-12 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg font-bold text-[#0C4A6E]">Memuat modul...</p>
            </div>
          )}

          {/* Modules List */}
          {!loading && (
            <div className="space-y-3">
              {modules.length > 0 ? (
                modules.map((module, index) => (
                  <Card
                    key={module.id}
                    className="bg-white rounded-2xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#bae6fd] p-6"
                  >
                    <div className="flex items-center gap-4">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorder(module.id, "up")}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorder(module.id, "down")}
                          disabled={index === modules.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Module Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369a1] shadow-[0_4px_0_0_#065985]">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-extrabold text-[#0C4A6E]">
                              {module.title}
                            </h3>
                            {module.description && (
                              <p className="text-sm text-[#7DD3FC] mt-1">
                                {module.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#7DD3FC] ml-16">
                          <span>Urutan: {module.order_index}</span>
                          <span>Artikel: {module.article_count || 0}</span>
                          <span>
                            Dibuat: {new Date(module.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(module)}
                          className="border-[#0284C7] text-[#0284C7] hover:bg-[#F0F9FF]"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(module.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#bae6fd]">
                  <BookOpen className="h-16 w-16 text-[#7DD3FC] mx-auto mb-4" />
                  <h3 className="text-xl font-extrabold text-[#0C4A6E] mb-2">
                    Belum ada modul
                  </h3>
                  <p className="text-[#7DD3FC] mb-4">
                    Mulai dengan membuat modul pertama Anda
                  </p>
                  <Button
                    onClick={handleOpenCreate}
                    className="bg-[#22C55E] hover:bg-[#16a34a] text-white font-bold"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Modul
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-[#0C4A6E]">
              {editingModule ? "Edit Modul" : "Tambah Modul Baru"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title" className="text-[#0C4A6E] font-bold">
                Judul Modul <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Panduan Ekspor ke Jepang"
                className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-[#0C4A6E] font-bold">
                Deskripsi
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi singkat tentang modul ini..."
                rows={3}
                className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
              />
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
              <p className="text-xs text-[#7DD3FC] mt-1">
                Angka lebih kecil akan muncul lebih dulu
              </p>
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
                disabled={saving || !formData.title.trim()}
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

