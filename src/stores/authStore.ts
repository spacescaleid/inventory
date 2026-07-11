import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { getMockUserByCredentials, getMockUserById } from "@/lib/mock-users";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;

  init: () => Promise<void>;
  login: (identity: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

/**
 * Auth store dengan persist ke localStorage.
 * TODO: nanti diganti dengan PocketBase authStore.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isInitialized: false,

      init: async () => {
        set({ isLoading: true });

        // Restore user dari localStorage (sudah otomatis via persist)
        const currentUser = get().user;

        if (currentUser) {
          // Validasi user masih ada & aktif (untuk MVP mock)
          const fresh = getMockUserById(currentUser.id);
          if (fresh && fresh.is_active) {
            set({ user: fresh });
          } else {
            set({ user: null });
          }
        }

        set({ isInitialized: true, isLoading: false });
      },

      login: async (identity: string, password: string) => {
        set({ isLoading: true });

        try {
          // Simulasi API delay
          await new Promise((r) => setTimeout(r, 600));

          const user = getMockUserByCredentials(identity, password);

          if (!user) {
            throw new Error(
              "Email/username atau password salah, atau akun tidak aktif"
            );
          }

          set({ user });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ user: null });
      },

      refreshUser: () => {
        const currentUser = get().user;
        if (!currentUser) return;
        const fresh = getMockUserById(currentUser.id);
        if (fresh) set({ user: fresh });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user }),
    }
  )
);