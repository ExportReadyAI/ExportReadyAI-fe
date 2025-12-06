# 📋 Product Backlog BACKEND - ExportReady.AI
## MODUL 6: AI MARKET CONNECT & TRUST LOGISTICS

> **New Roles Added:**
> - **Buyer** = Pembeli/importir yang mencari supplier
> - **Forwarder** = Penyedia jasa logistik/freight forwarding

> **Integration Notes:**
> - Modul ini terintegrasi dengan Modul 4 (Costing) untuk forwarder selection
> - AI Smart Matching menggunakan data dari Modul 2 (Product) dan Modul 3 (Export Analysis)

---

## 🟥 MODUL 6: AI MARKET CONNECT & TRUST LOGISTICS

### Sub-Module 6A: Buyer Demand Board (Smart RFQ)
### Sub-Module 6B: Forwarder Directory & Reputation System

---

## 🔵 MODUL 6A: BUYER DEMAND BOARD (Smart RFQ System)

| Kode Backlog | PIC | Backlog Title | Role | Acceptance Criteria |
|--------------|-----|---------------|------|---------------------|
| PBI-BE-M6-01 | | Database: Update User Role Enum | System | ✅ Alter User table role enum to add 'Buyer' and 'Forwarder' |
| | | | | ✅ Existing values ('UMKM', 'Admin') remain valid |
| | | | | ✅ Migration script without data loss |
| | | | | ✅ Update role validation in auth middleware |
| | | | | ✅ Update RoleGuard to accept new roles |
| PBI-BE-M6-02 | | Database: BuyerRequest Table | System | ✅ Create buyer_requests table with complete schema |
| | | | | ✅ Foreign key to users table (buyer_user_id) |
| | | | | ✅ JSONB column for keyword_tags (array support) |
| | | | | ✅ Enum constraint for status: 'Open', 'Matched', 'Closed' |
| | | | | ✅ Indexes on: buyer_user_id, status, product_category, destination_country |
| | | | | ✅ GIN index on keyword_tags for JSON queries |
| | | | | ✅ Timestamps: created_at, updated_at |
| PBI-BE-M6-03 | | API: POST /buyer-requests | Buyer | ✅ Endpoint accepts body: product_category, hs_code_target, spec_requirements, target_volume, destination_country, keyword_tags, min_rank_required |
| | | | | ✅ Required fields: product_category, spec_requirements, target_volume, destination_country |
| | | | | ✅ Auto-assign buyer_user_id from JWT token |
| | | | | ✅ Validate user role = 'Buyer' |
| | | | | ✅ Default status = 'Open' |
| | | | | ✅ keyword_tags stored as JSON array |
| | | | | ✅ Auto-trigger AI Smart Matching after create |
| | | | | ✅ Response success: 201 Created with request data |
| | | | | ✅ Response error: 400 Bad Request for validation errors |
| | | | | ✅ Response error: 403 Forbidden if not Buyer role |
| PBI-BE-M6-04 | | API: GET /buyer-requests | All Roles | ✅ Buyer: return only own requests |
| | | | | ✅ UMKM: return 'Open' requests matching capabilities with auto-filter by min_rank_required |
| | | | | ✅ Admin: return all requests |
| | | | | ✅ Query params: page, limit, status, category, destination_country |
| | | | | ✅ Include buyer company name in response |
| | | | | ✅ For UMKM: include match_score calculated on-the-fly |
| | | | | ✅ Response: array with pagination metadata |
| PBI-BE-M6-05 | | API: GET /buyer-requests/:id | All Roles | ✅ Return complete request details |
| | | | | ✅ Buyer: unlimited access to own requests |
| | | | | ✅ UMKM: access only if meets min_rank_required |
| | | | | ✅ Admin: full access to all |
| | | | | ✅ Include buyer contact info if UMKM eligible |
| | | | | ✅ Include nested buyer profile data |
| | | | | ✅ Response success: 200 OK with request object |
| | | | | ✅ Response error: 403 Forbidden if UMKM doesn't qualify |
| | | | | ✅ Response error: 404 Not Found |
| PBI-BE-M6-06 | | API: PUT /buyer-requests/:id | Buyer | ✅ Update request by id |
| | | | | ✅ Validate: request belongs to logged-in buyer |
| | | | | ✅ Update only fields provided in body |
| | | | | ✅ Re-trigger AI Smart Matching if criteria changed |
| | | | | ✅ Response success: 200 OK with updated data |
| | | | | ✅ Response error: 403 Forbidden if not owner |
| | | | | ✅ Response error: 404 Not Found |
| PBI-BE-M6-07 | | API: PATCH /buyer-requests/:id/status | Buyer | ✅ Update request status only |
| | | | | ✅ Body: status (Enum: 'Open', 'Matched', 'Closed') |
| | | | | ✅ Validate: request belongs to logged-in buyer |
| | | | | ✅ Response success: 200 OK |
| | | | | ✅ Response error: 400 Bad Request for invalid status |
| | | | | ✅ Response error: 403 Forbidden if not owner |
| PBI-BE-M6-08 | | API: DELETE /buyer-requests/:id | Buyer | ✅ Delete request by id |
| | | | | ✅ Validate: request belongs to logged-in buyer |
| | | | | ✅ Soft delete or hard delete based on business rule |
| | | | | ✅ Response success: 200 OK |
| | | | | ✅ Response error: 403 Forbidden if not owner |
| PBI-BE-M6-09 | | Service: AI Smart Matching - Category & HS Code | System | ✅ Input: BuyerRequest (category, hs_code_target) |
| | | | | ✅ Query: Products WHERE category LIKE buyer.category |
| | | | | ✅ Query: ProductEnrichment WHERE hs_code starts with buyer.hs_code_target |
| | | | | ✅ Score calculation: exact HS match = 100, same category = 50, partial = 25 |
| | | | | ✅ Output: Array of matched UMKM with base_score |
| PBI-BE-M6-10 | | Service: AI Smart Matching - Spec Requirements | System | ✅ Input: spec_requirements (text), keyword_tags (array) |
| | | | | ✅ LLM Prompt: "Ekstrak kata kunci penting dari spesifikasi: {spec_requirements}" |
| | | | | ✅ Compare with Product.description_local and quality_specs |
| | | | | ✅ Text similarity scoring: keyword overlap, semantic matching |
| | | | | ✅ Bonus score for matching keyword_tags |
| | | | | ✅ Output: spec_match_score (0-100) per UMKM |
| PBI-BE-M6-11 | | Service: AI Smart Matching - Capability Filter | System | ✅ Input: min_rank_required, destination_country |
| | | | | ✅ Filter: UMKM with rank >= min_rank_required |
| | | | | ✅ Check: UMKM has ExportAnalysis for destination_country |
| | | | | ✅ Check: UMKM has matching certifications from BusinessProfile |
| | | | | ✅ Bonus score: +20 if exported to that country before |
| | | | | ✅ Bonus score: +10 per relevant certification |
| | | | | ✅ Output: capability_score (0-100) per UMKM |
| PBI-BE-M6-12 | | Service: Calculate Final Match Score | System | ✅ Input: base_score, spec_match_score, capability_score |
| | | | | ✅ Formula: final_score = (base_score × 0.4) + (spec_match × 0.3) + (capability × 0.3) |
| | | | | ✅ Round to integer (0-100) |
| | | | | ✅ Threshold: only return UMKM with score >= 70 |
| | | | | ✅ Output: final_match_score per UMKM |
| PBI-BE-M6-13 | | API: GET /buyer-requests/:id/matched-umkm | Buyer | ✅ Return list of matched UMKM for this request |
| | | | | ✅ Validate: request belongs to logged-in buyer |
| | | | | ✅ Include: match_score, company profile, contact info |
| | | | | ✅ Sort by: match_score DESC |
| | | | | ✅ Response: array of matched UMKM |
| | | | | ✅ Response error: 403 Forbidden if not owner |

