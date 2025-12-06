/**
 * Example Zustand Store
 * Template for creating new stores
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ExampleState {
  count: number;
  user: { name: string; email: string } | null;
}

interface ExampleActions {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setUser: (user: ExampleState['user']) => void;
  clearUser: () => void;
}

type ExampleStore = ExampleState & ExampleActions;

const initialState: ExampleState = {
  count: 0,
  user: null,
};

/**
 * Example store with devtools and persist middleware
 * Remove persist if you don't want to persist state
 */
export const useExampleStore = create<ExampleStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        reset: () => set({ count: 0 }),
        
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
      }),
      {
        name: 'example-store', // unique name for localStorage key
      }
    )
  )
);


