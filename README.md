# Export Web Application

A modern, production-ready Next.js application for export management with internationalization support.

## 🚀 Features

- ⚡ **Next.js 15** with App Router
- 📘 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🧩 **shadcn/ui** components
- 🌍 **next-intl** for internationalization (EN/ID)
- 🔄 **Axios** for API integration
- 📦 **Zustand** for state management
- 🏗️ Professional folder structure

## 📁 Project Structure

```
fe/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Localized routes
│   │   │   ├── layout.tsx     # Locale-specific layout
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── dashboard/     # Dashboard pages
│   │   │   └── about/         # About page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── layout/            # Layout components (Header, Footer)
│   │   ├── shared/            # Shared components
│   │   └── ui/                # shadcn/ui components
│   ├── config/
│   │   ├── api.config.ts      # API configuration
│   │   └── site.config.ts     # Site configuration
│   ├── i18n/
│   │   ├── routing.ts         # Internationalization routing
│   │   └── request.ts         # i18n request config
│   ├── lib/
│   │   ├── api/               # API client & services
│   │   │   ├── client.ts      # Axios instance
│   │   │   ├── services.ts    # API service functions
│   │   │   ├── types.ts       # API types
│   │   │   └── index.ts       # Exports
│   │   ├── hooks/             # Custom React hooks
│   │   ├── stores/            # Zustand stores
│   │   └── utils.ts           # Utility functions
│   ├── types/
│   │   └── index.ts           # Global TypeScript types
│   └── middleware.ts          # Next.js middleware
├── messages/
│   ├── en.json                # English translations
│   └── id.json                # Indonesian translations
├── public/                    # Static assets
└── [config files]
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env.local` and update with your Django backend URL:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌍 Internationalization

This project uses `next-intl` for internationalization. Translations are stored in the `messages/` directory.

### Adding Translations

1. Add your translation keys to `messages/en.json` and `messages/id.json`
2. Use the `useTranslations` hook in your components:

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  return <h1>{t('welcome')}</h1>;
}
```

### Switching Languages

Use the `LanguageSwitcher` component or navigate to `/en` or `/id` routes.

## 🔌 API Integration

### Configuration

API configuration is in `src/config/api.config.ts`. Update your Django backend endpoints there:

```typescript
export const API_ENDPOINTS = {
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
  },
};
```

### Making API Calls

Use the pre-configured API client:

```typescript
import { get, post } from '@/lib/api';

// GET request
const data = await get('/endpoint');

// POST request
const result = await post('/endpoint', { data });
```

### Using the useApi Hook

For components, use the `useApi` hook:

```tsx
import { useApi } from '@/lib/hooks/useApi';
import { get } from '@/lib/api';

export default function MyComponent() {
  const { data, loading, error, execute } = useApi(
    () => get('/users')
  );

  useEffect(() => {
    execute({});
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

## 📦 State Management

This project uses Zustand for state management. Stores are in `src/lib/stores/`.

### Using Stores

```typescript
import { useAuthStore } from '@/lib/stores/auth.store';

export default function MyComponent() {
  const { user, isAuthenticated, setAuth } = useAuthStore();
  
  // Access state and actions
  return <div>{user?.name}</div>;
}
```

### Creating New Stores

See `src/lib/stores/example.store.ts` for a template.

## 🎨 Styling with shadcn/ui

Add new components from shadcn/ui:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

Components are added to `src/components/ui/`.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to set these in your Vercel project:

```
NEXT_PUBLIC_API_BASE_URL=https://your-django-backend.com/api
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔐 Authentication

Authentication state is managed in `src/lib/stores/auth.store.ts`. The API client automatically adds the Bearer token from localStorage to all requests.

### Login Flow Example

```typescript
import { useAuthStore } from '@/lib/stores/auth.store';
import { post } from '@/lib/api';

const { setAuth } = useAuthStore();

// Login
const response = await post('/auth/login', { email, password });
setAuth(response.user, response.token);

// Logout
const { logout } = useAuthStore();
logout();
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [next-intl](https://next-intl-docs.vercel.app)
- [Zustand](https://zustand-demo.pmnd.rs)
- [Axios](https://axios-http.com)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

MIT License

---

**Happy coding! 🎉**
