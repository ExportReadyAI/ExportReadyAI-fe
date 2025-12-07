
---

# API Documentation - Catalog Module

Base URL: `/api/v1/catalogs/`

## Authentication
Semua endpoint (kecuali public) memerlukan JWT token:
```
Authorization: Bearer <access_token>
```

---

## 1. Catalog CRUD

### List Catalogs
```
GET /api/v1/catalogs/
```
**Output:** Array of catalogs dengan `id`, `product_name`, `display_name`, `is_published`, `base_price_exw`, `primary_image`, `variant_count`

### Create Catalog
```
POST /api/v1/catalogs/
```
**Input:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| product_id | int | Yes | ID product yang akan dijadikan catalog |
| display_name | string | Yes | Nama tampilan untuk buyer |
| base_price_exw | decimal | Yes | Harga EXW dalam USD |
| marketing_description | string | No | Deskripsi marketing (bahasa bebas) |
| **export_description** | string | No | Deskripsi B2B internasional (isi manual ATAU dari AI) |
| **technical_specs** | json | No | Spesifikasi teknis (isi manual ATAU dari AI) |
| **safety_info** | json | No | Info keamanan/safety (isi manual ATAU dari AI) |
| min_order_quantity | decimal | No | Default: 1 |
| unit_type | string | No | Default: "pcs" |
| lead_time_days | int | No | Default: 14 |
| tags | array | No | Tags untuk filter |

> **Penting:** Field `export_description`, `technical_specs`, `safety_info` bisa diisi manual oleh user. AI hanya memberikan **rekomendasi** yang bisa di-accept atau di-reject.

**Output:** Full catalog object dengan `id`, semua fields, `images: []`, `variants: []`

### Get Catalog Detail
```
GET /api/v1/catalogs/{catalog_id}/
```
**Output:** Full catalog object termasuk `images`, `variants`, `export_description`, `technical_specs`, `safety_info`

### Update Catalog
```
PUT /api/v1/catalogs/{catalog_id}/
```
**Input:** Same as create (semua optional untuk partial update)

> User bisa edit `export_description`, `technical_specs`, `safety_info` kapan saja - baik sebelum maupun sesudah menggunakan AI.

### Delete Catalog
```
DELETE /api/v1/catalogs/{catalog_id}/
```

---

## 2. Catalog Images

> **Update:** Backend sekarang support **file upload langsung** dan juga **URL eksternal**.

### List/Add Images
```
GET/POST /api/v1/catalogs/{catalog_id}/images/
```

**Input (POST) - 2 opsi:**

#### Opsi 1: File Upload (multipart/form-data)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| image | file | Yes* | File gambar (JPG, PNG, etc.) |
| alt_text | string | No | Alt text untuk accessibility |
| sort_order | int | No | Urutan tampilan (default: 0) |
| is_primary | boolean | No | Gambar utama (default: false) |

#### Opsi 2: URL Eksternal (application/json)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| image_url | string (URL) | Yes* | URL gambar eksternal |
| alt_text | string | No | Alt text untuk accessibility |
| sort_order | int | No | Urutan tampilan (default: 0) |
| is_primary | boolean | No | Gambar utama (default: false) |

> *Minimal salah satu dari `image` atau `image_url` harus diisi.

**Output:**
```json
{
  "success": true,
  "message": "Image added successfully",
  "data": {
    "id": 1,
    "image": "/media/catalog_images/5/photo.jpg",
    "image_url": "",
    "url": "http://localhost:8000/media/catalog_images/5/photo.jpg",
    "alt_text": "Product photo",
    "sort_order": 0,
    "is_primary": true,
    "created_at": "2025-12-07T12:00:00Z"
  }
}
```

> **Note:** Field `url` adalah URL final yang bisa langsung dipakai untuk menampilkan gambar (otomatis mengambil dari file upload atau URL eksternal).

### Update/Delete Image
```
PUT/DELETE /api/v1/catalogs/{catalog_id}/images/{image_id}/
```

