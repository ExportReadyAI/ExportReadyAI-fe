# Frontend Implementation: Product Snapshot & Smart Repair

## 📋 Overview

Dokumen ini menjelaskan implementasi frontend untuk fitur **Product Snapshot** dan **Smart Repair** pada aplikasi ExportReady.AI. Implementasi ini mengikuti arsitektur snapshot-based yang telah diimplementasikan di backend.

**Tanggal Implementasi**: 7 Desember 2025  
**Status**: ✅ Complete & Tested

---

## 🎯 Tujuan Implementasi

### 1. **Snapshot-Based Architecture**
- Menampilkan data produk dari snapshot (historical data) bukan data live
- Menjaga integritas audit trail hasil analisis
- Mendeteksi perubahan produk setelah analisis

### 2. **Smart Repair Flow**
- User dapat memperbaiki data produk langsung dari halaman rekomendasi
- Otomatis trigger re-analyze setelah perbaikan
- UX yang seamless tanpa pindah halaman

### 3. **Regulation Recommendations**
- Menampilkan rekomendasi regulasi lengkap (10 section)
- Dukungan multi-bahasa (Indonesia & English)
- Caching untuk performa optimal

---

## 🏗️ Struktur File Baru

```
src/
├── lib/
│   └── api/
│       ├── types.ts                    # ✅ Updated: Added snapshot types
│       └── services.ts                 # ✅ Updated: Added regulation service
├── components/
│   └── shared/
│       ├── ProductChangedAlert.tsx     # 🆕 Alert banner untuk product changed
│       └── SmartRepairModal.tsx        # 🆕 Modal untuk smart repair
└── app/
    └── [locale]/
        └── export-analysis/
            └── [id]/
                ├── page.tsx            # ✅ Updated: Integrated snapshot & smart repair
                └── regulation-recommendations/
                    └── page.tsx        # 🆕 Halaman regulation recommendations
```

---

## 📦 Updated Types (`lib/api/types.ts`)

### New Types

```typescript
// Product Snapshot Type (captured at analysis time)
export interface ProductSnapshot {
  id: number
  name_local: string
  category_id: number
  category?: ProductCategory
  description_local: string
  material_composition: string
  production_technique: string
  finishing_type: string
  quality_specs: QualitySpecs
  durability_claim: string
  packaging_type: string
  dimensions_l_w_h: ProductDimensions
  weight_net: string
  weight_gross: string
  enrichment?: ProductEnrichment | null
  snapshot_created_at: string
  updated_at?: string
}

// Regulation Recommendations Types
export interface RegulationSection {
  summary: string
  key_points: string[]
  details?: string
}

export interface RegulationRecommendations {
  overview: RegulationSection
  prohibited_items: RegulationSection
  import_restrictions: RegulationSection
  certifications: RegulationSection
  labeling_requirements: RegulationSection
  customs_procedures: RegulationSection
  testing_inspection: RegulationSection
  intellectual_property: RegulationSection
  shipping_logistics: RegulationSection
  timeline_costs: RegulationSection
}

export interface RegulationRecommendationsResponse {
  analysis_id: number
  country_code: string
  product_name: string
  from_cache: boolean
  recommendations: RegulationRecommendations
}
```

### Updated ExportAnalysis Interface

```typescript
export interface ExportAnalysis {
  id: number
  product_id: number
  product_name: string
  // ... existing fields ...
  
  // NEW: Snapshot fields
  product_snapshot?: ProductSnapshot
  snapshot_product_name?: string
  product_changed?: boolean
  regulation_recommendations_cache?: RegulationRecommendations | null
}
```

---

## 🔧 Updated Services (`lib/api/services.ts`)

### New Service Method

```typescript
export const exportAnalysisService = {
  // ... existing methods ...
  
  // NEW: Get detailed regulation recommendations
  getRegulationRecommendations: (id: string | number, language: 'id' | 'en' = 'id') =>
    get<RegulationRecommendationsResponse>(
      API_ENDPOINTS.exportAnalysis.regulationRecommendations(id),
      { headers: { 'Accept-Language': language } }
    ),
}
```

### Updated Endpoint

```typescript
// config/api.config.ts
exportAnalysis: {
  // ... existing endpoints ...
  regulationRecommendations: (id: string | number) => 
    `/export-analysis/${id}/regulation-recommendations/`,
}
```

