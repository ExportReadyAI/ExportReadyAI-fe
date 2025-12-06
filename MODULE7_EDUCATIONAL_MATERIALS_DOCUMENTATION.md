# Module 7: Educational Materials - API Documentation

## Overview

Module 7 provides a simple CRUD system for managing educational content. The module consists of **Modules** (categories/topics) and **Articles** (educational content) that belong to modules.

**Key Features:**
- Simple two-level hierarchy: Modules → Articles
- No progress tracking, enrollments, or learning paths
- File upload support for articles (PDFs, images, etc.)
- Video URL support (external links like YouTube, Vimeo)
- All authenticated users can view content
- Only Admin can create/update/delete content

---

## Database Schema

### Modules Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | BigInt | Primary key |
| `title` | String(255) | Module title |
| `description` | Text | Module description |
| `order_index` | Integer | Display order (default: 0) |
| `created_at` | DateTime | Creation timestamp |
| `updated_at` | DateTime | Last update timestamp |

### Articles Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | BigInt | Primary key |
| `module_id` | BigInt (FK) | Foreign key to modules |
| `title` | String(255) | Article title |
| `content` | Text | Article content (Markdown supported) |
| `video_url` | String(500) | Optional video URL (YouTube, Vimeo, etc.) |
| `file_url` | String(500) | Optional file URL (PDF, image, etc.) |
| `order_index` | Integer | Display order within module (default: 0) |
| `created_at` | DateTime | Creation timestamp |
| `updated_at` | DateTime | Last update timestamp |

---

## API Endpoints

**Base URL:** `/api/v1/educational`

All endpoints require authentication (JWT token in Authorization header).

### Modules Endpoints

#### 1. List Modules
```
GET /api/v1/educational/modules/
```

**Authentication:** Required (any authenticated user)

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "message": "Modules retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Panduan Ekspor ke Jepang",
      "description": "Panduan lengkap untuk mengekspor produk ke pasar Jepang",
      "order_index": 1,
      "article_count": 5,
      "articles": [
        {
          "id": 1,
          "module": 1,
          "title": "Regulasi dan Sertifikasi",
          "content": "# Regulasi...",
          "video_url": null,
          "file_url": null,
          "order_index": 1,
          "created_at": "2025-12-06T21:00:00Z",
          "updated_at": "2025-12-06T21:00:00Z"
        }
      ],
      "created_at": "2025-12-06T21:00:00Z",
      "updated_at": "2025-12-06T21:00:00Z"
    }
  ],
  "pagination": {
    "count": 10,
    "page": 1,
    "limit": 10,
    "total_pages": 1,
    "next": null,
    "previous": null
  }
}
```

#### 2. Create Module
```
POST /api/v1/educational/modules/
```

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "title": "Panduan Ekspor ke Jepang",
  "description": "Panduan lengkap untuk mengekspor produk ke pasar Jepang",
  "order_index": 1
}
```

**Fields:**
- `title` (required): Module title
- `description` (optional): Module description
- `order_index` (optional): Display order (auto-assigned if not provided)

**Response:**
```json
{
  "success": true,
  "message": "Module created successfully",
  "data": {
    "id": 1,
    "title": "Panduan Ekspor ke Jepang",
    "description": "Panduan lengkap untuk mengekspor produk ke pasar Jepang",
    "order_index": 1,
    "article_count": 0,
    "articles": [],
    "created_at": "2025-12-06T21:00:00Z",
    "updated_at": "2025-12-06T21:00:00Z"
  }
}
```

#### 3. Get Module Detail
```
GET /api/v1/educational/modules/{module_id}/
```

**Authentication:** Required (any authenticated user)

**Response:** Same as List Modules (single object)

#### 4. Update Module
```
PUT /api/v1/educational/modules/{module_id}/
```

**Authentication:** Required (Admin only)

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "order_index": 2
}
```

**Response:** Same as Create Module

#### 5. Delete Module
```
DELETE /api/v1/educational/modules/{module_id}/
```

**Authentication:** Required (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "Module deleted successfully"
}
```

**Note:** Deleting a module will cascade delete all its articles.

---

### Articles Endpoints

#### 1. List Articles
```
GET /api/v1/educational/articles/
```

**Authentication:** Required (any authenticated user)

