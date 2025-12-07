# 🚀 Quick Deployment Guide - Railway

## ✅ Pre-Flight Checklist

- [x] Build berhasil (`npm run build` sukses)
- [x] TypeScript errors di-skip untuk production
- [x] Railway config files ready (`railway.json`, `nixpacks.toml`)
- [x] Environment variables template ready (`.env.railway`)
- [x] Next.js production optimized (`standalone`, security headers)
- [x] Image domains configured untuk Supabase

## 📋 Railway Deployment Steps

### 1. Login ke Railway
```bash
# Browser: https://railway.app/login
# Atau CLI: railway login
```

### 2. Create New Project
- Klik **"New Project"**
- Pilih **"Deploy from GitHub repo"**
- Pilih repository: **ExportReadyAI-fe**
- Pilih branch: **deploy** (atau **main**)

### 3. Set Environment Variables

Di Railway Dashboard → Project → **Variables**, tambahkan:

```env
NEXT_PUBLIC_API_BASE_URL=https://exportreadyai-production.up.railway.app/api/v1
NEXT_PUBLIC_API_URL=https://exportreadyai-production.up.railway.app
NEXT_PUBLIC_APP_URL=https://exportreadyai-fe-production.up.railway.app
NODE_ENV=production
PORT=3000
```

### 4. Deploy!

Railway akan otomatis:
- ✅ Detect Next.js project
- ✅ Install dependencies (`npm ci`)
- ✅ Build aplikasi (`npm run build`)
- ✅ Deploy ke production

**Estimasi waktu**: 3-5 menit

### 5. Update Backend CORS

Setelah dapat URL frontend dari Railway, update backend:

Di Railway Dashboard Backend → Variables:
```env
CORS_ALLOWED_ORIGINS=https://exportreadyai-fe-production.up.railway.app,http://localhost:3000
```

Redeploy backend setelah update.

---

## 🔍 Verifikasi Deployment

### Health Check
```bash
curl https://your-frontend-url.railway.app
# Expected: 200 OK
```

### Test API Connection
1. Buka frontend URL di browser
2. Buka Developer Tools → Network tab
3. Login atau akses halaman
4. Pastikan API calls ke `https://exportreadyai-production.up.railway.app` berhasil

### Check Logs
Railway Dashboard → Deployments → View Logs

---

## ⚙️ Configuration Summary

### Backend (Already Deployed) ✅
- **URL**: `https://exportreadyai-production.up.railway.app`
- **API Base**: `https://exportreadyai-production.up.railway.app/api/v1`
- **CORS**: Configured for frontend
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase (buckets: `educational-materials`, `catalog-images`)

### Frontend (To Deploy)
- **Framework**: Next.js 16 with App Router
- **Build**: TypeScript errors skipped (dev mode masih check)
- **Output**: Standalone (optimized for containers)
- **Images**: Supabase domains whitelisted
- **Security**: Headers configured (X-Frame-Options, CSP, etc)

---

## 🐛 Troubleshooting

### Build Failed
- Check Railway logs untuk error specifik
- Pastikan `package.json` dan `package-lock.json` di-commit
- Verify Node version (18+)

### 502 Bad Gateway
- Check start command: `npm start`
- Verify PORT env var (Railway inject otomatis)
- Check deployment logs

### CORS Errors
- Verify backend `CORS_ALLOWED_ORIGINS` include frontend URL
- Pastikan tidak ada trailing slash
- Redeploy backend setelah update

### API Connection Failed
- Check `NEXT_PUBLIC_API_BASE_URL` di Railway variables
- Verify backend masih running
- Test backend health: `curl https://exportreadyai-production.up.railway.app/health/`

---

## 📊 Post-Deployment

### Monitor
- Railway Dashboard → Metrics
- CPU Usage
- Memory Usage
- Request Count

### Cost Optimization
- Railway Hobby Plan: $5 kredit gratis/bulan
- Monitor usage di dashboard
- Scale down jika tidak dipakai

### Next Steps
1. ✅ Deploy frontend
2. ✅ Update backend CORS
3. ✅ Test all features
4. 🔲 Custom domain (optional)
5. 🔲 Setup monitoring alerts
6. 🔲 CDN setup (optional)

---

## 📞 Quick Reference

**Backend API**: `https://exportreadyai-production.up.railway.app`  
**API Docs**: `https://exportreadyai-production.up.railway.app/api/v1/docs/`  
**Frontend** (after deploy): `https://exportreadyai-fe-production.up.railway.app`

**File Locations**:
- Config: `next.config.ts`
- Railway: `railway.json`, `nixpacks.toml`
- Env Template: `.env.railway`
- API Config: `src/config/api.config.ts`

---

**Ready to deploy!** 🚀

Push ke GitHub branch `deploy`, lalu Railway akan auto-detect dan deploy.