---

## 🔴 MODUL 6B: FORWARDER DIRECTORY & REPUTATION SYSTEM

| Kode Backlog | PIC | Backlog Title | Role | Acceptance Criteria |
|--------------|-----|---------------|------|---------------------|
| PBI-BE-M6-14 | | Database: ForwarderProfile Table | System | ✅ Create forwarder_profiles table with complete schema |
| | | | | ✅ Foreign key to users table (user_id) with constraint role = 'Forwarder' |
| | | | | ✅ JSONB columns: specialization_routes, service_types |
| | | | | ✅ Decimal column: average_rating (1.0-5.0, default 0) |
| | | | | ✅ Integer column: total_reviews (default 0) |
| | | | | ✅ Unique constraint on user_id (1-to-1 relationship) |
| | | | | ✅ Indexes on: average_rating, specialization_routes (GIN) |
| | | | | ✅ Timestamps: created_at, updated_at |
| PBI-BE-M6-15 | | Database: ForwarderReview Table | System | ✅ Create forwarder_reviews table with complete schema |
| | | | | ✅ Foreign key to forwarder_profiles (forwarder_id) |
| | | | | ✅ Foreign key to users (umkm_id) |
| | | | | ✅ Rating validation: CHECK (rating BETWEEN 1 AND 5) |
| | | | | ✅ Unique constraint on (forwarder_id, umkm_id) to prevent duplicates |
| | | | | ✅ Indexes on: forwarder_id, umkm_id, rating |
| | | | | ✅ Timestamps: created_at, updated_at |
| PBI-BE-M6-16 | | API: POST /forwarder-profile | Forwarder | ✅ Endpoint accepts body: company_name, contact_info, specialization_routes, service_types |
| | | | | ✅ Required fields: company_name, contact_info, specialization_routes, service_types |
| | | | | ✅ Auto-assign user_id from JWT token |
| | | | | ✅ Validate user role = 'Forwarder' |
| | | | | ✅ Validate: user doesn't have ForwarderProfile yet (1-to-1) |
| | | | | ✅ specialization_routes format: ["ID-JP", "ID-US"] (ISO codes) |
| | | | | ✅ service_types format: ["Sea Freight", "Air Freight", "Cold Chain"] |
| | | | | ✅ Default average_rating = 0, total_reviews = 0 |
| | | | | ✅ Response success: 201 Created with profile data |
| | | | | ✅ Response error: 409 Conflict if profile already exists |
| PBI-BE-M6-17 | | API: GET /forwarders | Admin, UMKM | ✅ Return list of forwarder profiles with filters and sorting |
| | | | | ✅ Query params: page, limit, destination_country, service_type, min_rating |
| | | | | ✅ Filter by specialization_routes: check if destination in routes array |
| | | | | ✅ Filter by service_types: check if service in types array |
| | | | | ✅ Sort options: rating DESC, total_reviews DESC, company_name ASC |
| | | | | ✅ Include: average_rating, total_reviews, service summary |
| | | | | ✅ Response: array with pagination and filter metadata |
| PBI-BE-M6-18 | | API: GET /forwarders/:id | All Roles | ✅ Return complete forwarder profile details |
| | | | | ✅ Include: company_name, contact_info, routes, services, ratings |
| | | | | ✅ Include: recent reviews (latest 5) with UMKM names |
| | | | | ✅ Include: rating breakdown (5 stars: x%, 4 stars: y%, etc) |
| | | | | ✅ Response: forwarder object with nested reviews |
| | | | | ✅ Response error: 404 Not Found |
| PBI-BE-M6-19 | | API: PUT /forwarder-profile/:id | Forwarder | ✅ Update forwarder profile |
| | | | | ✅ Validate: profile belongs to logged-in forwarder |
| | | | | ✅ Update only fields sent in body (exclude rating fields) |
| | | | | ✅ average_rating and total_reviews cannot be manually changed |
| | | | | ✅ Response success: 200 OK with updated data |
| | | | | ✅ Response error: 403 Forbidden if not owner |
| PBI-BE-M6-20 | | API: POST /forwarders/:id/reviews | UMKM | ✅ Endpoint accepts body: rating (1-5), review_text |
| | | | | ✅ Validate user role = 'UMKM' |
| | | | | ✅ Validate: UMKM hasn't reviewed this forwarder before (unique constraint) |
| | | | | ✅ Create ForwarderReview record |
| | | | | ✅ Auto-trigger rating recalculation |
| | | | | ✅ Response success: 201 Created |
| | | | | ✅ Response error: 409 Conflict if already reviewed |
| | | | | ✅ Response error: 403 Forbidden if not UMKM role |
| PBI-BE-M6-21 | | API: PUT /forwarders/:forwarder_id/reviews/:review_id | UMKM | ✅ Update existing review |
| | | | | ✅ Validate: review belongs to logged-in UMKM |
| | | | | ✅ Update: rating and/or review_text |
| | | | | ✅ Auto-trigger rating recalculation |
| | | | | ✅ Response success: 200 OK |
| | | | | ✅ Response error: 403 Forbidden if not owner |
| PBI-BE-M6-22 | | API: DELETE /forwarders/:forwarder_id/reviews/:review_id | UMKM | ✅ Delete review |
| | | | | ✅ Validate: review belongs to logged-in UMKM |
| | | | | ✅ Auto-trigger rating recalculation |
| | | | | ✅ Response success: 200 OK |
| | | | | ✅ Response error: 403 Forbidden if not owner |
| PBI-BE-M6-23 | | Service: Calculate Forwarder Average Rating | System | ✅ Triggered after: create, update, delete review |
| | | | | ✅ Query: SELECT AVG(rating), COUNT(*) FROM ForwarderReview WHERE forwarder_id = X |
| | | | | ✅ Update ForwarderProfile: average_rating, total_reviews |
| | | | | ✅ Round average_rating to 1 decimal place |
| | | | | ✅ Handle edge case: 0 reviews → average_rating = 0 |
| PBI-BE-M6-24 | | Service: Forwarder Recommendation Engine | System | ✅ Input: destination_country (from ExportAnalysis or Costing) |
| | | | | ✅ Query: ForwarderProfile WHERE destination IN specialization_routes |
| | | | | ✅ Sort by: average_rating DESC, total_reviews DESC |
| | | | | ✅ Return top 5 forwarders |
| | | | | ✅ Output: Array of {id, company_name, rating, contact_info} |
| PBI-BE-M6-25 | | API: GET /forwarders/recommendations | UMKM | ✅ Query param: destination_country (required) |
| | | | | ✅ Call Forwarder Recommendation Engine |
| | | | | ✅ Include: service types, rating, review count |
| | | | | ✅ Response: array of top recommended forwarders |
| | | | | ✅ Response error: 400 Bad Request if destination invalid |
| PBI-BE-M6-26 | | API: GET /forwarders/:id/statistics | Forwarder, Admin | ✅ Return statistics for forwarder profile |
| | | | | ✅ Validate: forwarder accesses own, admin accesses all |
| | | | | ✅ Include: total_reviews, average_rating, rating_distribution |
| | | | | ✅ Include: total_umkm_partnerships (unique umkm who reviewed) |
| | | | | ✅ Include: recent_review_trend (last 30 days) |
| | | | | ✅ Response: statistics object |
| | | | | ✅ Response error: 403 Forbidden if unauthorized |
| PBI-BE-M6-27 | | Database: Costing Table Update | System | ✅ Add column: selected_forwarder_id (UUID, FK, nullable) |
| | | | | ✅ Foreign key to forwarder_profiles table |
| | | | | ✅ Migration: add column without dropping existing data |
| | | | | ✅ Create index on selected_forwarder_id |
| PBI-BE-M6-28 | | API Integration: Update POST /costings | UMKM | ✅ Modify PBI-BE-M4-03 (POST /costings) |
| | | | | ✅ Add optional body field: selected_forwarder_id |
| | | | | ✅ If forwarder selected: fetch ForwarderProfile data |
| | | | | ✅ Store forwarder_id in Costing table |
| | | | | ✅ Include forwarder contact in PDF output (M4-13) |
| | | | | ✅ Optional: use forwarder's rate if available |
| | | | | ✅ Response includes forwarder details if selected |
| PBI-BE-M6-29 | | API Integration: Update GET /costings/:id | UMKM | ✅ Modify PBI-BE-M4-02 (GET /costings/:id) |
| | | | | ✅ Include forwarder profile data if selected_forwarder_id exists |
| | | | | ✅ Include: company_name, contact_info, rating |
| | | | | ✅ Response: costing object with nested forwarder data |
| PBI-BE-M6-30 | | API Integration: Update PDF Generation | UMKM | ✅ Modify PBI-BE-M4-13 (GET /costings/:id/pdf) |
| | | | | ✅ Include forwarder section if selected_forwarder_id exists |
| | | | | ✅ Display: company name, contact info, specialization |
| | | | | ✅ Professional layout for B2B documentation |

