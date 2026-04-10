import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'super_admin' | 'support';
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => {
        const state = get();
        if (!state.token || !state.user) return false;
        return ['admin', 'super_admin', 'support'].includes(state.user.role);
      },
    }),
    {
      name: 'sport-hub-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
