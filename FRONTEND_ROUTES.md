# 📍 Frontend Routes - ExportReady.AI

Daftar lengkap semua halaman/routing yang tersedia di aplikasi frontend.

**Base URL:** `http://localhost:3000` (atau sesuai dengan Next.js dev server)

**Format Route:** `/{locale}/{path}` dimana `locale` = `en` atau `id`

---

## 🔐 Authentication Routes (Public - No Auth Required)

### 1. Register Page
- **Route:** `/register` atau `/en/register` atau `/id/register`
- **File:** `src/app/[locale]/register/page.tsx`
- **Description:** Halaman registrasi akun baru
- **Features:**
  - Form: email, password, confirm_password, full_name
  - Client-side validation
  - Redirect ke login setelah berhasil

### 2. Login Page
- **Route:** `/login` atau `/en/login` atau `/id/login`
- **File:** `src/app/[locale]/login/page.tsx`
- **Description:** Halaman login
- **Features:**
  - Form: email, password
  - Menyimpan token ke localStorage
  - Redirect ke dashboard setelah berhasil

---

## 🏠 Dashboard & Main Routes (Auth Required)

### 3. Home Page
- **Route:** `/` atau `/en` atau `/id`
- **File:** `src/app/[locale]/page.tsx`
- **Description:** Halaman utama (existing)

### 4. Dashboard Page
- **Route:** `/dashboard` atau `/en/dashboard` atau `/id/dashboard`
- **File:** `src/app/[locale]/dashboard/page.tsx`
- **Description:** Dashboard utama dengan summary cards
- **Features:**
  - Welcome message dengan nama user
  - Summary cards (product count, analysis count, costing count)
  - Alert jika BusinessProfile belum lengkap
  - Sidebar navigation
  - Logout button

---

## 🏢 Business Profile Routes (Auth Required - UMKM)

### 5. View Business Profile
- **Route:** `/business-profile` atau `/en/business-profile` atau `/id/business-profile`
- **File:** `src/app/[locale]/business-profile/page.tsx`
- **Description:** Lihat detail profil bisnis
- **Features:**
  - Menampilkan semua informasi perusahaan
  - Daftar sertifikasi (badges)
  - Button Edit Profile
  - Button Manage Certifications
  - Button Delete Account (UMKM only)
  - Admin dapat melihat semua profiles

### 6. Create Business Profile
- **Route:** `/business-profile/create` atau `/en/business-profile/create` atau `/id/business-profile/create`
- **File:** `src/app/[locale]/business-profile/create/page.tsx`
- **Description:** Form untuk membuat profil bisnis baru
- **Features:**
  - Form: company_name, address, production_capacity_per_month, year_established
  - Client-side validation
  - Redirect ke View setelah berhasil

### 7. Edit Business Profile
- **Route:** `/business-profile/edit` atau `/en/business-profile/edit` atau `/id/business-profile/edit`
- **File:** `src/app/[locale]/business-profile/edit/page.tsx`
- **Description:** Form untuk update profil bisnis
- **Features:**
  - Form pre-filled dengan data existing
  - Update: company_name, address, production_capacity_per_month, year_established
  - Success message setelah update

### 8. Manage Certifications
- **Route:** `/business-profile/certifications` atau `/en/business-profile/certifications` atau `/id/business-profile/certifications`
- **File:** `src/app/[locale]/business-profile/certifications/page.tsx`
- **Description:** Kelola sertifikasi bisnis
- **Features:**
  - Checkbox untuk: Halal, ISO, HACCP, SVLK
  - Checkbox sudah ter-check sesuai data existing
  - Toggle untuk tambah/hapus sertifikasi
  - Success message setelah save

---

## 👥 User Management Routes (Auth Required - Admin Only)

### 9. List All Users
- **Route:** `/users` atau `/en/users` atau `/id/users`
- **File:** `src/app/[locale]/users/page.tsx`
- **Description:** Daftar semua user (Admin only)
- **Features:**
  - Tabel: No, Email, Full Name, Role, Created At, Action
  - Filter dropdown berdasarkan role (All/Admin/UMKM)
  - Search box berdasarkan email atau full_name
  - Pagination
  - Button View Detail
  - Total user count

### 10. User Detail
- **Route:** `/users/[id]` atau `/en/users/[id]` atau `/id/users/[id]`
- **File:** `src/app/[locale]/users/[id]/page.tsx`
- **Description:** Detail user tertentu
- **Features:**
  - Menampilkan: ID, Email, Full Name, Role, Created At
  - Badge untuk role
  - Button kembali ke list

---

## 📦 Product Routes (Auth Required - UMKM)

### 11. List All Products
- **Route:** `/products` atau `/en/products` atau `/id/products`
- **File:** `src/app/[locale]/products/page.tsx`
- **Description:** Daftar semua produk
- **Features:**
  - Card grid layout
  - Setiap card: name_local, category, SKU (jika ada)
  - Filter dropdown berdasarkan category
  - Search box berdasarkan name_local
  - Button View Details
  - Button + Create New Product
  - Empty state jika belum ada produk
  - Pagination
  - Admin dapat melihat semua produk