---

## 📊 SUMMARY MODUL 6

| Sub-Modul | Jumlah Backlog | Komponen Utama |
|-----------|----------------|----------------|
| 🔵 M6A: Buyer Demand Board | 13 items | RFQ CRUD, AI Smart Matching (3 services) |
| 🔴 M6B: Forwarder Directory | 17 items | Forwarder Profile, Review System, Rating Engine, Integration |
| **TOTAL M6** | **30 items** | |

---

## 📊 UPDATED OVERALL SUMMARY

| Modul | Jumlah Backlog | Komponen Utama |
|-------|----------------|----------------|
| 🟩 M1: Identitas Bisnis | 12 items | Auth API, Profile API, Middleware |
| 🟨 M2: Manajemen Produk | 12 items | Product CRUD, AI Services (HS, SKU, Desc) |
| 🟦 M3: Kelayakan Ekspor | 14 items | Analysis API, AI Compliance Checker |
| 🟧 M4: Kalkulator Finansial | 14 items | Costing API, Price Calculator, Container Optimizer |
| 🟪 M5: Master Data | 14 items | HS Code CRUD, Country CRUD, Regulation CRUD |
| 🟥 M6: Market Connect & Logistics | 30 items | Smart RFQ, Forwarder Selection, Trust System |
| **TOTAL** | **96 items** | |

