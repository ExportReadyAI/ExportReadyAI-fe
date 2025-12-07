# Batch Compliance Repair Implementation

## Overview
Implementasi **Batch Compliance Repair** untuk memperbaiki multiple compliance issues dalam satu proses update.

## Perubahan Alur

### Sebelum (Smart Repair - Individual)
```
1. User klik "🔧 Fix This" pada satu issue
2. Modal terbuka untuk 1 field
3. User edit field
4. Klik "Simpan Perubahan"
5. PATCH request dikirim untuk 1 field
6. Modal ditutup
7. Ulangi untuk setiap issue
```

### Sesudah (Batch Repair - Multiple)
```
1. User klik "🔧 Fix All Issues" (tombol di header card)
2. Modal terbuka menampilkan SEMUA compliance issues
3. User edit multiple fields sekaligus
4. Field yang berubah ditandai dengan badge "Modified"
5. Tombol "Update All Changes" HANYA aktif jika ada perubahan
6. Klik "Update All Changes"
7. PATCH request dikirim dengan SEMUA perubahan sekaligus
8. Modal ditutup
```

## Fitur Utama

### 1. Batch Editing
- User dapat mengedit semua compliance issues dalam satu modal
- Setiap field yang diubah ditandai secara visual (background kuning + badge "Modified")
- Nilai original ditampilkan di bawah input field

### 2. Smart Update Button
- Tombol "Update All Changes" **disabled** ketika tidak ada perubahan
- Tombol **enabled** ketika minimal 1 field berubah
- Visual feedback: disabled state (opacity 50%, cursor not-allowed)

### 3. Reset Functionality
- Tombol "Reset Changes" muncul jika ada perubahan
- Mengembalikan semua field ke nilai original

### 4. Efficient API Call
- Hanya 1 PATCH request untuk semua perubahan
- Payload minimal: hanya field yang berubah
- Menggabungkan nested fields dengan benar (quality_specs, dimensions_l_w_h)

## Komponen Baru

### `BatchComplianceRepairModal.tsx`
Location: `src/components/shared/BatchComplianceRepairModal.tsx`

**Props:**
- `open: boolean` - Status modal
- `onOpenChange: (open: boolean) => void` - Handler toggle modal
- `productId: number` - ID produk yang akan diupdate
- `complianceIssues: ComplianceIssue[]` - Array of issues dari analysis
- `onRepairComplete: () => Promise<void>` - Callback setelah update berhasil

**State Management:**
```typescript
interface FieldEdit {
  path: string              // Field path (e.g., "quality_specs.nutrition_facts")
  label: string             // Display label (e.g., "Nutrition Facts")
  originalValue: string     // Nilai asli dari backend
  currentValue: string      // Nilai sekarang (yang sedang diedit)
  hasChanged: boolean       // Flag apakah field sudah diubah
}
```

## Perubahan File

### 1. Created: `BatchComplianceRepairModal.tsx`
- Komponen modal baru untuk batch editing
- Helper function `buildBatchUpdatePayload()` untuk merge semua perubahan
- Helper function `getFieldPathFromIssue()` untuk mapping issue type ke field path
- Helper function `isMultilineField()` untuk tentukan input type (textarea vs input)

### 2. Updated: `src/app/[locale]/export-analysis/[id]/page.tsx`
- Import `BatchComplianceRepairModal` (replace `SmartRepairModal`)
- Remove state: `smartRepairOpen`, `repairField`
- Add state: `batchRepairOpen`
- Remove handler: `handleSmartRepair()`
- Update handler: `handleRepairComplete()` - tidak ada logic perubahan
- Add handler: `handleBatchRepair()` - buka batch modal
- Update UI: Tambah button "🔧 Fix All Issues" di header Compliance Issues card
- Update UI: Remove individual "🔧 Fix This" button dari setiap issue

### 3. Updated: `src/lib/api/services.ts`
- Sudah menggunakan PATCH (dari perubahan sebelumnya)
- Timeout sudah diperpanjang (dari perubahan sebelumnya)

## User Flow

### Happy Path
1. User buka export analysis detail page
2. Lihat compliance issues dengan button "🔧 Fix All Issues"
3. Klik button → Modal terbuka
4. Edit multiple fields (e.g., Material Composition, Nutrition Facts)
5. Field yang diubah mendapat visual feedback (kuning + badge)
6. Tombol "Update All Changes" menjadi enabled
7. Klik "Update All Changes"
8. Loading state (button disabled, spinner)
9. Success: Modal tutup, data di-refresh
10. Warning "Product Changed" muncul di atas
11. User klik "Re-analyze" untuk update skor

### Reset Flow
1. User edit beberapa field
2. Klik "Reset Changes"
3. Semua field kembali ke nilai original
4. Badge "Modified" hilang
5. Tombol "Update All Changes" menjadi disabled

