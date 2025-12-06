/**
 * Auth Store
 * Global authentication state management
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  // Add more user fields from your Django backend
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setAuth: (user, token) => {
          // Store token in localStorage for API client
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
          }
          set({ user, token, isAuthenticated: true });
        },
        
        logout: () => {
          // Clear token from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          set(initialState);
        },
        
        updateUser: (userData) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          })),
      }),
      {
        name: 'auth-store',
      }
    )
  )
);


