import { create } from "zustand";
import type { User } from "@/types";
import pb from "@/lib/pocketbase/client";
import * as authLib from "@/lib/pocketbase/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;

  init: () => Promise<void>;
  login: (identity: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

/**
 * Auth store dengan PocketBase.
 * Token & user tersimpan di localStorage otomatis (built-in PocketBase).
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  init: async () => {
    set({ isLoading: true });
    try {
      const user = await authLib.refreshAuth();
      set({ user, isInitialized: true });
    } catch {
      set({ user: null, isInitialized: true });
    } finally {
      set({ isLoading: false });
    }

    // Listen ke perubahan authStore (login/logout dari tempat lain)
    pb.authStore.onChange(() => {
      const currentUser = authLib.getCurrentUser();
      set({ user: currentUser });
    });
  },

  login: async (identity: string, password: string) => {
    set({ isLoading: true });
    try {
      const user = await authLib.login({ identity, password });
      set({ user });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    authLib.logout();
    set({ user: null });
  },

  refreshUser: async () => {
    try {
      const user = await authLib.refreshAuth();
      set({ user });
    } catch {
      set({ user: null });
    }
  },
}));