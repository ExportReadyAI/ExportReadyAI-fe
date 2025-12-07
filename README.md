# ExportReadyAI - Dokumentation

<p align="center">
  <img src="https://github.com/user-attachments/assets/2fd38586-1ba9-4e4e-9d43-cb62c97edfa0" alt="ExportReadyAI Logo" width="200"/>
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

# 🚀 ExportReady.AI

> **From Local Hero to Global Player.**
> _Platform AI End-to-End untuk Menstandarkan Produk UMKM Indonesia agar Lolos Kurasi Buyer Internasional._

---

## 📖 Tentang Proyek

**ExportReady.AI** bukan sekadar aplikasi pencatatan, melainkan sebuah **Ekosistem Pintar**. Kami hadir untuk menghancurkan tembok penghalang yang selama ini membuat UMKM takut untuk ekspor.

Platform ini menggabungkan **Kecerdasan Buatan (Generative & Logic AI)** dengan keahlian logistik mendalam untuk mengubah proses ekspor yang rumit menjadi alur kerja yang sederhana, terukur, dan otomatis.

Kami mengubah *"Saya tidak tahu caranya"* menjadi *"Produk saya siap kirim ke Jepang minggu depan"*.

---

## 💡 Mengapa ExportReady.AI Adalah "Game Changer"?

Banyak UMKM punya produk bagus, tapi gagal di administrasi dan standar global. Kami menyelesaikan 5 masalah terbesar dalam ekspor:

| ❌ The Nightmare (Tantangan Lama) | ✅ The AI Solution (ExportReady.AI) |
| :--- | :--- |
| **Buta Arah** <br> Tidak tahu harus mulai dari mana atau dokumen apa yang disiapkan. | **AI Export Consultant 24/7** 🤖 <br> Panduan langkah-demi-langkah (roadmap) yang dipersonalisasi. |
| **Manual & Lambat** <br> Mencari HS Code yang tepat bisa memakan waktu berjam-jam. | **Instant HS Code Finder** ⚡ <br> Deteksi otomatis hanya dari deskripsi produk dalam hitungan detik. |
| **Resiko Rejection** <br> Produk ditahan bea cukai karena kandungan/kemasan salah. | **AI Compliance Audit** 🛡️ <br> Analisis otomatis terhadap aturan ketat negara tujuan (misal: Jepang/EU). |
| **Salah Harga = Rugi** <br> Menentukan harga jual ekspor seringkali hanya menebak-nebak. | **Smart Pricing Calculator** 💰 <br> Hitungan real-time dari HPP ke FOB/CIF + Estimasi kontainer. |
| **Pasar Gelap** <br> Sulit menemukan pembeli yang valid dan logistik terpercaya. | **AI Market Connect** 🌍 <br> Matchmaking otomatis dengan Buyer & Forwarder terverifikasi. |

---

## 🔥 Fitur Unggulan (Core Modules)

Aplikasi ini dibangun di atas 7 Modul Terintegrasi:

### 🎓 1. Export Career Mode (Gamified)
Sistem level & badge (**"Japan Ready"**, **"Halal Certified"**) yang mendorong UMKM meningkatkan kualitas agar dilirik buyer.

### 📝 2. Intelligent Product Input (No-Photo Needed)
Input spesifikasi produk dalam teks, AI langsung menstandarisasi deskripsi menjadi bahasa bisnis internasional (B2B English).

### ⚖️ 3. AI Compliance Guardian
Sistem "Logic Guard" yang mencegah UMKM mengirim barang yang dilarang atau tidak sesuai spesifikasi negara tujuan.

### 💸 4. Export Calculator & Logistics
Simulasi keuntungan anti-rugi. Menghitung biaya kardus, volume kontainer, hingga rekomendasi Forwarder terbaik.

### 🤝 5. Smart RFQ Matching
Bukan sekadar papan iklan. AI mencocokkan permintaan Buyer (RFQ) dengan produk UMKM yang spesifikasinya (HS Code & Grade) sesuai.

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

[Landing Page Hero]
<img width="1356" height="628" alt="image" src="https://github.com/user-attachments/assets/dd904c52-a8ab-47b8-96fd-c6a0e41391f5" />


[Landing Page Features]
<img width="1354" height="629" alt="image" src="https://github.com/user-attachments/assets/18e229af-5aa8-40ce-be2f-91e08a48d225" />


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

[Login Page]
<img width="1360" height="627" alt="image" src="https://github.com/user-attachments/assets/17f9a651-2c9c-4943-9f70-df31f0a2e33c" />


