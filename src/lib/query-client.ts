import { QueryClient } from "@tanstack/react-query";

/**
 * Konfigurasi TanStack Query untuk aplikasi.
 *
 * Defaults yang dipilih:
 * - staleTime 30 detik: data dianggap fresh selama 30s, tidak refetch otomatis
 * - retry 1x: hindari retry berlebihan yang bikin user menunggu
 * - refetchOnWindowFocus: nyalakan karena penting untuk sync stok real-time
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 detik
        gcTime: 5 * 60 * 1000, // 5 menit
        retry: 1,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0, // Mutasi tidak retry — user harus tahu jika gagal
      },
    },
  });
}