# 🔍 Debugging Authentication Issues

## Problem
Setelah login berhasil, saat mengakses halaman lain mendapat 401 Unauthorized dan redirect ke login.

## Possible Causes

### 1. Token Not Saved to localStorage
**Check:** Buka browser console dan ketik:
```javascript
localStorage.getItem('token')
```
Jika `null`, token tidak tersimpan.

### 2. Token Format Issue
**Check:** Lihat di Network tab, request yang gagal:
- Header `Authorization` harus: `Bearer <token>`
- Token harus valid JWT format (3 parts separated by dots)

### 3. API Response Structure Mismatch
Backend mungkin mengembalikan struktur berbeda:
- **Structure 1:** `{ success: true, data: { access, refresh, user } }`
- **Structure 2:** `{ success: true, data: { tokens: { access, refresh }, user } }`

Code sudah diupdate untuk handle kedua struktur.

### 4. CORS Issue
**Check:** Di Network tab, lihat jika ada CORS error. Pastikan backend mengizinkan origin frontend.

### 5. API Base URL Wrong
**Check:** Pastikan `NEXT_PUBLIC_API_BASE_URL` di `.env.local` benar:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## Debug Steps

1. **Check Login Response:**
   - Buka browser console
   - Login
   - Lihat log: "Login response:" - cek struktur response

2. **Check Token Save:**
   - Setelah login, lihat log: "Token saved to localStorage:"
   - Verify dengan: `localStorage.getItem('token')` di console

3. **Check API Request:**
   - Buka Network tab
   - Coba akses halaman yang butuh auth
   - Lihat request headers - harus ada `Authorization: Bearer <token>`
   - Lihat response - jika 401, cek error message

4. **Check API Client:**
   - Lihat console log: "API Request with token:" atau "API Request without token:"
   - Jika "without token", berarti token tidak diambil dari localStorage

## Quick Fixes

### Fix 1: Clear localStorage and re-login
```javascript
localStorage.clear()
// Then login again
```

### Fix 2: Check API Base URL
Pastikan `.env.local` ada dan benar:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### Fix 3: Verify Backend Response
Test login endpoint dengan Postman/curl:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Cek struktur response - harus sesuai dengan yang diharapkan frontend.

## Common Issues

### Issue: Token exists but still 401
**Solution:** Token mungkin expired atau invalid. Cek di jwt.io apakah token valid.

### Issue: Token not in request header
**Solution:** Cek API client interceptor - mungkin ada issue dengan timing atau localStorage access.

### Issue: CORS error
**Solution:** Pastikan backend Django mengizinkan CORS dari frontend origin:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

## Testing

1. Login dengan valid credentials
2. Check console logs untuk debug info
3. Check Network tab untuk request/response
4. Check localStorage untuk token
5. Try accessing protected route
6. Check if token is sent in Authorization header