---

## 🔗 SYNC MAPPING FE ↔ BE (Updated with Modul 6)

| Frontend | Backend | Description |
|----------|---------|-------------|
| PBI-FE-M1-01 (Register Page) | PBI-BE-M1-01 (POST /auth/register) | User registration |
| PBI-FE-M1-02 (Login Page) | PBI-BE-M1-02 (POST /auth/login) | User login |
| PBI-FE-M2-03 (Create Product) | PBI-BE-M2-03 (POST /products) | Create product |
| PBI-FE-M2-06 (AI Loading State) | PBI-BE-M2-06,07,08 (AI Services) | AI processing |
| PBI-FE-M3-02 (Create Analysis) | PBI-BE-M3-03 + M3-04,05,06,07,08 | Full analysis flow |
| PBI-FE-M4-02 (Create Costing) | PBI-BE-M4-03 + M4-06,07,08,09 | Full costing flow |
| PBI-FE-M6-01 (Buyer RFQ Form) | PBI-BE-M6-03 + M6-09,10,11,12 | Smart RFQ creation |
| PBI-FE-M6-02 (UMKM Opportunity Board) | PBI-BE-M6-04 | View matched requests |
| PBI-FE-M6-03 (Forwarder Selection) | PBI-BE-M6-17 + M6-25 | Forwarder recommendations |
| PBI-FE-M6-04 (Review Forwarder) | PBI-BE-M6-20 + M6-23 | Submit and calculate rating |