[Register Page]
<img width="1352" height="625" alt="image" src="https://github.com/user-attachments/assets/4191b073-5c7c-4349-857a-b1284ff49a3b" />


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

[Dashboard UMKM]
<img width="1352" height="627" alt="image" src="https://github.com/user-attachments/assets/3667f032-6181-4827-9f70-04fa5d29989d" />


[Dashboard Admin]
<img width="1350" height="627" alt="image" src="https://github.com/user-attachments/assets/6b8ef3b1-97ea-4bff-81b4-f74c46cacd60" />


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

[Products List]
<img width="1362" height="633" alt="image" src="https://github.com/user-attachments/assets/b9fb5ce1-776b-4e2b-976d-7fa201dea489" />


[Create Product]
<img width="1356" height="627" alt="image" src="https://github.com/user-attachments/assets/c9d3b9c2-f134-492e-90c1-8cd785523839" />


[Product Detail]
<img width="377" height="561" alt="image" src="https://github.com/user-attachments/assets/fd4f0072-460c-4cd3-8618-79a44419e3e4" />
<img width="376" height="276" alt="image" src="https://github.com/user-attachments/assets/a6d0aa4b-9b97-4aad-9348-67f1047a54a0" />


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
5. Hasil ditampilkan: HS Code based by database, SKU, Nama B2B, Deskripsi, Highlights
6. Klik icon Copy untuk menyalin ke clipboard
7. Klik "Edit Manual" jika ingin menyesuaikan hasil

[AI Generate SKU & HS Code  Process]
<img width="368" height="560" alt="image" src="https://github.com/user-attachments/assets/177e2357-72b6-4c92-9b30-b34640726cd5" />


[AI Generate SKU & HS Code Result]
<img width="353" height="265" alt="image" src="https://github.com/user-attachments/assets/26de41e6-f4ae-4aee-813f-f842eb5b263a" />

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

[Export Analysis Create]
<img width="1357" height="630" alt="image" src="https://github.com/user-attachments/assets/e7a7db63-3925-474b-b171-9a28ab058dd7" />


[Export Analysis Result]
<img width="1365" height="625" alt="image" src="https://github.com/user-attachments/assets/884d2135-2d6f-4591-a682-b5fb9266adc8" />


[Export Analysis Recommendations]
<img width="1353" height="623" alt="image" src="https://github.com/user-attachments/assets/7bb074ad-8ccb-49e1-8c3e-59ba0f4b3d82" />


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

[Country Comparison]
<img width="1284" height="563" alt="image" src="https://github.com/user-attachments/assets/f15b8d7f-5f33-47d4-924e-e9f6a2d3fc2a" />

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

[Market Intelligence]
<img width="1284" height="563" alt="image" src="https://github.com/user-attachments/assets/f15b8d7f-5f33-47d4-924e-e9f6a2d3fc2a" />
<img width="1284" height="567" alt="image" src="https://github.com/user-attachments/assets/cfc8b313-cb6f-40b4-9be0-3559419fd885" />
<img width="1289" height="564" alt="image" src="https://github.com/user-attachments/assets/8227e5b9-270b-45b5-9b88-a842b19b2d49" />
<img width="1282" height="558" alt="image" src="https://github.com/user-attachments/assets/4a2a5f1b-4714-4954-87f8-6276db271f0c" />

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

[Pricing Calculator]
<img width="372" height="507" alt="image" src="https://github.com/user-attachments/assets/700f3f6b-c8d0-44d8-a6f1-a93af43b6de2" />
<img width="1356" height="629" alt="image" src="https://github.com/user-attachments/assets/89a9de51-80f0-4bb6-a721-5b13bf73b0aa" />
<img width="1357" height="624" alt="image" src="https://github.com/user-attachments/assets/247874f5-b0dd-4a6d-9612-0af344631542" />


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

[Costing List]
<img width="1353" height="628" alt="image" src="https://github.com/user-attachments/assets/170a8678-2075-4a83-a050-a306075c3130" />


[Costing Detail]
<img width="378" height="563" alt="image" src="https://github.com/user-attachments/assets/f5d33f22-784a-4f31-870c-eb84f1c05217" />

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

[Catalog AI Description]
<img width="1358" height="627" alt="image" src="https://github.com/user-attachments/assets/d7c83162-2899-4959-8319-7599ec4edb2c" />

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

[Catalog Create]
<img width="1355" height="627" alt="image" src="https://github.com/user-attachments/assets/2ac49e62-6ede-4e41-928f-58396926d6ce" />


[Catalog Images]
<img width="1357" height="619" alt="image" src="https://github.com/user-attachments/assets/2326345f-af1d-4a92-a5e2-576cf5951f24" />