### 12. Product Detail
- **Route:** `/products/[id]` atau `/en/products/[id]` atau `/id/products/[id]`
- **File:** `src/app/[locale]/products/[id]/page.tsx`
- **Description:** Detail produk lengkap
- **Features:**
  - Section Info Dasar: name_local, category
  - Section Deskripsi: description_local
  - Section Fisik: dimensions, weight_net, weight_gross
  - Section Material: material_composition
  - Section Kualitas: quality_specs (rendered dari JSON)
  - Section Kemasan: packaging_type
  - Section AI Results: HS Code, SKU, Description EN (jika ada)
  - Button Edit Product
  - Button Delete Product
  - Button Run AI Enrichment / Re-run AI
  - Button Go to Export Analysis (placeholder)
  - Button Go to Costing (placeholder)

### 13. Create Product
- **Route:** `/products/create` atau `/en/products/create` atau `/id/products/create`
- **File:** `src/app/[locale]/products/create/page.tsx`
- **Description:** Form untuk membuat produk baru
- **Features:**
  - Multi-section form:
    - Info Dasar: name_local, category (dropdown)
    - Deskripsi: description_local (textarea, max 500 char)
    - Fisik: dimensions_l, dimensions_w, dimensions_h, weight_net, weight_gross
    - Material: material_composition (textarea)
    - Kualitas: quality_specs (dynamic key-value input, bisa add/remove row)
    - Kemasan: packaging_type (dropdown)
  - Client-side validation
  - Loading state saat submit
  - Redirect ke Product Detail setelah berhasil

### 14. Edit Product
- **Route:** `/products/[id]/edit` atau `/en/products/[id]/edit` atau `/id/products/[id]/edit`
- **File:** `src/app/[locale]/products/[id]/edit/page.tsx`
- **Description:** Form untuk update produk
- **Features:**
  - Form sama dengan Create, tapi pre-filled dengan data existing
  - Semua field dapat diubah
  - Success message setelah update
  - Button Cancel

### 15. Manual Override AI Enrichment
- **Route:** `/products/[id]/enrich/edit` atau `/en/products/[id]/enrich/edit` atau `/id/products/[id]/enrich/edit`
- **File:** `src/app/[locale]/products/[id]/enrich/edit/page.tsx`
- **Description:** Form untuk edit hasil AI secara manual
- **Features:**
  - Field: hs_code_recommendation (dengan validation 8 digits)
  - Field: sku_generated (text)
  - Field: description_english_b2b (textarea)
  - Button Save Override
  - Button Cancel
  - Badge "Manually Edited" setelah override

---

## 📋 Route Summary by Module

### Module 1: Identitas Bisnis
1. ✅ `/register` - Register Account
2. ✅ `/login` - Login
3. ✅ `/dashboard` - Dashboard Home
4. ✅ `/business-profile` - View Business Profile
5. ✅ `/business-profile/create` - Create Business Profile
6. ✅ `/business-profile/edit` - Update Business Profile
7. ✅ `/business-profile/certifications` - Manage Certifications
8. ✅ `/users` - Get All Users (Admin)
9. ✅ `/users/[id]` - User Detail (Admin)
10. ✅ Delete Account (Modal di Business Profile page)

### Module 2: Manajemen Produk & AI Enrichment
1. ✅ `/products` - Get All Products
2. ✅ `/products/[id]` - View Product Details
3. ✅ `/products/create` - Create New Product
4. ✅ `/products/[id]/edit` - Update Product
5. ✅ Delete Product (Modal di Product Detail page)
6. ✅ AI Enrichment Loading State (di Product Detail)
7. ✅ View AI Enrichment Results (di Product Detail)
8. ✅ `/products/[id]/enrich/edit` - Manual Override AI Results

---

## 🔒 Route Protection

### Public Routes (No Auth Required)
- `/register`
- `/login`
- `/` (home)

### Protected Routes (Auth Required)
- Semua route lainnya memerlukan authentication
- Jika tidak authenticated, akan redirect ke `/login`

### Admin Only Routes
- `/users` - List All Users
- `/users/[id]` - User Detail

### UMKM Only Actions
- Create/Edit/Delete Products
- Create/Edit Business Profile
- Manage Certifications
- Delete Account
- AI Enrichment

---

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Register new account → `/register`
- [ ] Login with credentials → `/login`
- [ ] Verify redirect to dashboard after login

### Business Profile Flow
- [ ] View Business Profile → `/business-profile`
- [ ] Create Business Profile → `/business-profile/create`
- [ ] Edit Business Profile → `/business-profile/edit`
- [ ] Manage Certifications → `/business-profile/certifications`
- [ ] Delete Account (from Business Profile page)

### Product Flow
- [ ] List Products → `/products`
- [ ] View Product Detail → `/products/[id]`
- [ ] Create Product → `/products/create`
- [ ] Edit Product → `/products/[id]/edit`
- [ ] Delete Product (from Product Detail page)
- [ ] Run AI Enrichment (from Product Detail page)
- [ ] View AI Results (from Product Detail page)
- [ ] Manual Override → `/products/[id]/enrich/edit`

### Admin Flow
- [ ] List All Users → `/users` (Admin only)
- [ ] View User Detail → `/users/[id]` (Admin only)

---

## 📝 Notes

1. **Locale Support:** Semua route mendukung internationalization dengan prefix `/en` atau `/id`
2. **Default Locale:** Jika tidak ada locale, akan menggunakan default (biasanya `en`)
3. **404 Handling:** Route yang tidak ada akan menampilkan 404 page
4. **Loading States:** Semua halaman memiliki loading state saat fetch data
5. **Error Handling:** Semua halaman memiliki error handling dan menampilkan error messages

---

**Total Routes Created:** 15+ routes
**Status:** ✅ All routes implemented and ready for testing

