
---

# API Documentation - Dashboard Module

Base URL: `/api/v1/business-profile/`

## Authentication
Semua endpoint memerlukan JWT token:
```
Authorization: Bearer <access_token>
```

---

## Dashboard Summary

### Get Dashboard Summary
```
GET /api/v1/business-profile/dashboard/summary/
```

Return summary statistics untuk dashboard, berbeda berdasarkan role user.

---

## Response untuk UMKM

```json
{
  "success": true,
  "message": "Dashboard summary retrieved successfully",
  "data": {
    "has_business_profile": true,
    "business_profile": {
      "id": 15,
      "company_name": "PT Demo Kerajinan Indonesia",
      "certification_count": 1
    },
    "products": {
      "total": 3,
      "with_enrichment": 1,
      "with_market_intelligence": 2,
      "with_pricing": 1
    },
    "catalogs": {
      "total": 2,
      "published": 0,
      "draft": 2
    },
    "buyer_requests": {
      "total": 3,
      "pending": 3
    }
  }
}
```

### Field Descriptions (UMKM)

| Field | Type | Description |
|-------|------|-------------|
| has_business_profile | boolean | Apakah user sudah punya business profile |
| business_profile.id | int | ID business profile |
| business_profile.company_name | string | Nama perusahaan |
| business_profile.certification_count | int | Jumlah sertifikasi (Halal, ISO, HACCP, SVLK) |
| products.total | int | Total produk yang dimiliki |
| products.with_enrichment | int | Produk yang sudah di-enrich dengan AI |
| products.with_market_intelligence | int | Produk yang sudah punya market intelligence |
| products.with_pricing | int | Produk yang sudah punya pricing analysis |
| catalogs.total | int | Total catalog |
| catalogs.published | int | Catalog yang sudah publish |
| catalogs.draft | int | Catalog yang masih draft |
| buyer_requests.total | int | Total buyer requests yang bisa dilihat |
| buyer_requests.pending | int | Buyer requests yang masih open/pending |

### Jika UMKM Belum Punya Business Profile

```json
{
  "success": true,
  "message": "Dashboard summary retrieved successfully",
  "data": {
    "has_business_profile": false,
    "business_profile": null,
    "products": {
      "total": 0,
      "with_enrichment": 0,
      "with_market_intelligence": 0,
      "with_pricing": 0
    },
    "catalogs": {
      "total": 0,
      "published": 0,
      "draft": 0
    },
    "buyer_requests": {
      "total": 0,
      "pending": 0
    }
  }
}
```

---

## Response untuk Admin

```json
{
  "success": true,
  "message": "Dashboard summary retrieved successfully",
  "data": {
    "users": {
      "total": 25,
      "umkm": 15,
      "buyers": 5,
      "forwarders": 3
    },
    "business_profiles": {
      "total": 12
    },
    "products": {
      "total": 50,
      "with_enrichment": 20,
      "with_market_intelligence": 15,
      "with_pricing": 10
    },
    "catalogs": {
      "total": 30,
      "published": 18,
      "draft": 12
    },
    "buyer_requests": {
      "total": 8
    }
  }
}
```

### Field Descriptions (Admin)

| Field | Type | Description |
|-------|------|-------------|
| users.total | int | Total semua user di sistem |
| users.umkm | int | Total user dengan role UMKM |
| users.buyers | int | Total user dengan role Buyer |
| users.forwarders | int | Total user dengan role Forwarder |
| business_profiles.total | int | Total business profile yang terdaftar |
| products.total | int | Total semua produk di sistem |
| products.with_enrichment | int | Produk yang sudah di-enrich AI |
| products.with_market_intelligence | int | Produk dengan market intelligence |
| products.with_pricing | int | Produk dengan pricing analysis |
| catalogs.total | int | Total semua catalog |
| catalogs.published | int | Catalog yang published |
| catalogs.draft | int | Catalog yang masih draft |
| buyer_requests.total | int | Total buyer requests di sistem |

---

## Frontend Implementation Guide

### 1. Check Business Profile Status (UMKM)

