import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { Platform } from 'react-native';

import { loginIntern, type InternProfile } from '@/services/internService';

/**
 * Web-safe storage adapter that uses localStorage in the browser.
 * expo-secure-store does not support the web platform, so we fall back
 * to localStorage when running in a browser (Expo Router Web / SSR).
 */
const webStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return Promise.resolve(null);
    return Promise.resolve(window.localStorage.getItem(name));
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') return Promise.resolve();
    window.localStorage.setItem(name, value);
    return Promise.resolve();
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') return Promise.resolve();
    window.localStorage.removeItem(name);
    return Promise.resolve();
  },
};

/**
 * Native storage adapter backed by expo-secure-store. Only loaded on
 * native platforms — `expo-secure-store` is not supported on web and
 * its module is a no-op stub there, so we use a dynamic require.
 */
let nativeStorage: StateStorage | null = null;

async function getNativeStorage(): Promise<StateStorage> {
  if (nativeStorage) return nativeStorage;
  const SecureStore = await import('expo-secure-store');
  nativeStorage = {
    getItem: (name) => SecureStore.getItemAsync(name),
    setItem: (name, value) => SecureStore.setItemAsync(name, value),
    removeItem: (name) => SecureStore.deleteItemAsync(name),
  };
  return nativeStorage;
}

/**
 * Returns a StateStorage that works on every platform:
 * - Web (browser / SSR): localStorage
 * - Native (iOS / Android / Expo Go): expo-secure-store
 */
function createPlatformStorage(): StateStorage {
  if (Platform.OS === 'web') {
    return webStorage;
  }
  // On native, return a proxy that lazily resolves expo-secure-store on
  // first use. zustand's persist middleware awaits getItem/setItem/removeItem
  // calls, so returning a Promise is safe.
  return {
    getItem: async (name) => {
      const storage = await getNativeStorage();
      return storage.getItem(name);
    },
    setItem: async (name, value) => {
      const storage = await getNativeStorage();
      return storage.setItem(name, value);
    },
    removeItem: async (name) => {
      const storage = await getNativeStorage();
      return storage.removeItem(name);
    },
  };
}

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
      storage: createJSONStorage(() => createPlatformStorage()),
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
