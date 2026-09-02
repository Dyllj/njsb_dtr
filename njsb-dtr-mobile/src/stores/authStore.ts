import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

import { loginIntern, type InternProfile } from '@/services/internService';

/**
 * A StateStorage adapter backed by expo-secure-store, compatible with
 * zustand's createJSONStorage.
 */
const secureStorage = {
  getItem: (name: string): Promise<string | null> => {
    return SecureStore.getItemAsync(name);
  },
  setItem: (name: string, value: string): Promise<void> => {
    return SecureStore.setItemAsync(name, value);
  },
  removeItem: (name: string): Promise<void> => {
    return SecureStore.deleteItemAsync(name);
  },
};

export interface AuthState {
  intern: InternProfile | null;
  hasHydrated: boolean;
  isLoading: boolean;
  login: (internId: string, password: string) => Promise<InternProfile>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      intern: null,
      hasHydrated: false,
      isLoading: false,

      login: async (internId: string, password: string) => {
        set({ isLoading: true });
        try {
          const intern = await loginIntern(internId.trim(), password);
          set({ intern });
          return intern;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ intern: null });
      },
    }),
    {
      name: 'njsb-auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ intern: state.intern }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true });
      },
    }
  )
);

export function useAuth() {
  const intern = useAuthStore((s) => s.intern);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  return {
    intern,
    isAuthenticated: !!intern,
    isLoading,
    hasHydrated,
    login,
    logout,
  };
}
