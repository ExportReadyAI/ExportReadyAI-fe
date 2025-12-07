# 🚂 Railway Deployment Checklist

## Pre-Deployment

- [ ] Code pushed to GitHub repository
- [ ] All environment variables documented
- [ ] Build successful locally (`npm run build`)
- [ ] Backend API accessible and tested
- [ ] No sensitive data hardcoded

## Railway Setup

### 1. Create New Project
- [ ] Login to [Railway.app](https://railway.app)
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose `ExportReadyAI-fe` repository
- [ ] Select branch: `main` or `compliant`

### 2. Configure Environment Variables
Navigate to: **Project → Variables**

Add these variables:
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app/api/v1
NEXT_PUBLIC_APP_URL=https://your-frontend.railway.app
NODE_ENV=production
```

- [ ] `NEXT_PUBLIC_API_BASE_URL` configured
- [ ] `NEXT_PUBLIC_APP_URL` configured (optional)
- [ ] `NODE_ENV` set to `production`

### 3. Build Configuration (Auto-detected)
Railway will automatically:
- [ ] Detect Next.js project
- [ ] Use Nixpacks builder
- [ ] Run `npm run build`
- [ ] Start with `npm start`
- [ ] Expose port 3000

### 4. Deployment Settings
Navigate to: **Project → Settings**

- [ ] Auto-deploy enabled (on push to main)
- [ ] PR previews enabled (optional)
- [ ] Custom domain added (optional)
- [ ] SSL certificate active (auto)

### 5. Deploy
- [ ] Click "Deploy" or push to main branch
- [ ] Monitor build logs
- [ ] Wait for deployment to complete
- [ ] Check health status

## Post-Deployment

### Verification
- [ ] Open Railway URL
- [ ] Test homepage loads
- [ ] Test authentication (login/register)
- [ ] Test API connectivity
- [ ] Check browser console for errors
- [ ] Verify all routes work
- [ ] Test product creation
- [ ] Test export analysis

### Performance Check
- [ ] Page load time < 3s
- [ ] API response time < 2s
- [ ] No console errors
- [ ] Images load correctly
- [ ] No CORS errors

### Monitoring
- [ ] Check Railway logs
- [ ] Monitor resource usage
- [ ] Set up alerts (optional)
- [ ] Monitor error rates

## Custom Domain (Optional)

### 1. Add Domain in Railway
- [ ] Go to Settings → Domains
- [ ] Click "Add Domain"
- [ ] Enter your domain

### 2. Configure DNS
Add these records to your DNS provider:

```
Type: CNAME
Name: www (or your subdomain)
Value: [provided by Railway]
TTL: 3600
```

- [ ] DNS records added
- [ ] Wait for DNS propagation (5-30 minutes)
- [ ] Verify domain works
- [ ] SSL certificate issued (auto)

## Troubleshooting

### Build Failures
- [ ] Check Railway build logs
- [ ] Verify all dependencies in package.json
- [ ] Check Node version compatibility
- [ ] Verify build command works locally

### Runtime Errors
- [ ] Check Railway runtime logs
- [ ] Verify environment variables
- [ ] Test API endpoint accessibility
- [ ] Check CORS configuration

### Performance Issues
- [ ] Monitor Railway metrics
- [ ] Check API response times
- [ ] Optimize images
- [ ] Enable caching

## Rollback Plan

If deployment fails:
1. [ ] Check logs for errors
2. [ ] Fix issues in code
3. [ ] Push fix to GitHub
4. [ ] Railway auto-deploys
5. [ ] Or manually rollback in Dashboard

## Cost Management

Railway Pricing:
- **Free**: $5 credit/month
- **Hobby**: $5/month + usage
- **Pro**: $20/month + usage

- [ ] Monitor usage in Dashboard
- [ ] Set spending limits (optional)
- [ ] Optimize resource usage

## Success Criteria

Deployment is successful when:
- ✅ Build completes without errors
- ✅ Health check passes
- ✅ Application accessible via Railway URL
- ✅ All features functional
- ✅ No console errors
- ✅ API connectivity working
- ✅ Authentication functional

## Quick Commands

```bash
# View logs
railway logs

# Rollback
railway rollback

# Deploy manually
railway up

# Open dashboard
railway open
```

## Support

- 📖 [DEPLOYMENT.md](./DEPLOYMENT.md) - Full deployment guide
- 🌐 [Railway Docs](https://docs.railway.app)
- 💬 [Railway Discord](https://discord.gg/railway)

---

**Status**: Ready for deployment ✅  
**Last Updated**: December 7, 2025
