import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Define the User shape strictly
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // Add other fields if your DB sends them (e.g., avatarUrl)
}

// 2. Define the Store's shape
interface UserStore {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      
      login: (userData) => set({ user: userData }),
      
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);