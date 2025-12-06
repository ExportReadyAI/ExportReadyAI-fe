# Setup Checklist

Complete setup guide for your Next.js export application.

## ✅ Initial Setup (Already Done!)

- [x] Next.js project created
- [x] TypeScript configured
- [x] Tailwind CSS installed
- [x] shadcn/ui initialized
- [x] next-intl configured
- [x] Axios installed
- [x] Zustand installed
- [x] Professional folder structure created
- [x] Documentation written

## 📋 Configuration Steps (Do These Now)

### 1. Environment Variables

- [ ] Copy `.env.example` to `.env.local`:
  ```bash
  # If it doesn't exist, create it with:
  ```
  
  Add this content to `.env.local`:
  ```bash
  NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```

- [ ] Update `NEXT_PUBLIC_API_BASE_URL` with your actual Django backend URL

### 2. Django Backend Integration

- [ ] Make sure your Django backend is running
- [ ] Configure CORS in Django to allow your Next.js frontend:
  ```python
  # Django settings.py
  CORS_ALLOWED_ORIGINS = [
      "http://localhost:3000",
      # Add your production domain
  ]
  ```

- [ ] Test API connection:
  ```bash
  curl http://localhost:8000/api/
  ```

### 3. Define Your API Endpoints

- [ ] Open `src/config/api.config.ts`
- [ ] Add your Django API endpoints:
  ```typescript
  export const API_ENDPOINTS = {
    // Your endpoints here
    products: {
      list: '/products',
      detail: (id: string) => `/products/${id}`,
    },
  };
  ```

### 4. Add TypeScript Types

- [ ] Open `src/types/index.ts`
- [ ] Define types matching your Django models:
  ```typescript
  export interface Product {
    id: string;
    name: string;
    price: number;
    // ... other fields
  }
  ```

### 5. Create API Services

- [ ] Open `src/lib/api/services.ts`
- [ ] Add service functions for your endpoints:
  ```typescript
  export const productService = {
    getProducts: () => get(API_ENDPOINTS.products.list),
    // ... other methods
  };
  ```

### 6. Update Translations

- [ ] Edit `messages/en.json` - Add English translations
- [ ] Edit `messages/id.json` - Add Indonesian translations
- [ ] Use consistent keys across both files

### 7. Customize Site Configuration

- [ ] Open `src/config/site.config.ts`
- [ ] Update site name and description:
  ```typescript
  export const siteConfig = {
    name: 'Your App Name',
    description: 'Your app description',
    // ...
  };
  ```

## 🧪 Testing Steps

### Local Development

- [ ] Run development server:
  ```bash
  npm run dev
  ```

- [ ] Test English version: `http://localhost:3000/en`
- [ ] Test Indonesian version: `http://localhost:3000/id`
- [ ] Test language switcher
- [ ] Test navigation between pages

### API Integration Testing

- [ ] Test API connection from browser console:
  ```javascript
  fetch('http://localhost:8000/api/')
    .then(r => r.json())
    .then(console.log)
  ```

- [ ] Verify CORS is working (no CORS errors in console)
- [ ] Test a GET request from your app
- [ ] Test authentication flow (if applicable)

### Build Testing

- [ ] Build the project:
  ```bash
  npm run build
  ```

- [ ] Check for TypeScript errors
- [ ] Check for ESLint warnings
- [ ] Test production build locally:
  ```bash
  npm run start
  ```

## 🎨 Customization (Optional)

### Add More shadcn/ui Components

```bash
npx shadcn@latest add dialog
npx shadcn@latest add table
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add toast
```

### Add More Pages

Create new pages in `src/app/[locale]/`:
- [ ] Products page
- [ ] Orders page
- [ ] Profile page
- [ ] Settings page

### Add Custom Hooks

Create hooks in `src/lib/hooks/`:
- [ ] useDebounce
- [ ] useMediaQuery
- [ ] useLocalStorage

### Add More Stores

Create stores in `src/lib/stores/`:
- [ ] Products store
- [ ] Orders store
- [ ] UI state store

## 🚢 Deployment Preparation

### Vercel Deployment

- [ ] Create GitHub repository
- [ ] Push code to GitHub:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin YOUR_REPO_URL
  git push -u origin main
  ```

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Import your GitHub repository
- [ ] Add environment variables in Vercel:
  - `NEXT_PUBLIC_API_BASE_URL` (production Django URL)
  - `NEXT_PUBLIC_APP_URL` (your Vercel domain)

- [ ] Deploy!

### Environment Variables for Production

Make sure to set these in Vercel:

```
NEXT_PUBLIC_API_BASE_URL=https://your-django-backend.com/api
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 📊 Project Health Checks

### Before First Commit

- [ ] No TypeScript errors: `npm run build`
- [ ] No ESLint errors: `npm run lint`
- [ ] All pages load correctly
- [ ] Language switching works
- [ ] API integration tested
- [ ] Environment variables configured

### Before Deployment

- [ ] Production build succeeds
- [ ] Environment variables set in Vercel
- [ ] Django backend is accessible from internet
- [ ] CORS configured for production domain
- [ ] All features tested locally
- [ ] Documentation updated

## 🔧 Troubleshooting

### Build Errors

If you get build errors:

1. **Check TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

2. **Clear cache and rebuild:**
   ```bash
   rm -rf .next
   npm run build
   ```

3. **Check dependencies:**
   ```bash
   npm install
   ```

### CORS Issues

If API calls fail with CORS errors:

1. Add to Django `settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "https://your-domain.vercel.app",
   ]
   ```

2. Install django-cors-headers if not installed:
   ```bash
   pip install django-cors-headers
   ```

### Translation Issues

If translations don't work:

1. Check locale is in URL: `/en/page` or `/id/page`
2. Verify translation keys exist in both `en.json` and `id.json`
3. Clear browser cache

### API Connection Issues

If API calls fail:

1. Check `.env.local` exists and has correct URL
2. Verify Django backend is running
3. Test API endpoint in browser or Postman
4. Check browser console for detailed errors

## 📝 Additional Tasks

### Nice to Have

- [ ] Add error boundary components
- [ ] Add loading skeletons
- [ ] Add toast notifications
- [ ] Implement form validation
- [ ] Add analytics tracking
- [ ] Set up error monitoring (Sentry)
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Implement dark mode
- [ ] Add PWA features

### Documentation

- [ ] Add API documentation
- [ ] Create component storybook
- [ ] Document custom hooks
- [ ] Add deployment guide
- [ ] Create troubleshooting guide

## 🎯 Success Criteria

Your setup is complete when:

- ✅ App runs locally without errors
- ✅ Both languages (EN/ID) work correctly
- ✅ API calls to Django backend succeed
- ✅ Build completes without errors
- ✅ All pages are accessible
- ✅ Language switcher works
- ✅ Production deployment succeeds

## 🎉 You're Done!

Once all checkboxes are checked, you're ready to start building features!

**Next:** Read `QUICK_START.md` to start adding your first feature.

---

**Need help?** Check the other documentation files:
- `README.md` - Complete guide
- `ARCHITECTURE.md` - System design
- `CODE_SNIPPETS.md` - Examples
- `FOLDER_STRUCTURE.md` - File organization


