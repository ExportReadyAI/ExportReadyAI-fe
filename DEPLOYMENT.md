# ExportReady AI - Frontend Deployment Guide

## 🚀 Railway Deployment

### Prerequisites
- Railway account ([railway.app](https://railway.app))
- GitHub repository connected
- Backend API deployed and accessible

### Quick Deploy

1. **Connect Repository**
   ```bash
   # Login to Railway CLI (optional)
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy via Railway Dashboard**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `ExportReadyAI-fe` repository
   - Railway will auto-detect Next.js and deploy

### Environment Variables

Configure these in Railway Dashboard → Project → Variables:

```bash
# Required
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.railway.app/api/v1

# Optional
NEXT_PUBLIC_APP_URL=https://your-frontend.railway.app
NODE_ENV=production
```

### Configuration Files

- ✅ `railway.toml` - Railway build configuration
- ✅ `railway.json` - Railway deployment schema
- ✅ `nixpacks.toml` - Nixpacks build configuration
- ✅ `next.config.ts` - Next.js production config with security headers
- ✅ `.env.example` - Environment variables template

### Build Settings

Railway automatically detects:
- **Builder**: Nixpacks
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: Auto-detected from Next.js (default 3000)

### Health Checks

Railway monitors:
- **Path**: `/`
- **Timeout**: 100s
- **Interval**: 60s

### Performance Optimizations

✅ **Enabled in `next.config.ts`:**
- Standalone output (smaller Docker images)
- Compression enabled
- Security headers (HSTS, X-Frame-Options, CSP)
- Image optimization
- DNS prefetch

### Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (auto by Railway)
- [ ] Health checks passing
- [ ] Test all routes and API calls
- [ ] Monitor Railway logs for errors

### Monitoring & Logs

```bash
# View logs via CLI
railway logs

# Or check Railway Dashboard → Deployments → Logs
```

### Rollback

```bash
# Via CLI
railway rollback

# Or via Dashboard → Deployments → Select previous version
```

### Custom Domain

1. Go to Railway Dashboard → Settings → Domains
2. Add custom domain
3. Configure DNS records:
   ```
   Type: CNAME
   Name: www (or @)
   Value: [provided by Railway]
   ```

### Troubleshooting

**Build Failures:**
- Check Railway build logs
- Verify `package.json` scripts
- Ensure all dependencies in `package.json`

**Runtime Errors:**
- Check environment variables
- Verify API base URL
- Check Railway runtime logs

**Slow Performance:**
- Enable Railway's edge caching
- Optimize images
- Check API response times

### Cost Optimization

Railway offers:
- **Free Tier**: $5 credit/month
- **Hobby Plan**: $5/month + usage
- **Pro Plan**: $20/month + usage

Optimize costs:
- Use standalone output (smaller footprint)
- Enable compression
- Monitor resource usage in Dashboard

### CI/CD Pipeline

Railway auto-deploys on:
- Push to `main` branch
- Pull request previews (optional)

Configure in Railway → Settings → GitHub:
- ✅ Auto-deploy enabled
- ✅ PR previews enabled
- ✅ Branch: `main`

### Security Best Practices

✅ Implemented:
- Security headers in `next.config.ts`
- Environment variables (not hardcoded)
- HTTPS enforced by Railway
- No sensitive data in git

🔒 Recommended:
- Enable Railway's private networking for API
- Use Railway secrets for sensitive vars
- Regular dependency updates
- Monitor Railway security advisories

### Support & Resources

- [Railway Docs](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Railway Community](https://help.railway.app)

---

## 📦 Alternative: Docker Deployment

If you prefer Docker:

```dockerfile
# See Dockerfile in root (create if needed)
docker build -t exportready-fe .
docker run -p 3000:3000 exportready-fe
```

Railway also supports Docker deployments via `Dockerfile`.

---

## 🎯 Quick Commands

```bash
# Install dependencies
npm install

# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Deploy to Railway (via CLI)
railway up
```

---

**Deployment Status**: ✅ Ready for Railway  
**Last Updated**: December 7, 2025
