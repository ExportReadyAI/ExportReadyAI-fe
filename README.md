# ExportReadyAI - Frontend

<p align="center">
  <img src="docs/screenshots/logo.png" alt="ExportReadyAI Logo" width="200"/>
</p>

<p align="center">
  <strong>Platform Ekspor Berbasis AI Pertama di Indonesia untuk UMKM</strong>
</p>

<p align="center">
  <em>"Your export journey, simplified by AI."</em>
</p>



---

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Proyek](#struktur-proyek)
- [Fitur Aplikasi](#fitur-aplikasi)
- [Screenshots](#screenshots)
- [Konfigurasi](#konfigurasi)
- [Troubleshooting](#troubleshooting)

---

## Tentang Proyek

**ExportReadyAI** adalah solusi end-to-end untuk UMKM Indonesia yang ingin go global. Platform ini menggabungkan kecerdasan buatan dengan keahlian ekspor mendalam untuk menghilangkan kompleksitas yang menghambat pertumbuhan internasional.

### Mengapa ExportReadyAI?

| Tantangan UMKM | Solusi ExportReadyAI |
|----------------|----------------------|
| Tidak tahu harus mulai dari mana | AI Assistant 24/7 untuk konsultasi |
| Mencari HS Code memakan waktu berjam-jam | Generate HS Code otomatis dalam detik |
| Tidak yakin produk bisa masuk negara tertentu | Analisis kepatuhan ekspor berbasis AI |
| Menentukan harga seperti menebak-nebak | Kalkulator harga EXW, FOB, CIF real-time |
| Sulit menemukan buyer terpercaya | Jaringan buyer & forwarder terverifikasi |

---

## Tech Stack

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| Framework | Next.js (App Router) | 16.0.7 |
| Bahasa | TypeScript | 5.9.3 |
| Styling | Tailwind CSS | 4.x |
| State Management | Zustand | 5.0.9 |
| HTTP Client | Axios | 1.13.2 |
| UI Components | Radix UI | Latest |
| Icons | Lucide React | 0.556.0 |
| Internationalization | next-intl | 4.5.8 |
| Markdown | react-markdown | 10.1.0 |
| Date Utilities | date-fns | 4.1.0 |

---

## Prasyarat

Pastikan sistem Anda sudah terinstall:

| Software | Versi Minimum | Cara Cek |
|----------|---------------|----------|
| Node.js | 18.x | `node --version` |
| npm | 9.x | `npm --version` |
| Git | 2.x | `git --version` |

---

## Instalasi

### Langkah 1: Clone Repository

```bash
git clone https://github.com/your-username/ExportReadyAI-fe.git
cd ExportReadyAI-fe
```

### Langkah 2: Install Dependencies

```bash
npm install
```

Tunggu hingga semua dependencies terinstall. Proses ini membutuhkan waktu sekitar 1-2 menit tergantung koneksi internet.

### Langkah 3: Konfigurasi Environment

Buat file `.env.local` di root project:

```bash
# Windows (Command Prompt)
copy .env.example .env.local

# Windows (PowerShell) / Mac / Linux
cp .env.example .env.local
```

Edit file `.env.local` dengan text editor:

```env
# Backend API URL (sesuaikan dengan URL backend Anda)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Application Name
NEXT_PUBLIC_APP_NAME=ExportReadyAI
```

### Langkah 4: Jalankan Development Server

```bash
npm run dev
```

### Langkah 5: Buka Aplikasi

Buka browser dan akses:

```
http://localhost:3000
```

Anda akan melihat landing page ExportReadyAI.

---

## Menjalankan Aplikasi

### Development Mode (untuk pengembangan)

```bash
npm run dev
```

- Aplikasi berjalan di `http://localhost:3000`
- Hot-reload aktif (perubahan code langsung terlihat)
- Error messages ditampilkan di browser

### Production Build (untuk deployment)

```bash
# 1. Build aplikasi
npm run build

# 2. Jalankan production server
npm run start
```

### Linting (cek kualitas code)

```bash
npm run lint
```

---

## Struktur Proyek

```
ExportReadyAI-fe/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   └── [locale]/                 # Routes dengan internationalization
│   │       ├── page.tsx              # Landing Page
│   │       ├── login/                # Halaman Login
│   │       ├── register/             # Halaman Register
│   │       ├── dashboard/            # Dashboard Utama
│   │       ├── products/             # Manajemen Produk
│   │       │   ├── page.tsx          # Daftar Produk
│   │       │   ├── create/           # Tambah Produk
│   │       │   └── [id]/             # Detail & Edit Produk
│   │       ├── marketing/            # Market Intelligence & Pricing
│   │       ├── export-analysis/      # Analisis Kepatuhan Ekspor
│   │       │   ├── page.tsx          # Daftar Analisis
│   │       │   ├── create/           # Buat Analisis Baru
│   │       │   ├── compare/          # Bandingkan Negara
│   │       │   └── [id]/             # Detail Analisis
│   │       ├── catalogs/             # Katalog Digital
│   │       ├── costing/              # Kalkulator Harga
│   │       ├── chat/                 # AI Chatbot
│   │       ├── buyers/               # Daftar Buyer
│   │       ├── forwarders/           # Daftar Forwarder
│   │       ├── buyer-requests/       # Permintaan Buyer
│   │       ├── educational/          # Pusat Pembelajaran
│   │       ├── business-profile/     # Profil Bisnis
│   │       └── users/                # Manajemen User (Admin)
│   │
│   ├── components/                   # React Components
│   │   ├── landing/                  # Komponen Landing Page
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   └── ...
│   │   ├── layout/                   # Layout Components
│   │   │   └── Sidebar.tsx
│   │   ├── shared/                   # Komponen Reusable
│   │   │   ├── ProductDetailModal.tsx
│   │   │   ├── MarketIntelligenceModal.tsx
│   │   │   └── ...
│   │   ├── chat/                     # Komponen Chat
│   │   │   ├── ChatSidebar.tsx
│   │   │   ├── ChatMessages.tsx
│   │   │   └── ...
│   │   └── ui/                       # UI Primitives
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── ...
│   │
│   ├── lib/                          # Utilities & Libraries
│   │   ├── api/                      # API Layer
│   │   │   ├── client.ts             # Axios Instance
│   │   │   ├── services.ts           # API Services
│   │   │   └── types.ts              # TypeScript Types
│   │   ├── constants/                # Konstanta
│   │   │   └── categories.ts         # Kategori Produk
│   │   ├── hooks/                    # Custom Hooks
│   │   │   ├── useApi.ts
│   │   │   └── useChat.ts
│   │   └── stores/                   # Zustand Stores
│   │       └── auth.store.ts
│   │
│   └── config/                       # Konfigurasi
│       └── api.config.ts             # API Endpoints
│
├── messages/                         # i18n Translations
│   ├── en.json
│   └── id.json
│
├── public/                           # Static Assets
├── docs/                             # Dokumentasi
│   └── screenshots/                  # Screenshots untuk README
│
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Fitur Aplikasi

---

### 1. Landing Page

Halaman utama yang menampilkan value proposition ExportReadyAI secara komprehensif.

**Komponen:**
- Hero Section dengan tagline dan CTA
- About Section (3 pilar: AI Analysis, Market Intelligence, Compliance)
- Features Section (8 fitur utama dengan ikon)
- Pain Points & Solutions
- Use Cases (UMKM, Buyer, Forwarder, Pemerintah, Investor)
- Vision & Mission
- Footer dengan navigasi

![Landing Page Hero](docs/screenshots/landing_hero.png)
*Screenshot: Hero section landing page*

![Landing Page Features](docs/screenshots/landing_features.png)
*Screenshot: Section fitur platform*

---

### 2. Autentikasi (Login & Register)

Sistem autentikasi multi-role dengan JWT token.

**Role yang tersedia:**
| Role | Deskripsi | Akses Utama |
|------|-----------|-------------|
| **UMKM** | Pelaku usaha ekspor | Produk, Analisis, Katalog, Pricing |
| **Buyer** | Pembeli internasional | Buyer Requests, Browse Katalog |
| **Forwarder** | Freight forwarder | Profil Forwarder, Browse Katalog |
| **Admin** | Administrator | Semua fitur + User Management |

**User Journey:**
```
Register → Pilih Role → Isi Data → Login → Dashboard
```

**Fitur:**
- Login dengan email & password
- Registrasi dengan pilihan role
- JWT Token authentication (access + refresh token)
- Persistent login via localStorage
- Auto-refresh token saat expired

![Login Page](docs/screenshots/login.png)
*Screenshot: Halaman login*

![Register Page](docs/screenshots/register.png)
*Screenshot: Halaman registrasi dengan pilihan role*

---

### 3. Dashboard

Dashboard dinamis yang berbeda berdasarkan role pengguna.

**Dashboard UMKM menampilkan:**
| Metrik | Deskripsi |
|--------|-----------|
| Total Produk | Jumlah produk yang terdaftar |
| Produk AI Enriched | Produk yang sudah di-generate HS Code |
| Total Katalog | Katalog published & draft |
| Buyer Requests | Permintaan yang cocok dengan produk |
| Materi Edukasi | 3 modul edukasi teratas |

**Dashboard Admin menampilkan:**
- Total users (breakdown per role)
- Total produk sistem
- Total katalog
- Total buyer requests
- Total modul edukasi

**User Journey:**
```
Login → Dashboard → Lihat Ringkasan → Quick Actions
```

![Dashboard UMKM](docs/screenshots/dashboard_umkm.png)
*Screenshot: Dashboard UMKM dengan statistik*

![Dashboard Admin](docs/screenshots/dashboard_admin.png)
*Screenshot: Dashboard Admin dengan overview sistem*

---

### 4. Manajemen Produk

Kelola semua produk ekspor dengan informasi lengkap untuk analisis AI.

**Informasi Produk yang Diinput:**
| Field | Contoh |
|-------|--------|
| Nama Produk (Lokal) | Kopi Arabika Gayo |
| Kategori | Makanan Olahan (125 pilihan) |
| Deskripsi | Kopi specialty dari dataran tinggi Aceh |
| Komposisi Material | 100% biji kopi arabika |
| Teknik Produksi | Wet processed, sun-dried |
| Finishing | Medium roast |
| Spesifikasi Kualitas | Grade 1, screen 17-18 |
| Durabilitas | 12 bulan shelf life |
| Jenis Kemasan | Aluminium foil bag dengan valve |
| Dimensi (P×L×T) | 15 × 10 × 5 cm |
| Berat Netto | 250g |
| Berat Bruto | 280g |

**User Journey:**
```
Products → Tambah Produk → Isi Form Lengkap → Simpan → View Detail → Run AI Enrichment
```

**Step-by-step:**
1. Klik "Tambah Produk" di halaman Products
2. Pilih kategori dari 125 pilihan
3. Isi informasi produk selengkap mungkin
4. Klik "Simpan Produk"
5. Produk muncul di daftar dengan status "Belum Enriched"
6. Klik produk untuk melihat detail
7. Klik "Generate" untuk menjalankan AI Enrichment

![Products List](docs/screenshots/products_list.png)
*Screenshot: Daftar produk dengan status enrichment*

![Create Product](docs/screenshots/product_create.png)
*Screenshot: Form tambah produk lengkap*

![Product Detail](docs/screenshots/product_detail.png)
*Screenshot: Detail produk dengan tombol AI*

---

### 5. AI Enrichment: Generate SKU & HS Code

**Fitur AI #1** - Mengubah informasi produk lokal menjadi data ekspor standar internasional.

**Apa yang Di-generate AI:**
| Output | Deskripsi |
|--------|-----------|
| **HS Code** | Harmonized System Code (6-8 digit) untuk klasifikasi tarif |
| **SKU** | Stock Keeping Unit format internasional |
| **Nama B2B (English)** | Nama produk profesional untuk pasar global |
| **Deskripsi B2B (English)** | Deskripsi lengkap dalam bahasa Inggris |
| **Marketing Highlights** | 3-5 poin keunggulan produk |

**User Journey:**
```
Product Detail → Klik "Generate" → Tunggu 10-30 detik → Lihat Hasil → Copy/Edit Manual
```

**Contoh Before & After:**

<table>
<tr>
<th>BEFORE (Input UMKM)</th>
<th>AFTER (AI Generated)</th>
</tr>
<tr>
<td>

```
Nama: Kopi Arabika Gayo
Deskripsi: Kopi enak dari Aceh
Material: Biji kopi
Berat: 250g
```

</td>
<td>

```
HS Code: 0901.21.10
SKU: COFFEE-ARB-GAYO-250G-IDN

Nama B2B:
Premium Gayo Arabica Coffee Beans -
Single Origin Aceh Indonesia

Deskripsi B2B:
High-grade specialty Arabica coffee beans
sourced from the renowned Gayo highlands
of Aceh, Indonesia. Wet-processed and
medium-roasted for optimal flavor complexity.
Features notes of chocolate, caramel, and
citrus. Suitable for specialty coffee shops,
restaurants, and premium retail.

Marketing Highlights:
• Single-origin from Gayo highlands (1400m)
• Specialty grade with cupping score 84+
• Rainforest Alliance certified
• Direct trade from smallholder farmers
• Vacuum-sealed for maximum freshness
```

</td>
</tr>
</table>

**Step-by-step:**
1. Buka halaman detail produk
2. Scroll ke section "Generate SKU & HS Code"
3. Klik tombol "Generate"
4. Tunggu proses AI (10-30 detik)
5. Hasil ditampilkan: HS Code, SKU, Nama B2B, Deskripsi, Highlights
6. Klik icon Copy untuk menyalin ke clipboard
7. Klik "Edit Manual" jika ingin menyesuaikan hasil

![AI Enrichment Process](docs/screenshots/ai_enrichment_loading.png)
*Screenshot: Proses AI sedang berjalan*

![AI Enrichment Result](docs/screenshots/ai_enrichment_result.png)
*Screenshot: Hasil AI enrichment lengkap*

![AI Enrichment Edit](docs/screenshots/ai_enrichment_edit.png)
*Screenshot: Edit manual hasil enrichment*

---

### 6. AI Export Analysis: Analisis Kepatuhan Ekspor

**Fitur AI #2** - Menganalisis kesiapan produk untuk diekspor ke negara tertentu.

**Apa yang Dianalisis:**
| Aspek | Deskripsi |
|-------|-----------|
| Regulasi Impor | Aturan impor negara tujuan |
| Sertifikasi | Halal, FDA, CE, HACCP, dll |
| Labeling | Bahasa, format, informasi wajib |
| Tarif & Bea | Bea masuk, pajak impor |
| Dokumen | Dokumen yang diperlukan |
| Hambatan | Non-tariff barriers |

**Output Analisis:**
| Komponen | Penjelasan |
|----------|------------|
| **Readiness Score** | Skor 0-100 (persentase kesiapan) |
| **Status Grade** | Ready / Warning / Critical |
| **Compliance Issues** | Daftar masalah kepatuhan |
| **Severity Level** | Critical / Major / Minor per issue |
| **Recommendations** | Rekomendasi perbaikan spesifik |

**User Journey:**
```
Export Analysis → Create → Pilih Produk → Pilih Negara → Tunggu 2-5 menit → Lihat Hasil
```

**Contoh Before & After:**

<table>
<tr>
<th>INPUT</th>
<th>OUTPUT AI</th>
</tr>
<tr>
<td>

```
Produk: Kopi Arabika Gayo
Negara Tujuan: Thailand
```

</td>
<td>

```
READINESS SCORE: 72/100
STATUS: Warning ⚠️

COMPLIANCE ISSUES:

[CRITICAL] Missing Thai Language Label
- Produk makanan wajib memiliki label
  dalam bahasa Thai
- Rekomendasi: Tambahkan label Thai
  dengan info nutrisi

[MAJOR] No FDA Thailand Registration
- Produk kopi memerlukan registrasi
  di Thai FDA
- Rekomendasi: Ajukan registrasi via
  importir lokal (estimasi 4-6 minggu)

[MINOR] Origin Certificate Format
- Certificate of Origin harus format
  ATIGA untuk preferential tariff
- Rekomendasi: Gunakan Form D dari
  Kemendag

TARIFF INFORMATION:
- Base Rate: 30%
- ATIGA Preferential: 5%
- Estimated savings: 25%
```

</td>
</tr>
</table>

**Step-by-step:**
1. Klik "Export Analysis" di sidebar
2. Klik "Buat Analisis Baru"
3. Pilih produk dari dropdown (harus sudah di-enrich)
4. Pilih negara tujuan dari 190+ negara
5. Klik "Mulai Analisis"
6. Tunggu 2-5 menit (AI memproses regulasi)
7. Lihat hasil: Score, Issues, Recommendations
8. Klik issue untuk edit inline jika sudah diperbaiki
9. Klik "View Regulation Recommendations" untuk detail lengkap

![Export Analysis Create](docs/screenshots/export_analysis_create.png)
*Screenshot: Form buat analisis ekspor*

![Export Analysis Result](docs/screenshots/export_analysis_result.png)
*Screenshot: Hasil analisis dengan compliance issues*

![Export Analysis Recommendations](docs/screenshots/export_analysis_recommendations.png)
*Screenshot: Detail rekomendasi regulasi*

---

### 7. AI Country Comparison: Bandingkan Negara Tujuan

**Fitur AI #3** - Membandingkan kesiapan ekspor ke beberapa negara sekaligus.

**Kemampuan:**
- Bandingkan hingga 5 negara sekaligus
- Identifikasi common issues di semua negara
- Ranking negara berdasarkan readiness score
- Rekomendasi prioritas negara

**User Journey:**
```
Export Analysis → Compare Countries → Pilih Produk → Pilih 2-5 Negara → Tunggu → Lihat Perbandingan
```

**Contoh Before & After:**

<table>
<tr>
<th>INPUT</th>
<th>OUTPUT AI</th>
</tr>
<tr>
<td>

```
Produk: Kopi Arabika Gayo

Negara yang dibandingkan:
1. Singapore
2. Malaysia
3. Thailand
4. Japan
5. USA
```

</td>
<td>

```
COMPARISON RESULTS:

RANKING BY READINESS:
1. Singapore  - 92/100 ✅ Ready
2. Malaysia   - 85/100 ✅ Ready
3. Thailand   - 72/100 ⚠️ Warning
4. Japan      - 58/100 ⚠️ Warning
5. USA        - 45/100 ❌ Critical

COMMON ISSUES (All Countries):
• English product description needed
• Net weight must be in metric units
• Shelf life date format varies

RECOMMENDATION:
"Mulai dengan Singapore karena regulasi
paling sederhana dan demand tinggi untuk
specialty coffee. Kemudian expand ke
Malaysia yang memiliki market serupa."

PER-COUNTRY SUMMARY:

Singapore (92):
- Minimal certification needed
- No halal required for coffee
- Low tariff (0% AFTA)

Malaysia (85):
- Halal certification recommended
- SIRIM approval needed
- Low tariff (0% AFTA)

Thailand (72):
- Thai FDA registration required
- Thai language labeling mandatory
- 5% ATIGA tariff

Japan (58):
- JAS certification complex
- Japanese labeling strict
- Quarantine inspection

USA (45):
- FDA registration mandatory
- Prior Notice required
- Complex labeling rules
```

</td>
</tr>
</table>

**Step-by-step:**
1. Buka halaman Export Analysis
2. Klik tab "Compare Countries"
3. Pilih produk dari dropdown
4. Pilih 2-5 negara untuk dibandingkan
5. Klik "Compare"
6. Lihat hasil perbandingan side-by-side
7. Klik negara untuk detail lengkap

![Country Comparison](docs/screenshots/export_analysis_compare.png)
*Screenshot: Perbandingan antar negara*

---

### 8. AI Market Intelligence: Rekomendasi Pasar

**Fitur AI #4** - AI merekomendasikan negara terbaik untuk produk Anda.

**Apa yang Dianalisis:**
| Faktor | Deskripsi |
|--------|-----------|
| Market Size | Ukuran pasar untuk kategori produk |
| Demand Score | Tingkat permintaan |
| Competition | Tingkat kompetisi |
| Entry Barriers | Hambatan masuk pasar |
| Growth Trend | Tren pertumbuhan |
| Price Point | Range harga yang kompetitif |

**Output:**
- Top 3-5 negara rekomendasi dengan score
- Negara yang sebaiknya dihindari
- Market trends untuk produk
- Competitive landscape
- Growth opportunities
- Risk factors
- Recommended forwarders per route

**User Journey:**
```
Marketing → Tab Market Intelligence → Pilih Produk → Generate Analysis → Lihat Rekomendasi
```

**Contoh Before & After:**

<table>
<tr>
<th>INPUT</th>
<th>OUTPUT AI</th>
</tr>
<tr>
<td>

```
Produk: Kopi Arabika Gayo
(sudah enriched)
```

</td>
<td>

```
MARKET INTELLIGENCE REPORT

TOP RECOMMENDED COUNTRIES:

1. SINGAPORE (Score: 92)
   Market Size: High
   Competition: Moderate
   Price Point: $12-18/kg
   Entry Strategy: Partner with specialty
   importers like PPP Coffee

2. SOUTH KOREA (Score: 87)
   Market Size: Very High
   Competition: Moderate-High
   Price Point: $15-22/kg
   Entry Strategy: Target third-wave
   coffee shop chains

3. AUSTRALIA (Score: 84)
   Market Size: High
   Competition: High
   Price Point: $14-20/kg
   Entry Strategy: Attend MICE expo,
   organic certification helps

COUNTRIES TO AVOID:
• Brazil - Domestic production dominant
• Vietnam - Price competition intense
• Ethiopia - Origin country preference

MARKET TRENDS:
• Specialty single-origin growing 15% YoY
• Sustainability certification increasingly
  required
• Direct trade models gaining traction

RISKS:
• Currency fluctuation (IDR weakness)
• Climate impact on supply
• Shipping cost volatility

RECOMMENDED FORWARDERS:
Singapore route: [List of top-rated]
Korea route: [List of top-rated]
```

</td>
</tr>
</table>

**Step-by-step:**
1. Buka halaman Marketing
2. Pilih tab "Market Intelligence"
3. Pilih produk dari dropdown
4. Klik "Generate Market Analysis"
5. Tunggu proses AI
6. Lihat negara rekomendasi dengan score
7. Klik negara untuk detail market info
8. Lihat recommended forwarders per route

![Market Intelligence](docs/screenshots/market_intelligence.png)
*Screenshot: Hasil market intelligence dengan negara rekomendasi*

---

### 9. AI Pricing Calculator: Kalkulasi Harga Ekspor

**Fitur AI #5** - Menghitung harga ekspor optimal dengan berbagai Incoterm.

**Incoterm yang Didukung:**
| Incoterm | Nama | Deskripsi |
|----------|------|-----------|
| **EXW** | Ex Works | Harga di pabrik/gudang |
| **FOB** | Free On Board | Harga sampai di kapal (port asal) |
| **CIF** | Cost, Insurance, Freight | Harga sampai port tujuan + asuransi |

**Input yang Diperlukan:**
- COGS per unit (HPP dalam IDR)
- Biaya packaging per unit
- Target margin (%)
- Negara tujuan (untuk estimasi freight)

**User Journey:**
```
Marketing → Tab Pricing → Pilih Produk → Input Costs → Calculate → Lihat Breakdown
```

**Contoh Before & After:**

<table>
<tr>
<th>INPUT</th>
<th>OUTPUT AI</th>
</tr>
<tr>
<td>

```
Produk: Kopi Arabika Gayo 250g
COGS: Rp 45.000/unit
Packaging: Rp 5.000/unit
Target Margin: 40%
Destination: Singapore
```

</td>
<td>

```
PRICING CALCULATION

Exchange Rate: 1 USD = Rp 15.500

BASE COSTS:
COGS: Rp 45.000 = $2.90
Packaging: Rp 5.000 = $0.32
Total Base: $3.22

PRICING BREAKDOWN:

EXW (Ex Works):
Base Cost:        $3.22
Margin (40%):     $1.29
Local Handling:   $0.15
─────────────────────────
EXW Price:        $4.66

FOB (Free On Board):
EXW Price:        $4.66
Inland Transport: $0.20
Port Charges:     $0.12
Export Docs:      $0.08
─────────────────────────
FOB Price:        $5.06

CIF Singapore:
FOB Price:        $5.06
Sea Freight:      $0.35
Insurance (1.1%): $0.06
─────────────────────────
CIF Price:        $5.47

PRICING INSIGHT:
"Harga CIF $5.47/250g competitive untuk
specialty coffee Singapore. Rata-rata
retail di Singapore $8-12/250g,
memberikan margin yang cukup untuk
importir."

Per Carton (48 units):
FOB: $242.88
CIF: $262.56
```

</td>
</tr>
</table>

**Step-by-step:**
1. Buka halaman Marketing
2. Pilih tab "Pricing Calculator"
3. Pilih produk dari dropdown
4. Input COGS dalam IDR
5. Input biaya packaging
6. Set target margin percentage
7. Pilih negara tujuan
8. Klik "Calculate"
9. Lihat breakdown EXW, FOB, CIF
10. Copy atau simpan untuk quotation

![Pricing Calculator](docs/screenshots/pricing_calculator.png)
*Screenshot: Kalkulator harga dengan breakdown*

---

### 10. Costing Management

Simpan dan kelola semua perhitungan harga untuk referensi.

**Fitur:**
- Simpan multiple costing per produk
- Riwayat perhitungan
- Berbagai skenario pricing
- Export untuk quotation
- Currency rate tracking

**User Journey:**
```
Costing → Create New → Input Data → Save → View History → Edit/Delete
```

**Step-by-step:**
1. Buka halaman Costing
2. Klik "Buat Costing Baru"
3. Pilih produk
4. Input semua biaya komponen
5. Set margin dan parameter
6. Klik "Hitung"
7. Review hasil
8. Klik "Simpan"
9. Costing tersimpan di daftar untuk referensi

![Costing List](docs/screenshots/costing_list.png)
*Screenshot: Daftar costing tersimpan*

![Costing Detail](docs/screenshots/costing_detail.png)
*Screenshot: Detail costing dengan breakdown*

---

### 11. AI Catalog Description Generator

**Fitur AI #6** - Generate deskripsi katalog siap ekspor dengan spesifikasi teknis.

**Yang Di-generate:**
| Section | Konten |
|---------|--------|
| Export Description | Deskripsi profesional untuk B2B |
| Technical Specs | Spesifikasi teknis lengkap |
| Safety Information | Info keamanan & penyimpanan |

**User Journey:**
```
Catalog Detail → Klik "Generate AI Description" → Tunggu → Review → Edit → Save
```

**Contoh Before & After:**

<table>
<tr>
<th>INPUT (Produk)</th>
<th>OUTPUT AI (Deskripsi Katalog)</th>
</tr>
<tr>
<td>

```
Produk: Keripik Tempe
Kategori: Makanan Olahan
Deskripsi: Keripik tempe renyah
```

</td>
<td>

```
EXPORT DESCRIPTION:
Premium Indonesian Tempeh Chips -
Authentic plant-based snack made from
fermented soybeans. Crispy texture with
savory seasoning. High in protein,
suitable for vegetarian and vegan diets.
Perfect for retail, food service, and
private label opportunities.

TECHNICAL SPECIFICATIONS:
• Product: Fried Tempeh Chips
• Ingredients: Tempeh (soybean, Rhizopus
  culture), vegetable oil, salt, garlic
• Net Weight: 100g per pack
• Shelf Life: 6 months from production
• Storage: Cool, dry place (<25°C)
• Packaging: Metalized film, nitrogen flush
• Units per Carton: 24 packs
• Carton Dimensions: 40×30×25 cm
• Carton Weight: 3.2 kg

CERTIFICATIONS:
• Halal MUI certified
• BPOM registered
• ISO 22000 facility

SAFETY INFORMATION:
• Contains: Soy
• May contain: Traces of wheat, peanut
• Allergen warning on label
• Not suitable for people with soy allergy
• Store away from direct sunlight
• Best consumed within 1 month after opening
```

</td>
</tr>
</table>

**Step-by-step:**
1. Buka halaman Catalog detail
2. Klik "Generate AI Description"
3. Tunggu proses AI
4. Review description, specs, safety info
5. Edit jika diperlukan
6. Klik "Save to Catalog"

![Catalog AI Description](docs/screenshots/catalog_ai_description.png)
*Screenshot: Generated catalog description*

---

### 12. Katalog Digital

Buat katalog ekspor profesional untuk dibagikan ke buyer.

**Fitur Katalog:**
| Fitur | Deskripsi |
|-------|-----------|
| Product Info | Dari data produk yang sudah enriched |
| Multiple Images | Upload hingga 10 foto produk |
| Variants | Size, color, material variants |
| Pricing | EXW, FOB, CIF prices |
| MOQ | Minimum Order Quantity |
| Lead Time | Waktu produksi |
| AI Description | Generated description |

**User Journey:**
```
Catalogs → Create → Select Product → Add Details → Upload Images → Add Variants → Generate AI Description → Publish
```

**Step-by-step:**
1. Klik "Buat Katalog Baru"
2. Pilih produk sebagai base
3. Set harga dasar (EXW)
4. Set MOQ dan lead time
5. Upload foto produk (primary + gallery)
6. Tambah variant types (size, color, dll)
7. Tambah variant options
8. Generate AI description
9. Review semua informasi
10. Klik "Publish" untuk aktifkan katalog
11. Katalog dapat dilihat Buyer dan Forwarder

![Catalog Create](docs/screenshots/catalog_create.png)
*Screenshot: Form buat katalog*

![Catalog Images](docs/screenshots/catalog_images.png)
*Screenshot: Manajemen foto katalog*

![Catalog Variants](docs/screenshots/catalog_variants.png)
*Screenshot: Manajemen varian produk*

![Catalog Detail](docs/screenshots/catalog_detail.png)
*Screenshot: Detail katalog lengkap*

---

### 13. AI Chatbot: Asisten Ekspor 24/7

**Fitur AI #7** - Konsultasi ekspor real-time dengan AI yang terlatih khusus.

**Kemampuan Chatbot:**
| Topik | Contoh Pertanyaan |
|-------|-------------------|
| Dokumen | "Dokumen apa saja untuk ekspor ke Jepang?" |
| Regulasi | "Apa syarat sertifikasi FDA untuk makanan?" |
| Tarif | "Berapa tarif impor kopi di Australia?" |
| Prosedur | "Bagaimana cara mendaftar HS Code?" |
| Shipping | "Estimasi biaya kirim 1 ton ke Singapore?" |
| Market | "Negara mana yang bagus untuk kerajinan?" |

**Fitur:**
- Multiple chat sessions
- Chat history tersimpan
- Suggested questions
- Markdown formatting dalam response
- Copy response button

**User Journey:**
```
Chat → New Session (atau lanjut existing) → Ketik Pertanyaan → Kirim → Dapat Jawaban → Lanjut Dialog
```

**Contoh Percakapan:**

```
USER:
Saya mau ekspor keripik tempe ke Singapura.
Apa saja yang perlu disiapkan?

AI ASSISTANT:
Untuk ekspor keripik tempe ke Singapura,
berikut persiapan yang diperlukan:

📋 DOKUMEN WAJIB:
1. Invoice & Packing List
2. Certificate of Origin (Form D)
3. Health Certificate dari BPOM
4. Halal Certificate (jika target market Muslim)

🏷️ LABELING REQUIREMENTS:
- Bahasa Inggris
- Ingredients list
- Net weight
- Country of origin: Indonesia
- Best before date
- Allergen warning (contains: soy)

💰 TARIF & BIAYA:
- Import duty: 0% (AFTA)
- GST: 9%

📦 TIPS:
- Singapore Food Agency (SFA) registration
  dilakukan oleh importir lokal
- Shelf life minimal 6 bulan dari kedatangan
- Sample dapat dikirim via kurir untuk testing

Apakah ada yang ingin ditanyakan lebih detail?
```

**Step-by-step:**
1. Klik "Chat" di sidebar
2. Klik "New Chat" untuk session baru
3. Lihat suggested questions atau ketik sendiri
4. Tekan Enter atau klik Send
5. Tunggu response AI
6. Lanjutkan dialog sesuai kebutuhan
7. Session tersimpan otomatis

![Chatbot Welcome](docs/screenshots/chatbot_welcome.png)
*Screenshot: Welcome screen dengan suggestions*

![Chatbot Conversation](docs/screenshots/chatbot_conversation.png)
*Screenshot: Percakapan dengan AI assistant*

![Chatbot Sessions](docs/screenshots/chatbot_sessions.png)
*Screenshot: Sidebar dengan multiple sessions*

---

### 14. Buyer Requests & Matching

Platform pencocokan antara Buyer dan UMKM.

**Untuk Buyer - Membuat Request:**
| Field | Deskripsi |
|-------|-----------|
| Kategori Produk | Jenis produk yang dicari |
| Spesifikasi | Detail requirement |
| Volume Target | Jumlah yang dibutuhkan |
| Negara Tujuan | Kemana produk akan diimpor |
| HS Code (opsional) | Jika sudah tahu |
| Min Rank UMKM | Filter kualitas supplier |
| Keywords | Tag untuk matching |

**Untuk UMKM - Melihat Matched Requests:**
- Daftar buyer requests yang cocok dengan produk
- Match score berdasarkan AI matching
- Detail request dan buyer info
- Katalog yang cocok dengan request

**User Journey (Buyer):**
```
Buyer Requests → Create → Isi Detail → Submit → Tunggu Matching → Lihat Matched Suppliers
```

**User Journey (UMKM):**
```
Buyer Requests → Lihat Open Requests → Filter by Category → Lihat Detail → Lihat Matched Catalogs
```

**Step-by-step (Buyer):**
1. Login sebagai Buyer
2. Buka Buyer Requests
3. Klik "Buat Request Baru"
4. Pilih kategori produk
5. Isi spesifikasi detail
6. Set target volume
7. Pilih negara tujuan
8. Tambah keywords
9. Submit
10. AI akan match dengan UMKM yang sesuai
11. Lihat matched suppliers dan kontaknya

**Step-by-step (UMKM):**
1. Login sebagai UMKM
2. Buka Buyer Requests
3. Lihat daftar open requests
4. Filter by category atau keyword
5. Klik request untuk detail
6. Lihat "Matched Catalogs" (katalog Anda yang cocok)
7. Hubungi buyer jika tertarik

![Buyer Request Create](docs/screenshots/buyer_request_create.png)
*Screenshot: Form buat buyer request*

![Buyer Request List](docs/screenshots/buyer_request_list.png)
*Screenshot: Daftar buyer requests*

![Buyer Request Matched](docs/screenshots/buyer_request_matched.png)
*Screenshot: Matched suppliers untuk request*

---

### 15. Jaringan Buyer

Database buyer internasional yang terverifikasi.

**Informasi Buyer:**
| Field | Contoh |
|-------|--------|
| Company Name | ABC Trading Co. |
| Country | Japan |
| Business Type | Importir / Distributor |
| Categories | Makanan, Minuman |
| Import Volume | 10-50 ton/bulan |
| Contact | Email, Phone |

**User Journey:**
```
Buyers → Browse → Filter by Category/Country → View Profile → Contact
```

![Buyer List](docs/screenshots/buyer_list.png)
*Screenshot: Daftar buyer dengan filter*

![Buyer Profile](docs/screenshots/buyer_profile.png)
*Screenshot: Detail profil buyer*

---

### 16. Jaringan Forwarder

Database freight forwarder dengan rating dan review.

**Informasi Forwarder:**
| Field | Contoh |
|-------|--------|
| Company Name | XYZ Logistics |
| Routes | ID-SG, ID-MY, ID-JP |
| Services | Sea FCL, Sea LCL, Air Freight |
| Rating | 4.5/5 (120 reviews) |
| Contact | Email, Phone, Website |

**Fitur:**
- Filter by route (origin-destination)
- Filter by service type
- Sort by rating
- Read reviews dari UMKM lain
- Leave review setelah shipping

**User Journey:**
```
Forwarders → Filter by Route → Sort by Rating → View Profile → Read Reviews → Contact
```

**Step-by-step:**
1. Buka halaman Forwarders
2. Filter by route (misal: ID-SG)
3. Filter by service (misal: Sea Freight)
4. Sort by highest rating
5. Klik forwarder untuk detail
6. Baca reviews dari UMKM lain
7. Lihat statistik (rating distribution)
8. Contact via email/phone
9. Setelah shipping, tinggalkan review

![Forwarder List](docs/screenshots/forwarder_list.png)
*Screenshot: Daftar forwarder dengan filter*

![Forwarder Detail](docs/screenshots/forwarder_detail.png)
*Screenshot: Detail forwarder dengan reviews*

![Forwarder Review](docs/screenshots/forwarder_review.png)
*Screenshot: Form review forwarder*

---

### 17. Pusat Pembelajaran (Educational Hub)

Materi edukasi lengkap seputar ekspor untuk semua level.

**Struktur Konten:**
```
Modules (Topik Utama)
└── Articles (Artikel dalam Modul)
    ├── Text Content (Markdown)
    ├── Video URL (YouTube/embed)
    └── Attachments (PDF guides)
```

**Contoh Modul:**
| Modul | Artikel |
|-------|---------|
| Dasar-Dasar Ekspor | Apa itu Ekspor?, Jenis Incoterm, Dokumen Wajib |
| Sertifikasi | Halal, FDA, CE Mark, HACCP |
| Logistik | Sea Freight vs Air, Kontainer, Asuransi |
| Pricing | Menghitung HPP, Margin, Currency |
| Market Research | Riset Pasar, Competitor Analysis |

**User Journey:**
```
Educational → Browse Modules → Pilih Modul → Baca Artikel → Download Attachment → Watch Video
```

**Step-by-step:**
1. Buka halaman Educational
2. Browse modul yang tersedia
3. Klik modul untuk expand articles
4. Klik artikel untuk baca
5. Download PDF attachment jika ada
6. Watch video jika ada
7. Lanjut ke artikel berikutnya

![Educational Hub](docs/screenshots/educational_hub.png)
*Screenshot: Pusat pembelajaran dengan modul*

![Educational Article](docs/screenshots/educational_article.png)
*Screenshot: Artikel dengan video dan attachment*

---

### 18. Profil Bisnis & Sertifikasi

Kelola profil bisnis UMKM dan sertifikasi yang dimiliki.

**Informasi Profil:**
| Section | Data |
|---------|------|
| Company Info | Nama, alamat, kontak |
| Legal | NPWP, NIB, SIUP |
| Bank | Rekening untuk transaksi |
| Capacity | Kapasitas produksi |

**Sertifikasi yang Bisa Ditambahkan:**
- Halal MUI
- BPOM
- ISO 9001 / ISO 22000
- HACCP
- Organic
- SNI
- SVLK (untuk produk kayu)

**User Journey:**
```
Business Profile → Edit Profile → Upload Certifications → Save
```

**Step-by-step:**
1. Buka Business Profile
2. Klik Edit untuk update data
3. Isi semua informasi lengkap
4. Buka tab Certifications
5. Klik "Add Certification"
6. Pilih jenis sertifikasi
7. Upload scan dokumen
8. Set expiry date
9. Save
10. Sertifikasi muncul di profil dan katalog

![Business Profile](docs/screenshots/business_profile.png)
*Screenshot: Halaman profil bisnis*

![Certifications](docs/screenshots/certifications.png)
*Screenshot: Manajemen sertifikasi*

---

### 19. Admin Panel

Panel khusus administrator untuk manage platform.

**Fitur Admin:**
| Menu | Fungsi |
|------|--------|
| Dashboard | System-wide metrics |
| Users | List, view, delete users |
| Educational | Manage modules & articles |
| All Data | View all products, catalogs, analyses |

**User Journey (Admin):**
```
Dashboard → View Metrics → Users (manage) → Educational Admin (create content)
```

![Admin Dashboard](docs/screenshots/admin_dashboard.png)
*Screenshot: Admin dashboard*

![Admin Users](docs/screenshots/admin_users.png)
*Screenshot: User management*

![Admin Educational](docs/screenshots/admin_educational.png)
*Screenshot: Educational content management*

---

## Role & Hak Akses

### Matriks Akses Fitur

| # | Fitur | UMKM | Buyer | Forwarder | Admin |
|---|-------|:----:|:-----:|:---------:|:-----:|
| 1 | Landing Page | ✅ | ✅ | ✅ | ✅ |
| 2 | Autentikasi | ✅ | ✅ | ✅ | ✅ |
| 3 | Dashboard | ✅ | ✅ | ✅ | ✅ (Admin View) |
| 4 | Manajemen Produk | ✅ CRUD | - | - | View Only |
| 5 | AI Enrichment (SKU & HS Code) | ✅ | - | - | - |
| 6 | AI Export Analysis | ✅ | - | - | View Only |
| 7 | AI Country Comparison | ✅ | - | - | View Only |
| 8 | AI Market Intelligence | ✅ | - | - | - |
| 9 | AI Pricing Calculator | ✅ | - | - | - |
| 10 | Costing Management | ✅ CRUD | - | - | - |
| 11 | AI Catalog Description | ✅ | - | - | - |
| 12 | Katalog Digital | ✅ CRUD | View Published | View Published | View All |
| 13 | AI Chatbot | ✅ | ✅ | ✅ | ✅ |
| 14 | Buyer Requests | View Matched | ✅ CRUD | - | View All |
| 15 | Jaringan Buyer | View | Profile | - | View All |
| 16 | Jaringan Forwarder | View + Review | View | Profile | View All |
| 17 | Educational Hub | ✅ | ✅ | ✅ | ✅ + Manage |
| 18 | Profil Bisnis | ✅ CRUD | ✅ CRUD | ✅ CRUD | View All |
| 19 | Admin Panel | - | - | - | ✅ |

### Keterangan:
- **✅ CRUD** = Create, Read, Update, Delete (akses penuh)
- **✅** = Akses penuh untuk role tersebut
- **View** = Hanya bisa melihat, tidak bisa edit
- **View Only** = Akses read-only untuk monitoring
- **View All** = Bisa melihat semua data sistem
- **Profile** = Hanya bisa manage profil sendiri
- **-** = Tidak ada akses

### Ringkasan Per Role:

**UMKM (Eksportir)**
- Akses penuh ke semua fitur AI (Enrichment, Analysis, Market Intelligence, Pricing, Catalog Description)
- Manage produk dan katalog
- View buyer requests yang match dengan produk
- Review forwarders

**Buyer (Importir)**
- Buat dan manage buyer requests
- Browse katalog yang sudah published
- Manage profil buyer
- Akses chatbot dan educational

**Forwarder (Logistik)**
- Manage profil forwarder
- Browse katalog UMKM
- Terima rating & review dari UMKM
- Akses chatbot dan educational

**Admin (Administrator)**
- View semua data sistem
- Manage users
- Manage konten educational
- Monitor semua aktivitas platform

---

## Konfigurasi

### Environment Variables

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `NEXT_PUBLIC_API_URL` | URL Backend API | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_APP_URL` | URL Frontend | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Nama Aplikasi | `ExportReadyAI` |

### API Endpoints

Konfigurasi endpoint API ada di `src/config/api.config.ts`. Endpoint utama:

```typescript
{
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    me: '/auth/me/',
  },
  products: {
    list: '/products/',
    enrich: (id) => `/products/${id}/enrich/`,
  },
  exportAnalysis: {
    analyze: (id) => `/products/${id}/ai/export-analysis/`,
  },
  chat: {
    send: '/chat/send/',
    sessions: '/chat/sessions/',
  },
  // ... dan lainnya
}
```

---

## Daftar Screenshot yang Diperlukan

Simpan semua screenshot ke folder `docs/screenshots/` dengan nama file berikut:

| No | Nama File | Halaman/Fitur |
|----|-----------|---------------|
| 1 | `logo.png` | Logo ExportReadyAI |
| 2 | `landing_hero.png` | Landing page - Hero section |
| 3 | `landing_features.png` | Landing page - Features section |
| 4 | `login.png` | Halaman login |
| 5 | `register.png` | Halaman register dengan pilihan role |
| 6 | `dashboard_umkm.png` | Dashboard UMKM dengan statistik |
| 7 | `dashboard_admin.png` | Dashboard Admin dengan metrics |
| 8 | `products_list.png` | Daftar produk dengan status enrichment |
| 9 | `product_create.png` | Form tambah produk |
| 10 | `product_detail.png` | Detail produk dengan tombol AI |
| 11 | `ai_enrichment_loading.png` | Proses AI enrichment sedang berjalan |
| 12 | `ai_enrichment_result.png` | Hasil AI enrichment (HS Code, SKU, dll) |
| 13 | `ai_enrichment_edit.png` | Form edit hasil enrichment |
| 14 | `export_analysis_create.png` | Form buat analisis ekspor |
| 15 | `export_analysis_result.png` | Hasil analisis dengan compliance issues |
| 16 | `export_analysis_recommendations.png` | Detail rekomendasi regulasi |
| 17 | `export_analysis_compare.png` | Perbandingan antar negara |
| 18 | `market_intelligence.png` | Hasil market intelligence |
| 19 | `pricing_calculator.png` | Kalkulator harga dengan breakdown |
| 20 | `costing_list.png` | Daftar costing tersimpan |
| 21 | `costing_detail.png` | Detail costing dengan breakdown |
| 22 | `catalog_ai_description.png` | Generated catalog description |
| 23 | `catalog_create.png` | Form buat katalog |
| 24 | `catalog_images.png` | Manajemen foto katalog |
| 25 | `catalog_variants.png` | Manajemen varian produk |
| 26 | `catalog_detail.png` | Detail katalog lengkap |
| 27 | `chatbot_welcome.png` | Welcome screen chatbot |
| 28 | `chatbot_conversation.png` | Percakapan dengan AI |
| 29 | `chatbot_sessions.png` | Sidebar dengan multiple sessions |
| 30 | `buyer_request_create.png` | Form buat buyer request |
| 31 | `buyer_request_list.png` | Daftar buyer requests |
| 32 | `buyer_request_matched.png` | Matched suppliers untuk request |
| 33 | `buyer_list.png` | Daftar buyer dengan filter |
| 34 | `buyer_profile.png` | Detail profil buyer |
| 35 | `forwarder_list.png` | Daftar forwarder dengan filter |
| 36 | `forwarder_detail.png` | Detail forwarder dengan reviews |
| 37 | `forwarder_review.png` | Form review forwarder |
| 38 | `educational_hub.png` | Pusat pembelajaran dengan modul |
| 39 | `educational_article.png` | Artikel dengan video dan attachment |
| 40 | `business_profile.png` | Halaman profil bisnis |
| 41 | `certifications.png` | Manajemen sertifikasi |
| 42 | `admin_dashboard.png` | Admin dashboard |
| 43 | `admin_users.png` | User management |
| 44 | `admin_educational.png` | Educational content management |

**Tips mengambil screenshot:**
- Gunakan resolusi 1920×1080 untuk konsistensi
- Crop hanya bagian yang relevan (tanpa browser chrome)
- Gunakan data sample yang representatif
- Pastikan tidak ada data sensitif yang terlihat

---

## Troubleshooting

### Error: "npm install" gagal

```bash
# Hapus node_modules dan package-lock, lalu install ulang
rm -rf node_modules package-lock.json
npm install
```

### Error: Port 3000 sudah digunakan

```bash
# Jalankan di port lain
npm run dev -- -p 3001
```

### Error: API Connection Failed

1. Pastikan backend sudah berjalan
2. Cek URL di `.env.local` sudah benar
3. Pastikan tidak ada typo
4. Cek apakah backend mengizinkan CORS dari localhost:3000

### Error: "Module not found"

```bash
# Install ulang dependencies
npm install
```

### Halaman loading terus / blank

1. Buka Developer Tools (F12)
2. Cek tab Console untuk error message
3. Cek tab Network untuk failed requests

---

## Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan production server |
| `npm run lint` | Cek kualitas code |

---

## Tim Pengembang

**ExportReadyAI Team** - Hackathon 2024

---

## Lisensi

Proyek ini dikembangkan untuk keperluan hackathon dan demonstrasi.

---

<p align="center">
  <strong>ExportReadyAI</strong><br/>
  Memberdayakan 100.000 UMKM Indonesia Menjadi Eksportir Sukses
</p>