---

## 🎯 KEY TECHNICAL HIGHLIGHTS MODUL 6

### AI Smart Matching Algorithm
```
Final Match Score = 
  (HS Code/Category Match × 40%) +
  (Spec Requirements Match × 30%) +
  (Capability/Certification × 30%)

Matching Threshold: Score >= 70
```

### Forwarder Rating System
```
Average Rating = SUM(all ratings) / COUNT(reviews)
Rating Distribution = COUNT per star level (1-5)
Recalculated on every review CREATE/UPDATE/DELETE
```

### Database Schema Additions
```sql
-- User role enum update
ALTER TYPE user_role ADD VALUE 'Buyer';
ALTER TYPE user_role ADD VALUE 'Forwarder';

-- New tables
CREATE TABLE buyer_requests (...);
CREATE TABLE forwarder_profiles (...);
CREATE TABLE forwarder_reviews (...);

-- Costing table update
ALTER TABLE costings ADD COLUMN selected_forwarder_id UUID;
```

---

## 🔄 INTEGRATION POINTS

### With Modul 2 (Product Management)
- AI Smart Matching uses product data (category, HS code, description, specs)
- ProductEnrichment.hs_code used for matching accuracy

### With Modul 3 (Export Analysis)
- Capability filtering checks ExportAnalysis for destination_country experience
- Certification matching from BusinessProfile

### With Modul 4 (Costing)
- Forwarder selection integrated into costing creation
- Selected forwarder data included in PDF output
- Optional: forwarder-specific freight rates

---

*Document Generated: December 2024*
*Version: 2.0*
*Project: ExportReady.AI - Backend Backlog - Modul 6*