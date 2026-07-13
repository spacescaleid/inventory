import { ClientResponseError } from "pocketbase";

/**
 * Parse PocketBase error jadi user-friendly message.
 */
export function parsePocketBaseError(error: unknown): string {
  if (error instanceof ClientResponseError) {
    // Cek data.data error (validation errors per field)
    const data = error.data?.data;
    if (data && typeof data === "object" && Object.keys(data).length > 0) {
      const errors: string[] = [];

      for (const [field, err] of Object.entries(data)) {
        if (err && typeof err === "object" && "message" in err) {
          const errObj = err as { code?: string; message: string };

          // Map common PocketBase error codes ke Indonesian
          let msg = errObj.message;

          if (errObj.code === "validation_not_unique") {
            msg = `${field} sudah ada, gunakan nilai lain`;
          } else if (errObj.code === "validation_required") {
            msg = `${field} wajib diisi`;
          } else if (errObj.code === "validation_length_out_of_range") {
            msg = `${field} panjangnya tidak sesuai`;
          } else if (errObj.code === "validation_invalid_email") {
            msg = `${field} bukan format email yang valid`;
          } else if (errObj.code === "validation_min_number") {
            msg = `${field} kurang dari minimum`;
          } else if (errObj.code === "validation_max_number") {
            msg = `${field} melebihi maksimum`;
          }

          errors.push(msg);
        }
      }

      if (errors.length > 0) {
        return errors.join(", ");
      }
    }

    // Fallback ke message dari error
    if (error.response?.message) return error.response.message;
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
  requestKey: null,
};