// Query keys untuk TanStack Query
// Menggunakan factory pattern untuk konsistensi

export const queryKeys = {
  all: ["inventory"] as const,

  auth: {
    all: () => [...queryKeys.all, "auth"] as const,
    user: () => [...queryKeys.auth.all(), "user"] as const,
  },

  kategori: {
    all: () => [...queryKeys.all, "kategori"] as const,
    list: () => [...queryKeys.kategori.all(), "list"] as const,
    detail: (id: string) => [...queryKeys.kategori.all(), "detail", id] as const,
  },

  jenis: {
    all: () => [...queryKeys.all, "jenis"] as const,
    list: (kategoriId?: string) =>
      [...queryKeys.jenis.all(), "list", { kategoriId }] as const,
    detail: (id: string) => [...queryKeys.jenis.all(), "detail", id] as const,
  },

  stok: {
    all: () => [...queryKeys.all, "stok"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.stok.all(), "list", filters] as const,
    detail: (id: string) => [...queryKeys.stok.all(), "detail", id] as const,
    grouped: () => [...queryKeys.stok.all(), "grouped"] as const,
    menipis: () => [...queryKeys.stok.all(), "menipis"] as const,
  },

  transaksi: {
    all: () => [...queryKeys.all, "transaksi"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.transaksi.all(), "list", filters] as const,
    detail: (id: string) => [...queryKeys.transaksi.all(), "detail", id] as const,
    terakhir: () => [...queryKeys.transaksi.all(), "terakhir"] as const,
    stats: () => [...queryKeys.transaksi.all(), "stats"] as const,
  },

  kelas: {
    all: () => [...queryKeys.all, "kelas"] as const,
    list: () => [...queryKeys.kelas.all(), "list"] as const,
  },
} as const;