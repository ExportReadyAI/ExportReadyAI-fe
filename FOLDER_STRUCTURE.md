# Folder Structure Guide

Complete reference for the project's folder structure and file organization.

## Root Directory

```
fe/
├── public/              # Static assets
├── src/                 # Source code
├── messages/            # i18n translation files
├── .env.example         # Environment variables example
├── .env.local          # Local environment (gitignored)
├── .gitignore          # Git ignore rules
├── components.json     # shadcn/ui configuration
├── eslint.config.mjs   # ESLint configuration
├── next.config.ts      # Next.js configuration
├── package.json        # Dependencies
├── postcss.config.mjs  # PostCSS configuration
├── README.md           # Project documentation
├── tsconfig.json       # TypeScript configuration
└── ARCHITECTURE.md     # Architecture documentation
```

## Source Directory (`src/`)

### Application (`src/app/`)

Next.js App Router structure with internationalization.

```
src/app/
├── [locale]/              # Locale-based routing
│   ├── layout.tsx         # Root layout with i18n provider
│   ├── page.tsx           # Home page
│   ├── dashboard/
│   │   └── page.tsx       # Dashboard page
│   ├── about/
│   │   └── page.tsx       # About page
│   └── [feature]/         # Add your feature pages here
├── globals.css            # Global CSS with Tailwind
└── favicon.ico            # Favicon (in [locale] folder)
```

**Guidelines:**
- Pages are automatically routed based on folder structure
- Use `[locale]` for all routes to enable i18n
- Server components by default, add `'use client'` when needed

### Components (`src/components/`)

Reusable UI components organized by purpose.

```
src/components/
├── layout/                # Layout components
│   ├── Header.tsx         # Site header
│   ├── Footer.tsx         # Site footer
│   └── Sidebar.tsx        # Sidebar (add if needed)
├── shared/                # Shared components
│   ├── LanguageSwitcher.tsx
│   └── LoadingSpinner.tsx # Add loading states
├── ui/                    # shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx         # Add with: npx shadcn add dialog
│   └── [component].tsx    # Add more with shadcn CLI
└── [feature]/             # Feature-specific components
    ├── ProductList.tsx
    └── ProductCard.tsx
```

**Guidelines:**
- Keep components small and focused
- Use shadcn/ui for base components
- Feature components go in their own folders

### Configuration (`src/config/`)

Application configuration files.

```
src/config/
├── api.config.ts          # API endpoints and settings
└── site.config.ts         # Site metadata and settings
```

**What to add:**
- API endpoint definitions
- App-wide constants
- Feature flags
- Third-party service configs

### Internationalization (`src/i18n/`)

i18n configuration with next-intl.

```
src/i18n/
├── routing.ts             # Locale routing configuration
└── request.ts             # i18n request handler
```

**Note:** Translation files are in `/messages/` at root level.

### Library (`src/lib/`)

Core utilities, services, and business logic.

```
src/lib/
├── api/                   # API client and services
│   ├── client.ts          # Axios instance with interceptors
│   ├── services.ts        # Reusable API functions
│   ├── types.ts           # API-related types
│   └── index.ts           # Barrel export
├── hooks/                 # Custom React hooks
│   ├── useApi.ts          # API call hook
│   ├── useDebounce.ts     # Add more hooks
│   └── useMediaQuery.ts   # Responsive hooks
├── stores/                # Zustand stores
│   ├── auth.store.ts      # Authentication state
│   ├── example.store.ts   # Store template
│   └── [feature].store.ts # Feature stores
└── utils.ts               # Utility functions (cn, etc.)
```

**API Module Guidelines:**
- All API calls go through `client.ts`
- Service functions in `services.ts`
- Type definitions in `types.ts`

**Hooks Guidelines:**
- Reusable logic only
- Follow React hooks rules
- One hook per file

**Store Guidelines:**
- One store per feature/domain
- Use persist middleware for persistent state
- Keep stores focused and small

### Types (`src/types/`)

Global TypeScript type definitions.

```
src/types/
├── index.ts               # Global types
├── api.types.ts           # API-specific types (if large)
└── models.ts              # Domain models
```