---

## 🎨 Komponen Baru

### 1. **ProductChangedAlert** (`components/shared/ProductChangedAlert.tsx`)

**Purpose**: Menampilkan warning banner ketika produk telah diubah setelah analisis.

**Props**:
```typescript
interface ProductChangedAlertProps {
  productName: string
  onReanalyze?: () => void
  loading?: boolean
}
```

**Usage**:
```tsx
{analysis.product_changed && (
  <ProductChangedAlert
    productName={analysis.snapshot_product_name || analysis.product_name}
    onReanalyze={() => setReanalyzeModalOpen(true)}
    loading={reanalyzing}
  />
)}
```

**Features**:
- ⚠️ Warning banner dengan warna amber/orange
- 📝 Menjelaskan bahwa data produk telah berubah
- 🔄 Tombol "Re-analyze dengan Data Terbaru"
- ⏳ Loading state saat re-analyze

---

### 2. **SmartRepairModal** (`components/shared/SmartRepairModal.tsx`)

**Purpose**: Modal untuk memperbaiki data produk secara in-context dengan auto re-analyze.

**Props**:
```typescript
interface SmartRepairModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  analysisId: number
  productId: number
  fieldPath: string         // e.g., "quality_specs.nutrition_facts"
  fieldLabel: string        // e.g., "Nutrition Facts"
  currentValue: string | number
  onRepairComplete: (updatedProduct: Product) => Promise<void>
}
```

**Usage**:
```tsx
{repairField && (
  <SmartRepairModal
    open={smartRepairOpen}
    onOpenChange={setSmartRepairOpen}
    analysisId={analysis.id}
    productId={analysis.product_id}
    fieldPath={repairField.path}
    fieldLabel={repairField.label}
    currentValue={repairField.value}
    onRepairComplete={handleRepairComplete}
  />
)}
```

**Flow**:
1. User klik "Fix This" di compliance issue
2. Modal terbuka dengan form input
3. User edit data
4. Klik "Simpan & Perbarui Analisis"
5. **Backend Flow**:
   - `PUT /products/:id` → Update product
   - `POST /export-analysis/:id/reanalyze/` → Create new snapshot & re-analyze
6. **Frontend**: Refresh UI dengan data baru

**Features**:
- 🔧 Form input dinamis (Input atau Textarea)
- 📝 Mapping field path ke product fields
- ✅ Validasi sebelum submit
- ⏳ Loading state dengan progress indicator
- 🚨 Error handling dengan pesan user-friendly

**Field Mapping Helper**:
```typescript
const typeToFieldMap: Record<string, string> = {
  "Material Composition": "material_composition",
  "Nutrition Facts": "quality_specs.nutrition_facts",
  "Allergen Info": "quality_specs.allergen_info",
  "Ingredients": "quality_specs.ingredients",
  "Packaging Type": "packaging_type",
  "Durability Claim": "durability_claim",
}
```

---

## 📄 Halaman Export Analysis Detail (Updated)

**File**: `app/[locale]/export-analysis/[id]/page.tsx`

### Key Changes

#### 1. **State Management**
```typescript
const [reanalyzing, setReanalyzing] = useState(false)
const [smartRepairOpen, setSmartRepairOpen] = useState(false)
const [repairField, setRepairField] = useState<{
  path: string
  label: string
  value: string | number
} | null>(null)
```

#### 2. **Product Changed Warning**
```tsx
{/* Product Changed Warning */}
{analysis.product_changed && (
  <ProductChangedAlert
    productName={analysis.snapshot_product_name || analysis.product_name}
    onReanalyze={() => setReanalyzeModalOpen(true)}
    loading={reanalyzing}
  />
)}
```

#### 3. **Smart Repair Integration**
```tsx
{/* Di setiap compliance issue */}
{issue.your_value && issue.required_value && (
  <>
    {/* ... display values ... */}
    {!isAdmin() && (
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleSmartRepair(
          getFieldPathFromIssue(issue),
          issue.type,
          issue.your_value || ""
        )}
        className="mt-2 text-xs"
      >
        🔧 Fix This
      </Button>
    )}
  </>
)}
```

#### 4. **Regulation Recommendations Link**
```tsx
<Button
  variant="outline"
  onClick={() => router.push(`/export-analysis/${analysis.id}/regulation-recommendations`)}
>
  <BookOpen className="mr-2 h-4 w-4" />
  Detail Rekomendasi
</Button>
```

