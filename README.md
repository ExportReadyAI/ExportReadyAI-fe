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

### 1. Landing Page

Halaman utama yang menampilkan informasi lengkap tentang platform ExportReadyAI.

**Komponen:**
- Hero Section dengan tagline dan CTA
- Fitur Platform (8 fitur utama)
- Pain Points & Solutions
- Use Cases (5 target pengguna)
- Vision & Mission
- Footer

![Landing Page Hero](insert_screenshot_landing_hero.png)
*Screenshot: Hero section landing page*

![Landing Page Features](insert_screenshot_landing_features.png)
*Screenshot: Section fitur platform*

---

### 2. Autentikasi

Sistem login dan registrasi multi-role.

**Role yang tersedia:**
- **UMKM** - Pelaku usaha yang ingin ekspor
- **Buyer** - Pembeli internasional
- **Forwarder** - Jasa pengiriman/freight forwarder
- **Admin** - Administrator platform

**Fitur:**
- Login dengan email & password
- Registrasi dengan pilihan role
- JWT Token authentication
- Persistent login (token disimpan di localStorage)

![Login Page](insert_screenshot_login.png)
*Screenshot: Halaman login*

![Register Page](insert_screenshot_register.png)
*Screenshot: Halaman registrasi*

---

### 3. Dashboard

Dashboard utama dengan ringkasan statistik dan quick actions.

**Informasi yang ditampilkan:**
- Total produk
- Produk yang sudah di-enrich AI
- Total analisis ekspor
- Katalog aktif
- Quick action buttons

![Dashboard](insert_screenshot_dashboard.png)
*Screenshot: Dashboard utama*

---

### 4. Manajemen Produk

Kelola semua produk ekspor Anda.

**Fitur:**
- Daftar produk dengan filter & search
- 125+ kategori produk
- Detail produk lengkap
- Edit & hapus produk
- Status AI enrichment

**Informasi Produk:**
- Nama produk (lokal)
- Kategori
- Deskripsi
- Komposisi material
- Teknik produksi
- Dimensi & berat
- Spesifikasi kualitas
- Jenis kemasan

![Products List](insert_screenshot_products_list.png)
*Screenshot: Daftar produk*

![Product Detail Modal](insert_screenshot_product_detail.png)
*Screenshot: Modal detail produk*

![Create Product](insert_screenshot_product_create.png)
*Screenshot: Form tambah produk*

---

### 5. Generate SKU & HS Code (AI Enrichment)

Fitur AI untuk menggenerate informasi ekspor produk secara otomatis.

**Yang di-generate:**
- **HS Code** - Harmonized System Code untuk klasifikasi tarif
- **SKU** - Stock Keeping Unit internasional
- **Nama Produk B2B (English)** - Nama produk untuk pasar internasional
- **Deskripsi B2B (English)** - Deskripsi profesional dalam bahasa Inggris
- **Marketing Highlights** - Poin-poin keunggulan produk

**Cara Penggunaan:**
1. Buka detail produk
2. Klik tombol "Run AI"
3. Tunggu proses (sekitar 10-30 detik)
4. Hasil akan ditampilkan dan dapat di-copy

![AI Enrichment](insert_screenshot_ai_enrichment.png)
*Screenshot: Hasil AI enrichment*

---

### 6. Analisis Kepatuhan Ekspor

Analisis kesiapan ekspor produk ke negara tujuan tertentu.

**Fitur:**
- Pilih produk dan negara tujuan
- Analisis berbasis AI
- Skor kepatuhan (0-100)
- Detail persyaratan
- Rekomendasi sertifikasi
- Informasi tarif & bea
- Perbandingan antar negara

**Informasi yang dianalisis:**
- Regulasi impor negara tujuan
- Persyaratan sertifikasi (Halal, FDA, CE, dll)
- Tarif bea masuk
- Dokumen yang diperlukan
- Hambatan non-tarif

![Export Analysis List](insert_screenshot_export_analysis_list.png)
*Screenshot: Daftar analisis ekspor*

![Export Analysis Detail](insert_screenshot_export_analysis_detail.png)
*Screenshot: Detail hasil analisis*

![Export Analysis Compare](insert_screenshot_export_analysis_compare.png)
*Screenshot: Perbandingan negara*

---

### 7. Market Intelligence

Analisis potensi pasar untuk produk Anda di berbagai negara.

**Informasi yang disediakan:**
- Demand score (skor permintaan)
- Market size (ukuran pasar)
- Growth trend (tren pertumbuhan)
- Competition level (tingkat kompetisi)
- Entry barriers (hambatan masuk)
- Recommended countries (negara rekomendasi)

