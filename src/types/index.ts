/**
 * Global TypeScript Types
 * Add your custom types and interfaces here
 */

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Add your Django model types here
// Example:
/*
export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface Order extends BaseEntity {
  userId: string;
  products: Product[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}
*/