**Query Parameters:**
- `module_id` (optional): Filter articles by module ID
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "message": "Articles retrieved successfully",
  "data": [
    {
      "id": 1,
      "module": 1,
      "title": "Regulasi dan Sertifikasi Jepang",
      "content": "# Regulasi dan Sertifikasi Jepang\n\nJepang memiliki regulasi ketat...",
      "video_url": "https://www.youtube.com/watch?v=example",
      "file_url": "https://example.com/guide.pdf",
      "order_index": 1,
      "created_at": "2025-12-06T21:00:00Z",
      "updated_at": "2025-12-06T21:00:00Z"
    }
  ],
  "pagination": {
    "count": 10,
    "page": 1,
    "limit": 10,
    "total_pages": 1,
    "next": null,
    "previous": null
  }
}
```

#### 2. Create Article
```
POST /api/v1/educational/articles/
```

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "module_id": 1,
  "title": "Regulasi dan Sertifikasi Jepang",
  "content": "# Regulasi dan Sertifikasi Jepang\n\nJepang memiliki regulasi ketat untuk produk impor.",
  "video_url": "https://www.youtube.com/watch?v=example",
  "file_url": "https://example.com/guide.pdf",
  "order_index": 1
}
```

**Fields:**
- `module_id` (required): ID of the parent module
- `title` (required): Article title
- `content` (required): Article content (Markdown supported)
- `video_url` (optional): External video URL (YouTube, Vimeo, etc.)
- `file_url` (optional): External file URL or use upload endpoint
- `order_index` (optional): Display order (auto-assigned if not provided)

**Response:**
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "id": 1,
    "module": 1,
    "title": "Regulasi dan Sertifikasi Jepang",
    "content": "# Regulasi...",
    "video_url": "https://www.youtube.com/watch?v=example",
    "file_url": "https://example.com/guide.pdf",
    "order_index": 1,
    "created_at": "2025-12-06T21:00:00Z",
    "updated_at": "2025-12-06T21:00:00Z"
  }
}
```

#### 3. Get Article Detail
```
GET /api/v1/educational/articles/{article_id}/
```

**Authentication:** Required (any authenticated user)

**Response:** Same as List Articles (single object)

#### 4. Update Article
```
PUT /api/v1/educational/articles/{article_id}/
```

**Authentication:** Required (Admin only)

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "video_url": "https://www.youtube.com/watch?v=new",
  "file_url": "https://example.com/new-file.pdf",
  "order_index": 2
}
```

**Response:** Same as Create Article

#### 5. Upload File for Article
```
POST /api/v1/educational/articles/{article_id}/upload-file/
```

**Authentication:** Required (Admin only)

**Content-Type:** `multipart/form-data`

**Request Body:**
- `file` (required): File to upload (PDF, image, etc.)

**File Requirements:**
- Max size: 10MB
- Supported types: PDF, JPG, PNG, GIF, WEBP, and other document types

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 1,
    "module": 1,
    "title": "Regulasi dan Sertifikasi Jepang",
    "content": "# Regulasi...",
    "video_url": null,
    "file_url": "http://127.0.0.1:8000/media/articles/1/uuid-filename.pdf",
    "order_index": 1,
    "created_at": "2025-12-06T21:00:00Z",
    "updated_at": "2025-12-06T21:00:00Z"
  }
}
```

**Note:** The uploaded file URL will be stored in `file_url` field. Files are stored using Django's default storage (can be configured to use Supabase Storage).

#### 6. Delete Article
```
DELETE /api/v1/educational/articles/{article_id}/
```

**Authentication:** Required (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

---

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer {access_token}
```

**Role Requirements:**
- **View (GET)**: Any authenticated user (Admin, UMKM, Buyer, Forwarder)
- **Create/Update/Delete (POST/PUT/DELETE)**: Admin only

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": ["This field is required."],
    "module_id": ["Module does not exist"]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication credentials were not provided or are invalid"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Only administrators can perform this action."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Module not found"
}
```

---

## File Upload Guide

### Method 1: Using External URLs
When creating or updating an article, provide `video_url` or `file_url` as strings:

```json
{
  "module_id": 1,
  "title": "Article Title",
  "content": "Article content",
  "video_url": "https://www.youtube.com/watch?v=example",
  "file_url": "https://example.com/document.pdf"
}
```

### Method 2: Upload File Directly
1. First, create the article without `file_url`
2. Then use the upload endpoint: `POST /articles/{article_id}/upload-file/`
3. Send `multipart/form-data` with `file` field
4. The `file_url` will be automatically updated

**Example using fetch:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch(`/api/v1/educational/articles/${articleId}/upload-file/`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});
```

