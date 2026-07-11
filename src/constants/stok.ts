// Threshold stok berdasarkan design.md section 1.5
export const STOK_THRESHOLD = {
  AMAN: 10,
  TIPIS: 5,
  KRITIS: 3,
} as const;

// Default threshold "menipis" (bisa dikonfigurasi di Settings)
export const DEFAULT_MENIPIS_THRESHOLD = 5;

// Batasan input
export const INPUT_LIMITS = {
  MAX_UKURAN_LENGTH: 20,
  MAX_NAMA_SISWA_LENGTH: 100,
  MAX_KELAS_LENGTH: 20,
  MAX_JUMLAH_PER_TRANSAKSI: 999,
  MAX_STOK: 99999,
} as const;

// Konfigurasi autocomplete
export const AUTOCOMPLETE = {
  MIN_CHARS: 1,
  MAX_SUGGESTIONS: 5,
  DEBOUNCE_MS: 150,
} as const;