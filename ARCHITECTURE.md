# Architecture Documentation

## Overview

This Next.js application follows a modern, scalable architecture with clear separation of concerns.

## Core Principles

1. **Type Safety**: Full TypeScript coverage
2. **Modularity**: Reusable, composable components
3. **Performance**: Optimized for speed and efficiency
4. **Maintainability**: Clean, organized code structure
5. **Scalability**: Easy to extend and grow

## Layer Architecture

### 1. Presentation Layer (`src/components/`)

Handles UI rendering and user interactions.

- **layout/**: Page layout components (Header, Footer, Sidebar)
- **shared/**: Reusable components across features
- **ui/**: Base UI components from shadcn/ui

**Best Practices:**
- Keep components small and focused
- Use composition over inheritance
- Avoid business logic in components

### 2. Application Layer (`src/app/`)

Next.js App Router with internationalization.

- **[locale]/**: Localized routes (en, id)
- Route handlers and page components
- Server and client components

**Best Practices:**
- Use server components by default
- Add 'use client' only when needed
- Leverage Next.js data fetching

### 3. Business Logic Layer (`src/lib/`)

Core business logic and utilities.

#### API Module (`src/lib/api/`)
- **client.ts**: Configured Axios instance with interceptors
- **services.ts**: API service functions
- **types.ts**: Request/response types

#### State Management (`src/lib/stores/`)
- Zustand stores for global state
- Persistent stores for auth and user preferences
- Ephemeral stores for UI state

#### Hooks (`src/lib/hooks/`)
- Custom React hooks
- Reusable logic encapsulation

### 4. Configuration Layer (`src/config/`)

Application-wide configuration.

- **api.config.ts**: API endpoints and settings
- **site.config.ts**: Site metadata and settings

### 5. Internationalization (`src/i18n/`)

Multi-language support configuration.

- **routing.ts**: Locale routing setup
- **request.ts**: i18n request handler
- **messages/**: Translation files

## Data Flow

```
User Action
    ↓
Component (Presentation)
    ↓
Hook or Store (State)
    ↓
API Service (Business Logic)
    ↓
API Client (Infrastructure)
    ↓
Django Backend
```

## State Management Strategy

### When to Use Zustand Stores

- **Global state** that needs to be shared across many components
- **Authentication state**
- **User preferences**
- **Application-wide settings**

### When to Use Local State

- **Form inputs**
- **UI toggles** (modals, dropdowns)
- **Component-specific state**

### When to Use Server State

- **Data from API** that should be fresh
- Use React Query pattern with `useApi` hook

## API Integration Pattern

### 1. Define Endpoints

```typescript
// src/config/api.config.ts
export const API_ENDPOINTS = {
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
  },
};
```

### 2. Create Service Functions

```typescript
// src/lib/api/services.ts
export const productService = {
  getProducts: () => get(API_ENDPOINTS.products.list),
  getProduct: (id: string) => get(API_ENDPOINTS.products.detail(id)),
};
```

### 3. Use in Components

```typescript
// Component
import { useApi } from '@/lib/hooks/useApi';
import { productService } from '@/lib/api';

const { data, loading, execute } = useApi(productService.getProducts);
```

## Folder Structure Best Practices

### Adding New Features

When adding a new feature (e.g., "orders"):

1. **Create page**: `src/app/[locale]/orders/page.tsx`
2. **Create components**: `src/components/orders/` (if needed)
3. **Define API**: Add to `src/config/api.config.ts`
4. **Create services**: Add to `src/lib/api/services.ts`
5. **Add types**: Add to `src/types/index.ts`
6. **Add translations**: Update `messages/en.json` and `messages/id.json`

### Component Organization

```
src/components/
├── layout/          # Layout components
│   ├── Header.tsx
│   └── Footer.tsx
├── shared/          # Shared across features
│   └── LanguageSwitcher.tsx
├── ui/              # Base UI components (shadcn)
│   ├── button.tsx
│   └── card.tsx
└── [feature]/       # Feature-specific components
    ├── FeatureList.tsx
    └── FeatureDetail.tsx
```

## Security Considerations

1. **Authentication**: Tokens stored in localStorage and httpOnly cookies
2. **API Client**: Automatic token injection via interceptors
3. **Environment Variables**: Never commit `.env.local`
4. **CORS**: Configure Django backend properly
5. **CSRF**: Handle Django CSRF tokens if needed

## Performance Optimization

1. **Code Splitting**: Automatic with Next.js App Router
2. **Image Optimization**: Use `next/image`
3. **Font Optimization**: Use `next/font`
4. **API Caching**: Implement with React Query pattern
5. **Static Generation**: Use when possible

## Error Handling

### API Errors

```typescript
// Handled globally in API client
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    switch (error.response?.status) {
      case 401: // Unauthorized
      case 403: // Forbidden
      case 500: // Server error
    }
  }
);
```

### Component Errors

```typescript
// Use error boundaries
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

## Testing Strategy

### Unit Tests
- Test utility functions
- Test stores
- Test custom hooks

### Integration Tests
- Test API services
- Test component interactions

### E2E Tests
- Test critical user flows
- Test authentication
- Test main features

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Build succeeds without errors
- [ ] All tests passing
- [ ] No console errors
- [ ] API endpoints correct
- [ ] Translations complete
- [ ] SEO metadata added
- [ ] Analytics configured

## Future Enhancements

- [ ] Add React Query for advanced caching
- [ ] Implement error boundary components
- [ ] Add loading skeletons
- [ ] Implement toast notifications
- [ ] Add form validation with Zod
- [ ] Set up E2E testing with Playwright
- [ ] Add dark mode support
- [ ] Implement PWA features
- [ ] Add analytics tracking
- [ ] Set up monitoring (Sentry)