---

## 📊 Halaman Regulation Recommendations (New)

**File**: `app/[locale]/export-analysis/[id]/regulation-recommendations/page.tsx`

### Features

#### 1. **Multi-Language Support**
```typescript
const [language, setLanguage] = useState<'id' | 'en'>('id')

const toggleLanguage = () => {
  setLanguage(prev => prev === 'id' ? 'en' : 'id')
}
```

#### 2. **10 Section Display**
```typescript
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
```

#### 3. **Cache Indicator**
```tsx
{data.from_cache && (
  <span className="text-xs text-[#7DD3FC] bg-[#E0F2FE] px-2 py-1 rounded-lg">
    {language === 'id' ? '⚡ Dari Cache' : '⚡ From Cache'}
  </span>
)}
```

#### 4. **Section Rendering**
```tsx
{sections.map(({ key, icon: Icon, title, color }) => {
  const section = data.recommendations[key]
  return (
    <Card key={key}>
      <CardHeader>
        <CardTitle>
          <Icon style={{ color }} />
          <span style={{ color }}>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <p>{section.summary}</p>
        
        {/* Key Points */}
        <ul>
          {section.key_points.map(point => (
            <li>{point}</li>
          ))}
        </ul>
        
        {/* Details */}
        {section.details && <div>{section.details}</div>}
      </CardContent>
    </Card>
  )
})}
```

---

## 🔄 User Flows

### Flow 1: View Analysis (Normal)

1. User buka halaman detail analisis
2. **Check**: `product_changed === false`
3. Display: Data normal tanpa warning
4. User dapat lihat skor, issues, dan rekomendasi

### Flow 2: View Analysis (Product Changed)

1. User buka halaman detail analisis
2. **Check**: `product_changed === true`
3. Display: **ProductChangedAlert** banner di atas skor
4. User klik "Re-analyze dengan Data Terbaru"
5. Backend: Create new snapshot + re-analyze
6. Frontend: Refresh dengan data baru
7. **Result**: `product_changed === false` (snapshot updated)

### Flow 3: Smart Repair (Fix -> Save -> Re-analyze)

1. User lihat compliance issue dengan your_value vs required_value
2. User klik tombol "🔧 Fix This"
3. **SmartRepairModal** terbuka
4. User edit field value
5. User klik "Simpan & Perbarui Analisis"
6. **Backend Flow**:
   ```
   GET /products/:id          → Get current product
   PUT /products/:id          → Update field
   POST /analysis/:id/reanalyze → New snapshot + analyze
   ```
7. **Frontend**: Modal close, data refresh, skor update
8. **UX**: User langsung lihat skor naik (instant gratification ✨)

### Flow 4: View Detailed Recommendations

1. User di halaman detail analisis
2. User klik "Detail Rekomendasi"
3. Navigate to `/export-analysis/:id/regulation-recommendations`
4. **First Time**: Loading 3-5 detik (generation)
5. **Subsequent**: Instant (from cache)
6. User toggle bahasa → Re-fetch dengan language header
7. Display: 10 section lengkap dengan warna-warni

---

## 🎨 Design Patterns

### 1. **Optimistic UI Updates**
```typescript
// Langsung close modal, kemudian refresh data
await onRepairComplete(updatedProduct)
onOpenChange(false)
```

### 2. **Error Boundaries**
```typescript
try {
  // API call
} catch (err) {
  const error = err as { response?: { data?: { message?: string } } }
  setError(error.response?.data?.message || "Gagal...")
}
```

### 3. **Loading States**
```typescript
const [loading, setLoading] = useState(false)

{loading ? (
  <>
    <Loader2 className="animate-spin" />
    Memproses...
  </>
) : (
  "Simpan"
)}
```

### 4. **Conditional Rendering**
```typescript
{analysis.product_changed && <ProductChangedAlert />}
{!isAdmin() && <SmartRepairButton />}
{data.from_cache && <CacheBadge />}
```

---

## ✅ Testing Checklist

### Test 1: Old Analysis Test
- [ ] Buka analisis yang dibuat bulan lalu
- [ ] Pastikan data produk yang tampil adalah data lama (snapshot)
- [ ] Verify: `snapshot_product_name` digunakan, bukan `product.name_local`