![Market Intelligence](insert_screenshot_market_intelligence.png)
*Screenshot: Market intelligence analysis*

---

### 8. Kalkulator Harga Ekspor

Hitung harga ekspor dengan berbagai incoterm.

**Incoterm yang didukung:**
- **EXW** (Ex Works) - Harga di pabrik
- **FOB** (Free On Board) - Harga sampai di kapal
- **CIF** (Cost, Insurance, Freight) - Harga termasuk asuransi & ongkir

**Fitur:**
- Input biaya produksi
- Perhitungan margin
- Konversi mata uang real-time
- Breakdown biaya lengkap
- Export & save quotation

![Pricing Calculator](insert_screenshot_pricing.png)
*Screenshot: Kalkulator harga ekspor*

![Costing List](insert_screenshot_costing_list.png)
*Screenshot: Daftar costing tersimpan*

---

### 9. Katalog Digital

Buat katalog ekspor profesional untuk dibagikan ke buyer.

**Fitur:**
- Multiple produk per katalog
- Deskripsi multi-bahasa (ID & EN)
- Galeri foto produk
- Spesifikasi teknis
- Informasi sertifikasi
- Shareable link

![Catalog List](insert_screenshot_catalog_list.png)
*Screenshot: Daftar katalog*

![Catalog Detail](insert_screenshot_catalog_detail.png)
*Screenshot: Detail katalog*

---

### 10. AI Chatbot (Asisten Ekspor)

Konsultasi ekspor 24/7 dengan AI yang terlatih khusus untuk ekspor Indonesia.

**Kemampuan:**
- Menjawab pertanyaan seputar dokumen ekspor
- Informasi regulasi dan sertifikasi
- Panduan prosedur ekspor
- Rekomendasi pasar
- Tips dan best practices

**Fitur:**
- Chat history (riwayat percakapan)
- Multiple sessions
- Suggested questions
- Markdown formatting
- Copy responses

![Chatbot Welcome](insert_screenshot_chatbot_welcome.png)
*Screenshot: Welcome screen chatbot*

![Chatbot Conversation](insert_screenshot_chatbot_conversation.png)
*Screenshot: Percakapan dengan AI*

---

### 11. Jaringan Buyer & Forwarder

Akses ke database buyer internasional dan freight forwarder terpercaya.

**Informasi Buyer:**
- Nama perusahaan
- Negara
- Kategori produk yang dicari
- Volume pembelian
- Rating & review

**Informasi Forwarder:**
- Nama perusahaan
- Rute pengiriman
- Layanan yang tersedia
- Rating & review

![Buyer List](insert_screenshot_buyer_list.png)
*Screenshot: Daftar buyer*

![Forwarder List](insert_screenshot_forwarder_list.png)
*Screenshot: Daftar forwarder*

---

### 12. Buyer Requests

Lihat dan respon permintaan dari buyer internasional.

**Informasi Request:**
- Kategori produk yang dicari
- Spesifikasi yang dibutuhkan
- Volume yang diinginkan
- Negara tujuan
- Deadline

![Buyer Requests](insert_screenshot_buyer_requests.png)
*Screenshot: Daftar permintaan buyer*

---

### 13. Pusat Pembelajaran

Materi edukasi lengkap seputar ekspor.

**Konten:**
- Modul pembelajaran terstruktur
- Artikel dan panduan
- Video tutorial
- Infografis
- FAQ

![Educational Hub](insert_screenshot_educational.png)
*Screenshot: Pusat pembelajaran*

---

### 14. Profil Bisnis

Kelola profil bisnis dan sertifikasi Anda.

**Informasi:**
- Data perusahaan
- Alamat dan kontak
- Sertifikasi yang dimiliki
- Dokumen legalitas

![Business Profile](insert_screenshot_business_profile.png)
*Screenshot: Profil bisnis*

---

## Role & Hak Akses

| Fitur | UMKM | Buyer | Forwarder | Admin |
|-------|:----:|:-----:|:---------:|:-----:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Manajemen Produk | ✅ | - | - | View |
| AI Enrichment | ✅ | - | - | - |
| Export Analysis | ✅ | - | - | View |
| Market Intelligence | ✅ | - | - | - |
| Pricing Calculator | ✅ | - | - | - |
| Katalog Digital | ✅ | View | View | View |
| AI Chatbot | ✅ | - | - | - |
| Buyer Requests | View | ✅ | - | View |
| Daftar Buyer | View | - | - | View |
| Daftar Forwarder | View | View | - | View |
| Educational | ✅ | ✅ | ✅ | ✅ |
| Profil Bisnis | ✅ | ✅ | ✅ | View |
| Manajemen User | - | - | - | ✅ |

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
