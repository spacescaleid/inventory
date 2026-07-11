import { ClientResponseError } from "pocketbase";

/**
 * Parse PocketBase error jadi user-friendly message.
 */
export function parsePocketBaseError(error: unknown): string {
  if (error instanceof ClientResponseError) {
    // Cek data.data error (validation errors per field)
    const data = error.data?.data;
    if (data && typeof data === "object") {
      const firstError = Object.values(data)[0] as { message?: string } | undefined;
      if (firstError?.message) return firstError.message;
    }

    // Fallback ke message dari error
    if (error.message) return error.message;

    // Status code based
    switch (error.status) {
      case 400:
        return "Data yang dikirim tidak valid";
      case 401:
        return "Sesi kamu sudah berakhir. Silakan login ulang.";
      case 403:
        return "Kamu tidak memiliki akses untuk aksi ini";
      case 404:
        return "Data tidak ditemukan";
      case 500:
        return "Terjadi kesalahan server. Coba lagi nanti.";
      default:
        return "Terjadi kesalahan";
    }
  }

  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan tidak dikenal";
}

/**
 * Check apakah error karena token expired / auth invalid.
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof ClientResponseError) {
    return error.status === 401 || error.status === 403;
  }
  return false;
}

/**
 * Default fetch options untuk PocketBase list queries.
 */
export const DEFAULT_LIST_OPTIONS = {
  requestKey: null, // Disable auto-cancel per query
};