---

## Content Format

### Article Content
- Supports Markdown formatting
- Can include headings, lists, links, images, etc.
- Example:
```markdown
# Article Title

## Section 1
Content here...

## Section 2
- Bullet point 1
- Bullet point 2

[Link text](https://example.com)
```

### Video URLs
- External video links (YouTube, Vimeo, etc.)
- Stored as-is in `video_url` field
- Frontend should handle video embedding

### File URLs
- Can be external URLs or uploaded file URLs
- Stored in `file_url` field
- Frontend should handle file display/download

---

## Ordering

Both Modules and Articles support ordering via `order_index`:
- Lower numbers appear first
- If `order_index` is not provided, it's auto-assigned (max + 1)
- Can be updated via PUT request

**Display Logic:**
- Sort by `order_index` ASC, then by `created_at` DESC

---

## Pagination

List endpoints support pagination:
- Default page size: 10
- Max page size: 100
- Query params: `page` and `limit`

**Pagination Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...],
  "pagination": {
    "count": 50,
    "page": 1,
    "limit": 10,
    "total_pages": 5,
    "next": "http://api.example.com/endpoint/?page=2",
    "previous": null
  }
}
```

---

## Frontend Implementation Notes

### Recommended UI Structure

1. **Modules List Page**
   - Display all modules in a grid or list
   - Show module title, description, and article count
   - Click to view module detail with articles

2. **Module Detail Page**
   - Show module information
   - List all articles in the module
   - Display articles in order (by `order_index`)

3. **Article Detail Page**
   - Display article title and content (render Markdown)
   - Show video if `video_url` exists (embed player)
   - Show file download link if `file_url` exists
   - Display creation/update timestamps

### Admin Features

1. **Module Management**
   - Create/Edit/Delete modules
   - Reorder modules (update `order_index`)

2. **Article Management**
   - Create/Edit/Delete articles
   - Upload files for articles
   - Reorder articles within module
   - Markdown editor for content

### Data Flow Example

```
1. User visits Modules page
   → GET /api/v1/educational/modules/
   → Display list of modules

2. User clicks on a module
   → GET /api/v1/educational/modules/{id}/
   → Display module with nested articles

3. User clicks on an article
   → GET /api/v1/educational/articles/{id}/
   → Display article content

4. Admin creates new article
   → POST /api/v1/educational/articles/
   → { module_id, title, content, ... }
   → If file needed: POST /articles/{id}/upload-file/
```

---

## Important Notes

1. **No Progress Tracking**: This module does NOT track user progress, enrollments, or completion status. It's purely content management.

2. **Simple Structure**: Only two levels - Modules contain Articles. No learning paths, prerequisites, or dependencies.

3. **File Storage**: 
   - Files are stored using Django's default storage
   - Can be configured to use Supabase Storage (see backend configuration)
   - File URLs are returned in `file_url` field

4. **Content Types**: 
   - Articles support text content (Markdown)
   - Optional video URLs (external)
   - Optional file URLs (external or uploaded)

5. **Ordering**: 
   - Both modules and articles can be reordered by updating `order_index`
   - Lower numbers appear first

6. **Cascade Delete**: 
   - Deleting a module will delete all its articles
   - Be careful when deleting modules with articles

---

## Testing

Use the provided Postman collection: `ExportReady_Modul7_EducationalMaterials_Postman.json`

**Test Flow:**
1. Register/Login as Admin
2. Create a module
3. Create articles in the module
4. Upload files to articles
5. View modules/articles as regular user
6. Test update/delete operations

---

## Summary

Module 7 is a simple, straightforward content management system for educational materials. It provides:
- ✅ Module CRUD (Admin only for create/update/delete)
- ✅ Article CRUD (Admin only for create/update/delete)
- ✅ File upload support
- ✅ Video URL support
- ✅ Markdown content support
- ✅ Ordering support
- ✅ Pagination support
- ❌ No progress tracking
- ❌ No enrollments
- ❌ No learning paths
- ❌ No prerequisites

Keep it simple and focused on content management only.