```javascript
// Fetch dashboard data
const response = await fetch('/api/v1/business-profile/dashboard/summary/', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();

// Check if user has business profile
if (!data.data.has_business_profile) {
  // Show "Create Business Profile" prompt
  showCreateProfilePrompt();
} else {
  // Show dashboard with stats
  renderDashboard(data.data);
}
```

### 2. Display Dashboard Cards (UMKM)

```jsx
// React example
function UMKMDashboard({ data }) {
  return (
    <div className="dashboard-grid">
      {/* Business Profile Card */}
      <Card>
        <h3>{data.business_profile.company_name}</h3>
        <p>Sertifikasi: {data.business_profile.certification_count}</p>
      </Card>

      {/* Products Card */}
      <Card>
        <h3>Produk</h3>
        <Stat label="Total" value={data.products.total} />
        <Stat label="AI Enriched" value={data.products.with_enrichment} />
        <Stat label="Market Intel" value={data.products.with_market_intelligence} />
        <Stat label="Pricing" value={data.products.with_pricing} />
      </Card>

      {/* Catalogs Card */}
      <Card>
        <h3>Katalog</h3>
        <Stat label="Total" value={data.catalogs.total} />
        <Stat label="Published" value={data.catalogs.published} />
        <Stat label="Draft" value={data.catalogs.draft} />
      </Card>

      {/* Buyer Requests Card */}
      <Card>
        <h3>Buyer Requests</h3>
        <Stat label="Open" value={data.buyer_requests.pending} />
      </Card>
    </div>
  );
}
```

### 3. Display Admin Dashboard

```jsx
// React example
function AdminDashboard({ data }) {
  return (
    <div className="dashboard-grid">
      {/* Users Card */}
      <Card>
        <h3>Users</h3>
        <Stat label="Total" value={data.users.total} />
        <Stat label="UMKM" value={data.users.umkm} />
        <Stat label="Buyers" value={data.users.buyers} />
        <Stat label="Forwarders" value={data.users.forwarders} />
      </Card>

      {/* Business Profiles Card */}
      <Card>
        <h3>Business Profiles</h3>
        <Stat label="Total" value={data.business_profiles.total} />
      </Card>

      {/* Products Card */}
      <Card>
        <h3>Products</h3>
        <Stat label="Total" value={data.products.total} />
        <Stat label="AI Enriched" value={data.products.with_enrichment} />
      </Card>

      {/* Catalogs Card */}
      <Card>
        <h3>Catalogs</h3>
        <Stat label="Total" value={data.catalogs.total} />
        <Stat label="Published" value={data.catalogs.published} />
      </Card>
    </div>
  );
}
```

### 4. Role-Based Rendering

```javascript
// Determine which dashboard to show based on user role
function Dashboard({ user, dashboardData }) {
  if (user.role === 'UMKM') {
    return <UMKMDashboard data={dashboardData} />;
  } else if (user.role === 'ADMIN') {
    return <AdminDashboard data={dashboardData} />;
  }
  return <p>Dashboard tidak tersedia untuk role ini</p>;
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "detail": "Given token not valid for any token type"
  }
}
```

### 403 Forbidden
Jika user bukan UMKM atau Admin:
```json
{
  "success": false,
  "message": "Forbidden",
  "errors": {
    "detail": "You do not have permission to perform this action."
  }
}
```

---

## Notes

1. **UMKM buyer_requests**: Menampilkan semua buyer requests yang masih Open (status="Open"), karena UMKM bisa melihat dan memilih request mana yang ingin mereka respons.

2. **AI Features Count**:
   - `with_enrichment`: Produk yang sudah di-generate deskripsi export dengan AI
   - `with_market_intelligence`: Produk yang sudah ada analisis market intelligence
   - `with_pricing`: Produk yang sudah ada analisis pricing

3. **Caching**: Frontend disarankan untuk cache response ini selama 1-5 menit untuk mengurangi load.

4. **Refresh**: Panggil endpoint ini setiap kali user masuk ke dashboard atau setelah melakukan aksi yang mengubah data (create product, publish catalog, dll).
