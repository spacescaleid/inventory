import { QueryClient } from "@tanstack/react-query";

/**
 * Konfigurasi TanStack Query untuk aplikasi.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 detik — data dianggap fresh
        gcTime: 5 * 60 * 1000, // 5 menit — cache dihapus setelah tidak dipakai
        retry: (failureCount, error) => {
          // Jangan retry auth errors
          if (
            typeof error === "object" &&
            error !== null &&
            "status" in error
          ) {
            const status = (error as { status: number }).status;
            if (status === 401 || status === 403 || status === 404) {
              return false;
            }
          }
          return failureCount < 2;
        },
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0, // Mutasi tidak retry
      },
    },
  });
}