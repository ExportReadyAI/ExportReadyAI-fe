/**
 * Auth Store
 * Global authentication state management
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, UserRole } from '@/lib/api/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setAccessToken: (token: string) => void;
  isAdmin: () => boolean;
  isUMKM: () => boolean;
  isBuyer: () => boolean;
  isForwarder: () => boolean;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setAuth: (user, accessToken, refreshToken) => {
          // Store token in localStorage for API client
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
          }
          set({ user, accessToken, refreshToken, isAuthenticated: true });
        },
        
        logout: () => {
          // Clear tokens from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
          set(initialState);
        },
        
        updateUser: (userData) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          })),
        
        setAccessToken: (accessToken) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', accessToken);
          }
          set({ accessToken });
        },
        
        isAdmin: () => {
          const state = get();
          return state.user?.role === 'Admin';
        },
        
        isUMKM: () => {
          const state = get();
          return state.user?.role === 'UMKM';
        },
        
        isBuyer: () => {
          const state = get();
          return state.user?.role === 'Buyer';
        },
        
        isForwarder: () => {
          const state = get();
          return state.user?.role === 'Forwarder';
        },
      }),
      {
        name: 'auth-store',
      }
    )
  )
);


