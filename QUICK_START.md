# Quick Start Guide

Get up and running in 5 minutes! 🚀

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Your Django backend running

## Step 1: Environment Setup

Create `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Update `NEXT_PUBLIC_API_BASE_URL` with your Django backend URL.

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## What You Get

✅ **Multi-language support** - Switch between EN/ID  
✅ **API ready** - Pre-configured Axios client  
✅ **State management** - Zustand stores ready to use  
✅ **UI components** - shadcn/ui components included  
✅ **Type-safe** - Full TypeScript support  

## First Steps

### 1. Update API Endpoints

Edit `src/config/api.config.ts`:

```typescript
export const API_ENDPOINTS = {
  // Add your Django endpoints here
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
  },
};
```

### 2. Add API Services

Edit `src/lib/api/services.ts`:

```typescript
export const productService = {
  getProducts: () => get(API_ENDPOINTS.products.list),
  getProduct: (id: string) => get(API_ENDPOINTS.products.detail(id)),
};
```

### 3. Create Your First Page

```typescript
// src/app/[locale]/products/page.tsx
import { useTranslations } from 'next-intl';

export default function ProductsPage() {
  const t = useTranslations('common');
  return <h1>Products Page</h1>;
}
```

### 4. Add Translations

Edit `messages/en.json` and `messages/id.json`:

```json
{
  "products": {
    "title": "Products",
    "subtitle": "Manage your products"
  }
}
```

### 5. Use in Component

```typescript
const t = useTranslations('products');
return <h1>{t('title')}</h1>;
```

## Common Tasks

### Add a New shadcn/ui Component

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add table
```

### Make an API Call

```typescript
import { get } from '@/lib/api';

// In your component
const fetchData = async () => {
  try {
    const data = await get('/your-endpoint');
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
```

### Use Global State

```typescript
import { useAuthStore } from '@/lib/stores/auth.store';

function MyComponent() {
  const { user, isAuthenticated } = useAuthStore();
  return <div>{user?.name}</div>;
}
```

### Add a New Route

Create a new folder and file:

```
src/app/[locale]/my-page/page.tsx
```

That's it! It's automatically routed to `/en/my-page` and `/id/my-page`.

## Project Structure Quick Reference

```
src/
├── app/[locale]/       → Your pages
├── components/         → Your components
│   ├── layout/        → Header, Footer
│   ├── shared/        → Shared components
│   └── ui/            → shadcn/ui components
├── config/            → Configuration
├── lib/
│   ├── api/           → API client & services
│   ├── stores/        → Zustand stores
│   └── hooks/         → Custom hooks
└── types/             → TypeScript types
```

## Authentication Flow Example

```typescript
// Login
import { useAuthStore } from '@/lib/stores/auth.store';
import { post } from '@/lib/api';

const { setAuth } = useAuthStore();

const handleLogin = async (email: string, password: string) => {
  const response = await post('/auth/login', { email, password });
  setAuth(response.user, response.token);
  // Token is now automatically added to all API requests
};

// Logout
const { logout } = useAuthStore();
logout();
```

## Building for Production

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

## Need Help?

- 📖 Read the [full README](./README.md)
- 🏗️ Check [Architecture docs](./ARCHITECTURE.md)
- 📁 See [Folder Structure guide](./FOLDER_STRUCTURE.md)

## Next Steps

1. ✅ Set up your Django backend connection
2. ✅ Define your API endpoints
3. ✅ Create your first feature page
4. ✅ Add your translations
5. ✅ Deploy to Vercel

**You're all set! Start building your export application! 🚀**