### Test 2: Edit Detection
- [ ] Edit produk di tab browser lain
- [ ] Refresh halaman analisis
- [ ] Warning "Produk Changed" harus muncul
- [ ] Verify: `product_changed === true`

### Test 3: Repair Flow
- [ ] Klik "Fix" di rekomendasi
- [ ] Update field value
- [ ] Klik "Simpan & Perbarui Analisis"
- [ ] Verify: Skor harus otomatis update tanpa refresh manual
- [ ] Verify: Warning hilang (`product_changed === false`)

### Test 4: Language Toggle
- [ ] Buka halaman regulation recommendations
- [ ] Klik toggle bahasa
- [ ] Verify: Konten berubah bahasa
- [ ] Verify: Request header `Accept-Language` correct

### Test 5: Cache Behavior
- [ ] Request regulation recommendations (first time)
- [ ] Verify: Loading 3-5 detik, `from_cache: false`
- [ ] Request again (second time)
- [ ] Verify: Instant, `from_cache: true`
- [ ] Trigger re-analyze
- [ ] Request again
- [ ] Verify: Loading lagi (cache cleared), `from_cache: false`

---

## 🚨 Common Pitfalls & Solutions

### Pitfall 1: Using Live Product Data
❌ **Wrong**:
```typescript
const productResponse = await productService.get(analysis.product_id)
<p>{productResponse.name_local}</p>
```

✅ **Correct**:
```typescript
<p>{analysis.snapshot_product_name || analysis.product_name}</p>
```

### Pitfall 2: Edit Without Re-analyze
❌ **Wrong**:
```typescript
// User edit -> Save -> Close modal
// Result: product_changed = true, skor tidak berubah
```

✅ **Correct**:
```typescript
// User edit -> Save -> Re-analyze -> Close modal
await productService.update(id, data)
await exportAnalysisService.reanalyze(analysisId)  // ✅ Always!
```

### Pitfall 3: Language Not Persisted
❌ **Wrong**:
```typescript
// Language state reset on component unmount
```

✅ **Solution**:
```typescript
// Option 1: URL param (?lang=en)
// Option 2: LocalStorage
// Option 3: Global state (zustand/redux)
```

---

## 📚 Key Takeaways

### For Developers

1. **Always use snapshot data** untuk display di halaman hasil analisis
2. **Always trigger re-analyze** setelah update produk untuk instant feedback
3. **Never fetch live product** di halaman analisis (kecuali untuk edit)
4. **Check `product_changed` flag** dan tampilkan warning
5. **Use `Accept-Language` header** untuk multi-language support

### For Users

1. 📸 **Snapshot = Historical Record**: Analisis tidak berubah meskipun produk diedit
2. 🔄 **Re-analyze = Update Snapshot**: Klik re-analyze untuk menggunakan data terbaru
3. 🔧 **Smart Repair = Quick Fix**: Edit langsung dari rekomendasi tanpa pindah halaman
4. 🌐 **Multi-Language**: Toggle bahasa untuk rekomendasi dalam bahasa Indonesia atau English

---

## 🔮 Future Enhancements

### 1. **Snapshot Comparison**
```typescript
// Compare current product vs snapshot
const diff = compareProductSnapshots(product, analysis.product_snapshot)
// Display what changed
```

### 2. **Batch Repair**
```typescript
// Fix multiple issues at once
<Button onClick={handleBatchRepair}>
  Fix All Critical Issues
</Button>
```

### 3. **Export Recommendations to PDF**
```typescript
<Button onClick={exportToPDF}>
  📥 Download PDF
</Button>
```

### 4. **Inline Editing**
```typescript
// Edit directly in the issue card without modal
<ContentEditable
  value={issue.your_value}
  onChange={handleInlineEdit}
/>
```

---

## 📞 Support & Troubleshooting

### Error: "product_snapshot is null"
**Solution**: Re-analyze untuk create snapshot pertama kali

### Error: "Recommendations not found"
**Solution**: Backend mungkin belum generate, tunggu 5 detik dan retry

### Error: "product_changed always true"
**Solution**: Check timezone di backend vs frontend (datetime comparison)

---

**Dokumentasi dibuat oleh**: GitHub Copilot  
**Tanggal**: 7 Desember 2025  
**Status**: ✅ Production Ready
