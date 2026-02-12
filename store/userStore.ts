import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Strict User Interface
export interface User {
  id: number;           // Matches PostgreSQL 'SERIAL'
  full_name: string;    // Matches PostgreSQL column
  email: string;
  role: 'candidate' | 'employer' | 'admin' | 'creator'; 
  name?: string;        // Optional: specific for frontend compatibility
}

interface UserStore {
  user: User | null;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  login: (userData: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false, // Tracks if persisted data has loaded

      setHasHydrated: (state) => set({ hasHydrated: state }),

      login: (userData) => {
        // AUTOMATIC FIX: If DB returns 'full_name' but frontend expects 'name',
        // we map it here so you don't have to change every UI component.
        const normalizedUser = {
            ...userData,
            name: userData.name || userData.full_name
        };
        set({ user: normalizedUser });
      },

      logout: () => {
          set({ user: null });
          // Safe check before accessing window/localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user-storage');
          }
      },
    }),
    {
      name: 'user-storage', 
      storage: createJSONStorage(() => localStorage),
      // This ensures we know when the store has finished loading from local storage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);