# Inline Compliance Editor Implementation

## Overview
Sistem perbaikan compliance issues telah diubah dari **popup modal** menjadi **inline table editing** untuk UX yang lebih baik.

## Key Changes

### 1. Component Baru: `InlineComplianceEditor`
**Location:** `src/components/shared/InlineComplianceEditor.tsx`

**Features:**
- ✅ Table-based inline editing (Label | Value format)
- ✅ Edit existing fields dari compliance issues
- ✅ Add custom attributes ke `quality_specs`
- ✅ Show existing product values
- ✅ One-click save dengan merge strategy

**Format Table:**

| Label | Value | Status |
|-------|-------|--------|
| Durability | 5+ years | Modified |
| Artisan Made | true | Modified |

### 2. Payload Structure

**Sebelum (Salah):**
```json
{
  "specification_missing": "apalah terus",
  "packaging_requirement": "Karton tebel banget"
}
```
❌ Masalah: Menggunakan **type** dari compliance issue sebagai key

**Sesudah (Benar):**
```json
{
  "quality_specs": {
    "potency": "98%",
    "sterility": "100% sterile",
    "durability": "5+ years",
    "artisan_made": "true",
    "weaving_type": "Traditional Balinese",
    "water_resistant": "false",
    "specification_missing": "apalah terus",
    "packaging_requirement": "Karton tebel banget"
  }
}
```
✅ Solusi: Menggunakan **label** yang diinput user sebagai key di `quality_specs`

### 3. Build Update Payload Logic

```typescript
function buildUpdatePayload(
  changedFields: EditableField[],
  currentProduct: Product | null
): Record<string, unknown> {
  const updateData: Record<string, unknown> = {}
  const qualitySpecs: Record<string, unknown> = {
    ...(currentProduct?.quality_specs || {}) // Merge existing
  }

  changedFields.forEach(field => {
    const { path, value, label, isNew } = field

    // Top-level fields (material_composition, packaging_type, dll)
    const isTopLevel = [
      'material_composition',
      'packaging_type',
      'durability_claim',
      // ... dll
    ].includes(path)

    if (isTopLevel && !isNew) {
      updateData[path] = value
    } else {
      // Semua field lain masuk ke quality_specs
      // GUNAKAN LABEL SEBAGAI KEY
      const key = label.toLowerCase().replace(/ /g, "_").replace(/[^a-z0-9_]/g, "")
      qualitySpecs[key] = value
    }
  })

  updateData.quality_specs = qualitySpecs
  return updateData
}
```

**Key Points:**
1. **Label user** → key di `quality_specs`
2. Existing `quality_specs` di-merge (tidak hilang)
3. Top-level fields (material_composition, dll) tetap di root level

### 4. Flow Diagram

```
User opens export analysis detail
  ↓
Compliance issues detected
  ↓
InlineComplianceEditor shows table:
  - Existing fields (dari compliance issues)
  - Add new attributes button
  ↓
User fills:
  Label: "Durability" → Value: "5+ years"
  Label: "Artisan Made" → Value: "true"
  ↓
Click "Save All Changes"
  ↓
buildUpdatePayload() creates:
  {
    quality_specs: {
      ...existingSpecs,
      "durability": "5+ years",
      "artisan_made": "true"
    }
  }
  ↓
PATCH /products/{id}/
  ↓
Product updated with merged quality_specs
  ↓
Re-analyze to update compliance score
```

### 5. Contoh Payload Real

**Product Sebelum:**
```json
{
  "id": 47,
  "name_local": "Injeksi Antibiotik Ampisilin Steril",
  "quality_specs": {
    "potency": "98%",
    "sterility": "100% sterile",
    "shelf_life": "24 months"
  }
}
```

**User Edit & Tambah:**
- Edit: Durability → "5+ years"
- Add: Artisan Made → "true"
- Add: Weaving Type → "Traditional Balinese"

**Payload Dikirim:**
```json
{
  "quality_specs": {
    "potency": "98%",          // Tetap ada (merge)
    "sterility": "100% sterile", // Tetap ada (merge)
    "shelf_life": "24 months",  // Tetap ada (merge)
    "durability": "5+ years",   // Baru
    "artisan_made": "true",     // Baru
    "weaving_type": "Traditional Balinese" // Baru
  }
}
```

### 6. Integration di Export Analysis Page

**File:** `src/app/[locale]/export-analysis/[id]/page.tsx`

**Changes:**
```tsx
// 1. Import InlineComplianceEditor
import { InlineComplianceEditor } from "@/components/shared/InlineComplianceEditor"

// 2. State untuk current product
const [currentProduct, setCurrentProduct] = useState<Product | null>(null)

// 3. Fetch product data
const fetchProductData = async (productId: number) => {
  const response = await productService.get(productId)
  setCurrentProduct(response)
}

// 4. Render inline editor
<InlineComplianceEditor
  productId={getProductId()}
  complianceIssues={analysis.compliance_issues}
  currentProduct={currentProduct}
  onSaveComplete={fetchAnalysis}
/>
```

## Testing Checklist

- [x] Component compiles without errors
- [x] TypeScript types correct
- [ ] Manual test: Edit existing field
- [ ] Manual test: Add new attribute
- [ ] Manual test: Save changes
- [ ] Verify: quality_specs merged correctly
- [ ] Verify: product_changed warning appears
- [ ] Verify: Re-analyze updates score

## API Endpoint Used

**Method:** `PATCH /api/products/{id}/`

**Timeout:** 120 seconds (global), configured in `api.config.ts`

**Request Body:**
```json
{
  "quality_specs": {
    "existing_field": "value",
    "new_field_from_label": "value"
  }
}
```

## Files Modified

1. ✅ `src/components/shared/InlineComplianceEditor.tsx` (CREATED)
2. ✅ `src/app/[locale]/export-analysis/[id]/page.tsx` (MODIFIED)
3. ✅ `src/lib/api/services.ts` (PATCH method)
4. ✅ `src/config/api.config.ts` (timeout: 120s)

## Debug Console Output

When saving, console will show:
```
=== Payload Debug ===
Changed Fields: [
  { path: "quality_specs", label: "Durability", value: "5+ years", isNew: false },
  { path: "quality_specs", label: "Artisan Made", value: "true", isNew: true }
]
Update Payload: {
  "quality_specs": {
    "potency": "98%",
    "durability": "5+ years",
    "artisan_made": "true"
  }
}
  - Adding to quality_specs: "durability" = "5+ years" (from label: "Durability")
  - Adding to quality_specs: "artisan_made" = "true" (from label: "Artisan Made")
```

## Notes

- **Label sanitization:** Spaces → underscore, special chars removed
- **Merge strategy:** Existing `quality_specs` always preserved
- **Top-level fields:** `material_composition`, `packaging_type`, dll tidak masuk `quality_specs`
- **New attributes:** Always masuk `quality_specs` dengan label sebagai key

---

**Implementation Date:** December 7, 2025
**Status:** ✅ Code Complete, Ready for Testing