[Catalog Variants]
<img width="1365" height="631" alt="image" src="https://github.com/user-attachments/assets/1b943b44-10ca-4c8e-ae08-27f223f8a8c8" />
<img width="1355" height="628" alt="image" src="https://github.com/user-attachments/assets/c5f60bc4-8d3f-4d94-9bb8-13dfd33736c1" />


[Catalog Detail]
<img width="1360" height="635" alt="image" src="https://github.com/user-attachments/assets/2cfba307-628a-4ce7-b7c4-f18cd9917ecc" />
<img width="1359" height="634" alt="image" src="https://github.com/user-attachments/assets/8e9078bb-ed13-40cb-a8d5-24374525097e" />
<img width="1352" height="635" alt="image" src="https://github.com/user-attachments/assets/02edbd4c-321c-4c94-b6bc-733ae1f1b83b" />



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

[Chatbot Welcome]
<img width="1365" height="624" alt="image" src="https://github.com/user-attachments/assets/81fb1480-80f1-4c62-a68a-b197f1c2fe23" />


[Chatbot Conversation]
<img width="1363" height="621" alt="image" src="https://github.com/user-attachments/assets/c2877d35-d139-407d-aec8-9db63744d463" />


[Chatbot Sessions]
<img width="1363" height="634" alt="image" src="https://github.com/user-attachments/assets/e50430a5-cfb6-4262-b557-72d2622ac0f0" />


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

[Buyer Request Create]
<img width="1359" height="633" alt="image" src="https://github.com/user-attachments/assets/0c8b14c5-b612-4a18-814b-e0fc477f0f1a" />


[Buyer Request List]
<img width="1356" height="630" alt="image" src="https://github.com/user-attachments/assets/00f6b20c-0c2e-465b-8eb8-161ebfadf6db" />


[Buyer Request Matched]
<img width="1364" height="630" alt="image" src="https://github.com/user-attachments/assets/cd5dab9d-8c81-4d3d-8738-65057de6b780" />

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

[Buyer List]
<img width="1357" height="624" alt="image" src="https://github.com/user-attachments/assets/c842c648-bc65-4ee1-9198-9c981e41155e" />


[Buyer Profile]
<img width="1365" height="628" alt="image" src="https://github.com/user-attachments/assets/e62263ed-0bff-455c-a885-7e72d2dc396b" />


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

[Forwarder List]
<img width="1363" height="631" alt="image" src="https://github.com/user-attachments/assets/c398f3ed-87b2-4599-8db4-633d9667f8ae" />


[Forwarder Detail]
<img width="1352" height="624" alt="image" src="https://github.com/user-attachments/assets/fd09adce-6bf9-4f6f-b6e4-d0647afeb809" />


[Forwarder Review]
<img width="801" height="426" alt="image" src="https://github.com/user-attachments/assets/987a41c7-dd7b-4e93-a395-1d1e90cce46f" />

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

[Educational Hub]
<img width="1356" height="628" alt="image" src="https://github.com/user-attachments/assets/3bd61358-8e59-4463-8b44-2a683d75b5a9" />


[Educational Article]
<img width="1345" height="624" alt="image" src="https://github.com/user-attachments/assets/1df7534c-94ae-4795-b892-910b2cff47d3" />
<img width="1358" height="620" alt="image" src="https://github.com/user-attachments/assets/accf72e6-4a13-4661-b3ea-120326977375" />


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

[Business Profile]
<img width="1356" height="624" alt="image" src="https://github.com/user-attachments/assets/09a81310-96ad-4d8a-a21a-bd1868f66d1c" />


[Certifications]
<img width="1356" height="628" alt="image" src="https://github.com/user-attachments/assets/58b656cb-f54b-4766-9efa-a746b942614d" />


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

[Admin Dashboard]
<img width="1364" height="621" alt="image" src="https://github.com/user-attachments/assets/79d1adbe-46aa-40fb-bbc4-be521946caa7" />


[Admin Users]
<img width="1358" height="626" alt="image" src="https://github.com/user-attachments/assets/bba0281e-21ae-4ddb-b068-3961c0c7d4b9" />


[Admin Educational]
<img width="1365" height="630" alt="image" src="https://github.com/user-attachments/assets/be00426e-afc6-40db-8c25-5205486984b7" />

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

**ExportReadyAI Team** - Hackathon 2025

---

## Lisensi

Proyek ini dikembangkan untuk keperluan hackathon dan demonstrasi.

---

<p align="center">
  <strong>ExportReadyAI</strong><br/>
  Memberdayakan 100.000 UMKM Indonesia Menjadi Eksportir Sukses
</p>
