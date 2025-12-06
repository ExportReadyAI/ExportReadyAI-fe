# Code Snippets

Handy code snippets for common tasks in this project.

## Table of Contents

- [Pages](#pages)
- [Components](#components)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Translations](#translations)
- [Forms](#forms)

---

## Pages

### Basic Page with Layout

```typescript
// src/app/[locale]/my-page/page.tsx
import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'My Page',
  description: 'Page description for SEO',
};

export default function MyPage() {
  const t = useTranslations('myPage');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
        {/* Your content */}
      </main>
      <Footer />
    </div>
  );
}
```

### Page with Data Fetching

```typescript
// src/app/[locale]/products/page.tsx
'use client';

import { useEffect } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { get } from '@/lib/api';
import { Card } from '@/components/ui/card';

export default function ProductsPage() {
  const { data, loading, error, execute } = useApi(() => 
    get('/products')
  );

  useEffect(() => {
    execute({});
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.map((product: any) => (
        <Card key={product.id}>
          <h3>{product.name}</h3>
        </Card>
      ))}
    </div>
  );
}
```

### Dynamic Route Page

```typescript
// src/app/[locale]/products/[id]/page.tsx
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  
  // Fetch data
  // const product = await fetchProduct(id);
  // if (!product) notFound();

  return (
    <div>
      <h1>Product {id}</h1>
    </div>
  );
}
```

---

## Components

### Client Component with State

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
  onSubmit: (data: string) => void;
}

export default function MyComponent({ title, onSubmit }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    onSubmit(value);
    setValue('');
  };

  return (
    <div className="space-y-4">
      <h2>{title}</h2>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border px-4 py-2 rounded"
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
```

### Server Component

```typescript
// Server component by default - no 'use client'
import { Card } from '@/components/ui/card';

interface Props {
  data: Array<{ id: string; name: string }>;
}

export default function DataList({ data }: Props) {
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <Card key={item.id}>
          <p>{item.name}</p>
        </Card>
      ))}
    </div>
  );
}
```

### Component with Translations

```typescript
'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function TranslatedComponent() {
  const t = useTranslations('common');

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <Button>{t('save')}</Button>
    </div>
  );
}
```

---

## API Integration

### Define API Endpoints

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
  orders: {
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
  },
};
```

### Create Service Functions

```typescript
// src/lib/api/services.ts
import { get, post, put, del } from './services';
import { API_ENDPOINTS } from '@/config/api.config';

export const productService = {
  getProducts: (params?: any) => 
    get(API_ENDPOINTS.products.list, { params }),
  
  getProduct: (id: string) => 
    get(API_ENDPOINTS.products.detail(id)),
  
  createProduct: (data: any) => 
    post(API_ENDPOINTS.products.create, data),
  
  updateProduct: (id: string, data: any) => 
    put(API_ENDPOINTS.products.update(id), data),
  
  deleteProduct: (id: string) => 
    del(API_ENDPOINTS.products.delete(id)),
};
```

### Use API in Component

```typescript
'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/lib/api';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map((product: any) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Use API with useApi Hook

```typescript
'use client';

import { useEffect } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { productService } from '@/lib/api';

export default function ProductList() {
  const { data, loading, error, execute } = useApi(
    productService.getProducts,
    {
      onSuccess: (data) => console.log('Success:', data),
      onError: (error) => console.error('Error:', error),
    }
  );

  useEffect(() => {
    execute({});
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data?.map((product: any) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

## State Management

### Create a New Store

```typescript
// src/lib/stores/products.store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
}

interface ProductsActions {
  setProducts: (products: Product[]) => void;
  selectProduct: (product: Product) => void;
  clearSelection: () => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
}

type ProductsStore = ProductsState & ProductsActions;

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
};

export const useProductsStore = create<ProductsStore>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setProducts: (products) => set({ products }),
      
      selectProduct: (product) => set({ selectedProduct: product }),
      
      clearSelection: () => set({ selectedProduct: null }),
      
      addProduct: (product) => 
        set((state) => ({ products: [...state.products, product] })),
      
      removeProduct: (id) => 
        set((state) => ({ 
          products: state.products.filter(p => p.id !== id) 
        })),
    })
  )
);
```

### Use Store in Component

```typescript
'use client';

import { useProductsStore } from '@/lib/stores/products.store';
import { Button } from '@/components/ui/button';

export default function ProductManager() {
  const { products, selectedProduct, selectProduct, addProduct } = 
    useProductsStore();

  return (
    <div>
      <Button onClick={() => addProduct({ 
        id: '1', 
        name: 'New Product', 
        price: 100 
      })}>
        Add Product
      </Button>

      {products.map((product) => (
        <div key={product.id} onClick={() => selectProduct(product)}>
          {product.name} - ${product.price}
        </div>
      ))}

      {selectedProduct && (
        <div>Selected: {selectedProduct.name}</div>
      )}
    </div>
  );
}
```

### Persistent Store (with localStorage)

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useSettingsStore = create(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        language: 'en',
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
      }),
      {
        name: 'settings-store', // localStorage key
      }
    )
  )
);
```

---

## Translations

### Add Translation Keys

```json
// messages/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "products": {
    "title": "Products",
    "createNew": "Create New Product",
    "editProduct": "Edit Product",
    "deleteConfirm": "Are you sure you want to delete this product?"
  }
}
```

```json
// messages/id.json
{
  "common": {
    "save": "Simpan",
    "cancel": "Batal",
    "delete": "Hapus"
  },
  "products": {
    "title": "Produk",
    "createNew": "Buat Produk Baru",
    "editProduct": "Edit Produk",
    "deleteConfirm": "Apakah Anda yakin ingin menghapus produk ini?"
  }
}
```

### Use in Server Component

```typescript
import { useTranslations } from 'next-intl';

export default function ProductsPage() {
  const t = useTranslations('products');

  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('createNew')}</button>
    </div>
  );
}
```

### Use in Client Component

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function ProductForm() {
  const t = useTranslations('products');
  const tCommon = useTranslations('common');

  return (
    <form>
      <button type="submit">{tCommon('save')}</button>
      <button type="button">{tCommon('cancel')}</button>
    </form>
  );
}
```

### Translation with Variables

```json
{
  "greeting": "Hello, {name}!",
  "itemCount": "You have {count} items"
}
```

```typescript
const t = useTranslations();

<p>{t('greeting', { name: 'John' })}</p>
<p>{t('itemCount', { count: 5 })}</p>
```

---

## Forms

### Simple Form with State

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { post } from '@/lib/api';

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await post('/products', formData);
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="border px-4 py-2 rounded w-full"
      />
      
      <input
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="border px-4 py-2 rounded w-full"
      />
      
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange as any}
        placeholder="Description"
        className="border px-4 py-2 rounded w-full"
      />
      
      <Button type="submit">Create Product</Button>
    </form>
  );
}
```

### Form with API Integration

```typescript
'use client';

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { productService } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function ProductForm() {
  const [formData, setFormData] = useState({ name: '', price: 0 });
  
  const { loading, execute } = useApi(productService.createProduct, {
    onSuccess: () => {
      alert('Product created!');
      setFormData({ name: '', price: 0 });
    },
    onError: (error) => {
      alert('Error: ' + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="border px-4 py-2 rounded w-full"
      />
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </Button>
    </form>
  );
}
```

---

## Utility Functions

### Format Date

```typescript
// src/lib/utils.ts
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

### Format Currency

```typescript
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
```

### Debounce Hook

```typescript
// src/lib/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

These snippets should cover most common scenarios! Copy and adapt them as needed. 🚀