### Contoh Upload dengan JavaScript (Frontend)

```javascript
// Opsi 1: File Upload
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('is_primary', 'true');

await fetch(`/api/v1/catalogs/${catalogId}/images/`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
    // Jangan set Content-Type untuk FormData - browser akan set otomatis
  },
  body: formData
});

// Opsi 2: URL Eksternal
await fetch(`/api/v1/catalogs/${catalogId}/images/`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image_url: 'https://example.com/image.jpg',
    is_primary: true
  })
});
```

---

## 3. Catalog Variants (Variant Types & Options)

Struktur baru: Variant Type (jenis varian) → Options (pilihan)

### Predefined Variant Types (Dropdown)
| Code | Label |
|------|-------|
| color | Warna |
| size | Ukuran |
| material | Bahan |
| flavor | Rasa |
| weight | Berat |
| style | Gaya |
| pattern | Motif |
| custom | Lainnya |

### List/Add Variant Types
```
GET/POST /api/v1/catalogs/{catalog_id}/variant-types/
```
**Input (POST):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type_code | string | No | Predefined code (default: "custom") |
| type_name | string | Yes | Display name (e.g., "Warna", "Ukuran") |
| sort_order | int | No | Display order |
| options | array | No | Array of options to create |

**Options array item:**
| Field | Type | Required |
|-------|------|----------|
| option_name | string | Yes |
| sort_order | int | No |
| is_available | bool | No (default: true) |

**Contoh Request:**
```json
{
  "type_code": "color",
  "type_name": "Warna",
  "options": [
    { "option_name": "Merah" },
    { "option_name": "Hijau" },
    { "option_name": "Biru" }
  ]
}
```

**Response GET (includes predefined_types untuk dropdown):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type_code": "color",
      "type_name": "Warna",
      "sort_order": 0,
      "options": [
        { "id": 1, "option_name": "Merah", "is_available": true },
        { "id": 2, "option_name": "Hijau", "is_available": true }
      ]
    }
  ],
  "predefined_types": [
    { "code": "color", "label": "Warna" },
    { "code": "size", "label": "Ukuran" },
    ...
  ]
}
```

### Update/Delete Variant Type
```
PUT/DELETE /api/v1/catalogs/{catalog_id}/variant-types/{type_id}/
```

### List/Add Options to Variant Type
```
GET/POST /api/v1/catalogs/{catalog_id}/variant-types/{type_id}/options/
```
**Input (POST):**
| Field | Type | Required |
|-------|------|----------|
| option_name | string | Yes |
| sort_order | int | No |
| is_available | bool | No |

### Update/Delete Option
```
PUT/DELETE /api/v1/catalogs/{catalog_id}/variant-types/{type_id}/options/{option_id}/
```

---

## 4. AI Features

### Ringkasan AI Features

| AI | Fungsi | Endpoint | Catatan |
|----|--------|----------|---------|
| AI 1 | Description Generator | `/products/{id}/ai/catalog-description/` | **SEBELUM create catalog** - dari Product data |
| AI 2 | Market Intelligence | `/products/{id}/ai/market-intelligence/` | Via Product |
| AI 3 | Pricing Calculator | `/products/{id}/ai/pricing/` | Via Product |

---

### AI 1: Description Generator (via Product) ⭐ NEW

**PENTING:** Endpoint ini dipanggil **SEBELUM** membuat catalog, untuk mendapatkan rekomendasi dari data Product.

```
POST /api/v1/products/{product_id}/ai/catalog-description/
```

**Input (Optional):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| is_food_product | boolean | No | Default: false. Jika true, safety_info akan berisi food safety |

**Output:**
```json
{
  "success": true,
  "message": "Catalog description recommendations generated...",
  "data": {
    "export_description": "English B2B marketing description...",
    "technical_specs": {
      "product_name": "...",
      "material": "...",
      "dimensions": "...",
      "weight_net": "...",
      "certifications": [...]
    },
    "safety_info": {
      "material_safety": "...",
      "warnings": [...],
      "storage": "..."
    },
    "product_info": {
      "id": 35,
      "name": "Tas Rotan Handmade",
      "description_local": "...",
      "material_composition": "..."
    }
  }
}
```

**Note:**
- Data TIDAK disimpan - hanya rekomendasi untuk user review sebelum create catalog.
- **AI butuh waktu 10-30 detik** untuk generate. Frontend harus handle loading state.
- Auto-detect food product berdasarkan keyword di nama/deskripsi (keripik, singkong, kopi, dll)

---

### Flow Frontend yang Benar

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Pilih Product untuk dijadikan Catalog              │
├─────────────────────────────────────────────────────────────┤
│  Product: [Dropdown pilih product]                          │
│                                                             │
│  [💡 Get AI Recommendations]  ← OPTIONAL                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Form Create Catalog                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Display Name:        [__________]                          │
│  Marketing Desc:      [__________]                          │
│                                                             │
│  Export Description:  [__________] ← Isi manual ATAU AI    │
│  Technical Specs:     [__________] ← Isi manual ATAU AI    │
│  Safety Info:         [__________] ← Isi manual ATAU AI    │
│                                                             │
│  Base Price (EXW):    [__________]                          │
│  Min Order Qty:       [__________]                          │
│  Lead Time:           [__________]                          │
│                                                             │
│  Images:              [Upload/Select Photos]                │
│                                                             │
│                       [Create Catalog]                      │
└─────────────────────────────────────────────────────────────┘
```