**Guidelines:**
- Mirror your Django models
- Use interfaces for objects
- Export all types from index.ts

### Middleware (`src/middleware.ts`)

Next.js middleware for routing and i18n.

```
src/middleware.ts          # Locale detection & routing
```

## Messages Directory (`messages/`)

Translation files for internationalization.

```
messages/
├── en.json                # English translations
└── id.json                # Indonesian translations
```

**Structure:**

```json
{
  "nav": { "home": "Home" },
  "common": { "save": "Save" },
  "featureName": {
    "title": "Feature Title",
    "description": "Description"
  }
}
```

**Guidelines:**
- Organize by feature/page
- Keep keys consistent across languages
- Use descriptive key names

## Public Directory (`public/`)

Static assets served directly.

```
public/
├── images/                # Images
├── fonts/                 # Custom fonts (if not using next/font)
├── icons/                 # Icons and SVGs
└── [asset].svg            # Static SVG files
```

**Guidelines:**
- Optimize images before adding
- Use next/image for images when possible
- Keep assets organized in subfolders

## Adding New Features

When adding a new feature called "products":

### 1. Create Pages

```
src/app/[locale]/products/
├── page.tsx               # List page
├── [id]/
│   └── page.tsx           # Detail page
└── layout.tsx             # Products layout (optional)
```

### 2. Create Components

```
src/components/products/
├── ProductList.tsx
├── ProductCard.tsx
├── ProductForm.tsx
└── ProductFilters.tsx
```

### 3. Add API Configuration

```typescript
// src/config/api.config.ts
export const API_ENDPOINTS = {
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
  },
};
```

### 4. Create API Services

```typescript
// src/lib/api/services.ts
export const productService = {
  getProducts: (params?: any) => get(API_ENDPOINTS.products.list, { params }),
  getProduct: (id: string) => get(API_ENDPOINTS.products.detail(id)),
  createProduct: (data: any) => post(API_ENDPOINTS.products.create, data),
  updateProduct: (id: string, data: any) => put(API_ENDPOINTS.products.update(id), data),
  deleteProduct: (id: string) => del(API_ENDPOINTS.products.delete(id)),
};
```

### 5. Add Types

```typescript
// src/types/index.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
}
```

### 6. Add Store (if needed)

```typescript
// src/lib/stores/products.store.ts
export const useProductsStore = create<ProductsStore>()(...);
```

### 7. Add Translations

```json
// messages/en.json
{
  "products": {
    "title": "Products",
    "create": "Create Product",
    "edit": "Edit Product"
  }
}
```

## Best Practices

### File Naming

- **Components**: PascalCase (`ProductCard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Config**: camelCase with suffix (`api.config.ts`)
- **Stores**: camelCase with suffix (`auth.store.ts`)
- **Types**: camelCase with suffix (`api.types.ts`)

### Import Order

```typescript
// 1. External libraries
import { useState } from 'react';
import axios from 'axios';

// 2. Internal absolute imports
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth.store';

// 3. Relative imports
import { formatDate } from './utils';

// 4. Types
import type { User } from '@/types';
```

### Barrel Exports

Use index.ts files for clean imports:

```typescript
// src/lib/api/index.ts
export { default as apiClient } from './client';
export * from './services';
export type * from './types';

// Then import like:
import { apiClient, get, post } from '@/lib/api';
```

## Common Patterns

### Component Structure

```typescript
'use client'; // Only if needed

// Imports
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

// Types
interface Props {
  title: string;
}

// Component
export default function MyComponent({ title }: Props) {
  const t = useTranslations('common');
  
  return (
    <div>
      <h1>{title}</h1>
      <Button>{t('save')}</Button>
    </div>
  );
}
```

### Page Structure

```typescript
// Imports
import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Metadata (for SEO)
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
};

// Page Component
export default function Page() {
  const t = useTranslations('pageName');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page content */}
      </main>
      <Footer />
    </div>
  );
}
```

This structure provides a solid foundation for building scalable Next.js applications! 🚀