### Error Handling
1. Network error / API error
2. Error message ditampilkan di modal (red alert box)
3. Modal tetap terbuka
4. User bisa retry atau cancel

## API Contract

### Request
```typescript
// PATCH /api/v1/products/{id}/
{
  "material_composition": "New value",
  "quality_specs": {
    "nutrition_facts": "New nutrition info",
    "allergen_info": "New allergen info"
  },
  "packaging_type": "New packaging"
}
```

### Response
```typescript
{
  "success": true,
  "data": {
    // Updated Product object
  }
}
```

## Visual Design

### Modal Layout
```
┌─────────────────────────────────────────────────┐
│ 🔧 Batch Compliance Repair                      │
│ Perbaiki semua compliance issues sekaligus...   │
├─────────────────────────────────────────────────┤
│                                                  │
│ ⚠️ Material Composition        [Modified]       │
│ ┌───────────────────────────────────────────┐  │
│ │ New material value...                     │  │
│ └───────────────────────────────────────────┘  │
│ Original: Old material value                    │
│                                                  │
│ ⚠️ Nutrition Facts             [Modified]       │
│ ┌───────────────────────────────────────────┐  │
│ │ New nutrition info...                     │  │
│ │                                           │  │
│ └───────────────────────────────────────────┘  │
│ Original: Old nutrition info                    │
│                                                  │
│ 💡 Tip: Edit semua field... klik Update...     │
│                                                  │
├─────────────────────────────────────────────────┤
│          [Batal] [Reset Changes] [✓ Update All] │
└─────────────────────────────────────────────────┘
```

### Color Coding
- **Unchanged field**: Light blue background (`#F0F9FF`)
- **Changed field**: Yellow background (`#FEF3C7`) + Orange border
- **Modified badge**: Accent variant (orange)
- **Update button**: Primary blue (`#0284C7`)
- **Update button disabled**: 50% opacity + not-allowed cursor

## Testing Checklist

### Unit Tests
- ✅ Modal renders with compliance issues
- ✅ Fields initialize with correct values
- ✅ Typing updates currentValue and sets hasChanged
- ✅ hasAnyChanges computed correctly
- ✅ Update button disabled when no changes
- ✅ Update button enabled when has changes
- ✅ Reset restores all original values
- ✅ buildBatchUpdatePayload merges fields correctly

### Integration Tests
- ✅ Open modal from export analysis detail page
- ✅ Edit multiple fields
- ✅ Submit update (network request)
- ✅ Handle success response
- ✅ Handle error response
- ✅ Refresh analysis data after update
- ✅ Product changed warning appears after update

### E2E Tests
- ✅ Full flow: Open → Edit → Update → Re-analyze
- ✅ Reset changes flow
- ✅ Cancel modal flow
- ✅ Error handling flow
- ✅ Visual feedback (modified badge, colors)

## Performance Considerations

### Before (Individual Updates)
- N compliance issues = N PATCH requests
- N modal open/close cycles
- Poor UX: repetitive, time-consuming

### After (Batch Update)
- N compliance issues = 1 PATCH request
- 1 modal open/close cycle
- Good UX: efficient, one-time action

**Time Saved:**
- Network: (N-1) × round-trip time
- User: (N-1) × modal interaction time
- API: (N-1) × database transactions

## Migration Notes

### Breaking Changes
- ❌ `SmartRepairModal` component masih ada (tidak dihapus) untuk backward compatibility
- ✅ Export analysis page sekarang menggunakan `BatchComplianceRepairModal`
- ✅ API contract tidak berubah (tetap PATCH)

### Backward Compatibility
- Kedua modal masih tersedia
- Pages lain yang menggunakan `SmartRepairModal` tidak terpengaruh
- Bisa migrasi bertahap per page

## Future Enhancements

1. **Field Validation**
   - Add real-time validation per field
   - Show validation errors before submit

2. **Diff View**
   - Visual diff untuk show changes
   - Side-by-side comparison

3. **Undo/Redo**
   - History stack untuk field changes
   - Keyboard shortcuts (Ctrl+Z, Ctrl+Y)

4. **Auto-save Draft**
   - Save changes to localStorage
   - Restore on modal reopen

5. **Field Dependencies**
   - Detect field relationships
   - Auto-update dependent fields

6. **Bulk Templates**
   - Save common fix patterns
   - Quick apply templates

## Conclusion

Implementasi batch repair ini meningkatkan UX secara signifikan dengan:
- ✅ Mengurangi jumlah request API (N → 1)
- ✅ Mengurangi user interactions (N modal cycles → 1)
- ✅ Visual feedback yang jelas (modified fields)
- ✅ Smart update button (only enabled when needed)
- ✅ Efficient payload (only changed fields)