**Flow Jika User Klik "Get AI Recommendations":**
1. `POST /products/{product_id}/ai/catalog-description/`
2. Tampilkan hasil AI di modal/panel
3. User pilih:
   - **[Accept All]** → Pre-fill semua field dengan hasil AI
   - **[Accept Partial]** → User pilih field mana yang mau dipakai
   - **[Cancel]** → User isi manual semua field
4. User tetap bisa edit semua field sebelum submit
5. Submit form create catalog seperti biasa

---

## 5. Public Endpoints (No Auth)

### List Published Catalogs
```
GET /api/v1/catalogs/public/
```

### Get Published Catalog Detail
```
GET /api/v1/catalogs/public/{catalog_id}/
```
**Note:** Hanya menampilkan catalog dengan `is_published = true`

---

## 6. AI 2: Market Intelligence (via Product)

Rekomendasi negara tujuan ekspor berdasarkan analisis produk.

```
GET /api/v1/products/{product_id}/ai/market-intelligence/
```
**Output:** Data market intelligence yang sudah ada (404 jika belum ada)

```
POST /api/v1/products/{product_id}/ai/market-intelligence/
```
**Input:**
| Field | Type | Required |
|-------|------|----------|
| current_price_usd | decimal | No |
| production_capacity | int | No |

**Output:**
```json
{
  "success": true,
  "data": {
    "product_id": 35,
    "recommended_countries": [
      {
        "country": "United States",
        "country_code": "US",
        "score": 92,
        "reason": "...",
        "market_size": "Large",
        "competition_level": "Medium",
        "suggested_price_range": "$25 - $45",
        "entry_strategy": "..."
      }
    ],
    "countries_to_avoid": [...],
    "market_trends": [...],
    "competitive_landscape": "...",
    "growth_opportunities": [...],
    "risks_and_challenges": [...],
    "overall_recommendation": "..."
  }
}
```

**Constraint:** 1 product = 1 market intelligence. POST kedua akan ditolak (400).

---

## 7. AI 3: Pricing Calculator (via Product)

```
GET /api/v1/products/{product_id}/ai/pricing/
```

```
POST /api/v1/products/{product_id}/ai/pricing/
```
**Input:**
| Field | Type | Required |
|-------|------|----------|
| cogs_per_unit_idr | decimal | Yes |
| target_margin_percent | decimal | Yes |
| target_country_code | string | No |

**Constraint:** 1 product = 1 pricing result.

---