"use client"

import { useState, useEffect } from "react"
import { catalogService } from "@/lib/api/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  Loader2,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  Check,
  Tag,
} from "lucide-react"
import type { VariantType, VariantOption, PredefinedVariantType, VariantTypeCode } from "@/lib/api/types"

interface CatalogVariantsManagerProps {
  catalogId: number
  variantTypes?: VariantType[]
  onUpdate: () => void
}

const DEFAULT_PREDEFINED_TYPES: PredefinedVariantType[] = [
  { code: 'color', label: 'Warna' },
  { code: 'size', label: 'Ukuran' },
  { code: 'material', label: 'Bahan' },
  { code: 'flavor', label: 'Rasa' },
  { code: 'weight', label: 'Berat' },
  { code: 'style', label: 'Gaya' },
  { code: 'pattern', label: 'Motif' },
  { code: 'custom', label: 'Lainnya' },
]

export function CatalogVariantsManager({
  catalogId,
  variantTypes: initialVariantTypes,
  onUpdate,
}: CatalogVariantsManagerProps) {
  const [variantTypes, setVariantTypes] = useState<VariantType[]>(initialVariantTypes || [])
  const [predefinedTypes, setPredefinedTypes] = useState<PredefinedVariantType[]>(DEFAULT_PREDEFINED_TYPES)
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [expandedTypes, setExpandedTypes] = useState<Set<number>>(new Set())

  // Form state for adding type
  const [selectedTypeCode, setSelectedTypeCode] = useState<VariantTypeCode>('custom')
  const [customTypeName, setCustomTypeName] = useState("")
  const [initialOptions, setInitialOptions] = useState<string[]>([''])

  // State for adding option to existing type
  const [addingOptionTo, setAddingOptionTo] = useState<number | null>(null)
  const [newOptionName, setNewOptionName] = useState("")
  const [savingOption, setSavingOption] = useState(false)

  // State for editing type
  const [editingType, setEditingType] = useState<number | null>(null)
  const [editTypeName, setEditTypeName] = useState("")

  // State for deleting
  const [deletingType, setDeletingType] = useState<number | null>(null)
  const [deletingOption, setDeletingOption] = useState<{ typeId: number; optionId: number } | null>(null)

  useEffect(() => {
    fetchVariantTypes()
  }, [catalogId])

  const fetchVariantTypes = async () => {
    try {
      setLoading(true)
      const response = await catalogService.listVariantTypes(catalogId)

      if (response && typeof response === 'object') {
        if ('success' in response && (response as any).success) {
          setVariantTypes((response as any).data || [])
          if ((response as any).predefined_types) {
            setPredefinedTypes((response as any).predefined_types)
          }
        } else if ('data' in response) {
          setVariantTypes((response as any).data || [])
          if ((response as any).predefined_types) {
            setPredefinedTypes((response as any).predefined_types)
          }
        } else if (Array.isArray(response)) {
          setVariantTypes(response)
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch variant types:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (typeId: number) => {
    const newExpanded = new Set(expandedTypes)
    if (newExpanded.has(typeId)) {
      newExpanded.delete(typeId)
    } else {
      newExpanded.add(typeId)
    }
    setExpandedTypes(newExpanded)
  }

  const resetAddForm = () => {
    setSelectedTypeCode('custom')
    setCustomTypeName("")
    setInitialOptions([''])
    setShowAddForm(false)
  }

  const getTypeName = (): string => {
    if (selectedTypeCode === 'custom') {
      return customTypeName.trim()
    }
    const predefined = predefinedTypes.find(t => t.code === selectedTypeCode)
    return predefined?.label || customTypeName.trim()
  }

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault()

    const typeName = getTypeName()
    if (!typeName) {
      setError("Nama jenis varian harus diisi")
      return
    }

    const validOptions = initialOptions.filter(opt => opt.trim())
    if (validOptions.length === 0) {
      setError("Tambahkan minimal 1 pilihan varian")
      return
    }

    try {
      setAdding(true)
      setError(null)

      await catalogService.addVariantType(catalogId, {
        type_code: selectedTypeCode,
        type_name: typeName,
        options: validOptions.map(opt => ({ option_name: opt.trim() }))
      })

      resetAddForm()
      fetchVariantTypes()
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.detail || "Gagal menambah jenis varian")
    } finally {
      setAdding(false)
    }
  }

  const handleAddOption = async (typeId: number) => {
    if (!newOptionName.trim()) {
      setError("Nama pilihan harus diisi")
      return
    }

    try {
      setSavingOption(true)
      setError(null)

      await catalogService.addVariantOption(catalogId, typeId, {
        option_name: newOptionName.trim()
      })

      setNewOptionName("")
      setAddingOptionTo(null)
      fetchVariantTypes()
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menambah pilihan")
    } finally {
      setSavingOption(false)
    }
  }

  const handleDeleteType = async (typeId: number) => {
    if (!confirm("Hapus jenis varian ini beserta semua pilihannya?")) return

    try {
      setDeletingType(typeId)
      setError(null)

      await catalogService.deleteVariantType(catalogId, typeId)
      fetchVariantTypes()
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menghapus jenis varian")
    } finally {
      setDeletingType(null)
    }
  }

  const handleDeleteOption = async (typeId: number, optionId: number) => {
    if (!confirm("Hapus pilihan varian ini?")) return

    try {
      setDeletingOption({ typeId, optionId })
      setError(null)

      await catalogService.deleteVariantOption(catalogId, typeId, optionId)
      fetchVariantTypes()
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menghapus pilihan")
    } finally {
      setDeletingOption(null)
    }
  }

  const handleToggleOptionAvailability = async (typeId: number, option: VariantOption) => {
    try {
      await catalogService.updateVariantOption(catalogId, typeId, option.id, {
        is_available: !option.is_available
      })
      fetchVariantTypes()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengubah status pilihan")
    }
  }

  const handleUpdateTypeName = async (typeId: number) => {
    if (!editTypeName.trim()) {
      setError("Nama jenis varian harus diisi")
      return
    }

    try {
      setError(null)
      await catalogService.updateVariantType(catalogId, typeId, {
        type_name: editTypeName.trim()
      })
      setEditingType(null)
      fetchVariantTypes()
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengubah nama")
    }
  }

  const addOptionField = () => {
    setInitialOptions([...initialOptions, ''])
  }

  const removeOptionField = (index: number) => {
    if (initialOptions.length > 1) {
      setInitialOptions(initialOptions.filter((_, i) => i !== index))
    }
  }

  const updateOptionField = (index: number, value: string) => {
    const newOptions = [...initialOptions]
    newOptions[index] = value
    setInitialOptions(newOptions)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#22C55E]" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add Variant Type Button/Form */}
      {!showAddForm ? (
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-[#22C55E] hover:bg-[#16a34a] shadow-[0_4px_0_0_#15803d]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Jenis Varian
        </Button>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-[#0C4A6E] flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#22C55E]" />
              Tambah Jenis Varian
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetAddForm}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleAddType} className="space-y-4">
            {/* Type Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-[#0C4A6E] font-bold">Jenis Varian *</Label>
                <Select
                  value={selectedTypeCode}
                  onChange={(e) => setSelectedTypeCode(e.target.value as VariantTypeCode)}
                  className="mt-2"
                >
                  {predefinedTypes.map((type) => (
                    <option key={type.code} value={type.code}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>
              {selectedTypeCode === 'custom' && (
                <div>
                  <Label className="text-[#0C4A6E] font-bold">Nama Jenis *</Label>
                  <Input
                    value={customTypeName}
                    onChange={(e) => setCustomTypeName(e.target.value)}
                    placeholder="Contoh: Kapasitas, Ukuran Layar"
                    className="mt-2"
                    required={selectedTypeCode === 'custom'}
                  />
                </div>
              )}
            </div>

            {/* Options */}
            <div>
              <Label className="text-[#0C4A6E] font-bold mb-2 block">Pilihan Varian *</Label>
              <p className="text-xs text-[#7DD3FC] mb-3">
                Tambahkan pilihan yang tersedia untuk jenis varian ini
              </p>
              <div className="space-y-2">
                {initialOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOptionField(index, e.target.value)}
                      placeholder={`Pilihan ${index + 1}`}
                      className="flex-1"
                    />
                    {initialOptions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOptionField(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOptionField}
                className="mt-2"
              >
                <Plus className="mr-1 h-4 w-4" />
                Tambah Pilihan
              </Button>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={adding} className="bg-[#22C55E] hover:bg-[#16a34a]">
                {adding ? (
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
              <Button type="button" variant="outline" onClick={resetAddForm}>
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Variant Types List */}
      {variantTypes.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-[#e0f2fe] p-12 text-center">
          <Layers className="h-12 w-12 text-[#7DD3FC] mx-auto mb-4" />
          <p className="text-[#0284C7] font-medium">Belum ada varian</p>
          <p className="text-sm text-[#7DD3FC]">
            Tambahkan jenis varian seperti Warna, Ukuran, dll
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {variantTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white rounded-2xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe] overflow-hidden"
            >
              {/* Type Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F0F9FF] transition-colors"
                onClick={() => toggleExpand(type.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16a34a]">
                    <Tag className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    {editingType === type.id ? (
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editTypeName}
                          onChange={(e) => setEditTypeName(e.target.value)}
                          className="h-8 w-40"
                          autoFocus
                        />
                        <Button size="sm" onClick={() => handleUpdateTypeName(type.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingType(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-bold text-[#0C4A6E]">{type.type_name}</h4>
                        <p className="text-xs text-[#7DD3FC]">
                          {type.options.length} pilihan
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingType(type.id)
                      setEditTypeName(type.type_name)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteType(type.id)
                    }}
                    disabled={deletingType === type.id}
                  >
                    {deletingType === type.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                  {expandedTypes.has(type.id) ? (
                    <ChevronUp className="h-5 w-5 text-[#7DD3FC]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#7DD3FC]" />
                  )}
                </div>
              </div>

              {/* Options List */}
              {expandedTypes.has(type.id) && (
                <div className="border-t border-[#e0f2fe] p-4 bg-[#F8FCFF]">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {type.options.map((option) => (
                      <div
                        key={option.id}
                        className={`group flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                          option.is_available
                            ? 'bg-white border-[#22C55E] text-[#0C4A6E]'
                            : 'bg-gray-100 border-gray-300 text-gray-400 line-through'
                        }`}
                      >
                        <button
                          onClick={() => handleToggleOptionAvailability(type.id, option)}
                          className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors ${
                            option.is_available
                              ? 'bg-[#22C55E] border-[#22C55E] text-white'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {option.is_available && <Check className="h-3 w-3" />}
                        </button>
                        <span className="font-medium">{option.option_name}</span>
                        <button
                          onClick={() => handleDeleteOption(type.id, option.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                          disabled={deletingOption?.optionId === option.id}
                        >
                          {deletingOption?.optionId === option.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Option */}
                  {addingOptionTo === type.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={newOptionName}
                        onChange={(e) => setNewOptionName(e.target.value)}
                        placeholder="Nama pilihan baru"
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddOption(type.id)}
                        disabled={savingOption}
                        className="bg-[#22C55E] hover:bg-[#16a34a]"
                      >
                        {savingOption ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setAddingOptionTo(null)
                          setNewOptionName("")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingOptionTo(type.id)}
                      className="border-dashed"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Tambah Pilihan
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
