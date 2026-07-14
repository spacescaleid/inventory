import { ClientResponseError } from "pocketbase";

/**
 * Parse PocketBase error jadi user-friendly message.
 */
export function parsePocketBaseError(error: unknown): string {
  // Handle custom error dari fetch manual
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data: unknown }).data === "object"
  ) {
    const errorData = (error as { data: { data?: Record<string, unknown> } }).data;
    if (errorData?.data && Object.keys(errorData.data).length > 0) {
      return formatFieldErrors(errorData.data as Record<string, unknown>);
    }

    // Fallback message
    if ("message" in errorData) {
      const msg = (errorData as { message: string }).message;
      if (msg) return msg;
    }
  }

  // Handle standard PocketBase SDK error
  if (error instanceof ClientResponseError) {
    const data = error.data?.data;
    if (data && typeof data === "object" && Object.keys(data).length > 0) {
      return formatFieldErrors(data);
    }

    const message = error.response?.message || error.message;

    if (message?.includes("required relation reference")) {
      return "Data ini masih terhubung dengan data lain (misal: transaksi, riwayat). Nonaktifkan saja untuk menyimpan history.";
    }

    if (message?.includes("Failed to delete")) {
      return "Gagal menghapus. Data mungkin masih dipakai di tempat lain.";
    }

    if (message) return message;

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
 * Format field-level errors ke bahasa Indonesia.
 */
function formatFieldErrors(data: Record<string, unknown>): string {
  const errors: string[] = [];

  for (const [field, err] of Object.entries(data)) {
    if (err && typeof err === "object" && "message" in err) {
      const errObj = err as { code?: string; message: string };

      let msg = errObj.message;
      const fieldName = translateFieldName(field);

      // Map error codes ke pesan bahasa Indonesia
      if (errObj.code === "validation_not_unique") {
        msg = `${fieldName} sudah dipakai, gunakan yang lain`;
      } else if (errObj.code === "validation_values_mismatch") {
        // Untuk field email/username, ini biasanya artinya "sudah dipakai"
        if (field === "email") {
          msg = `Email sudah dipakai user lain`;
        } else if (field === "username") {
          msg = `Username sudah dipakai user lain`;
        } else if (field === "password" || field === "passwordConfirm") {
          msg = `Password dan konfirmasi tidak sama`;
        } else {
          msg = `${fieldName} tidak valid`;
        }
      } else if (errObj.code === "validation_required") {
        msg = `${fieldName} wajib diisi`;
      } else if (errObj.code === "validation_length_out_of_range") {
        msg = `${fieldName} panjangnya tidak sesuai`;
      } else if (errObj.code === "validation_invalid_email") {
        msg = `${fieldName} bukan format email yang valid`;
      } else if (errObj.code === "validation_min_number") {
        msg = `${fieldName} kurang dari minimum`;
      } else if (errObj.code === "validation_max_number") {
        msg = `${fieldName} melebihi maksimum`;
      } else if (errObj.code === "validation_password_length") {
        msg = `Password terlalu pendek (min 8 karakter)`;
      }

      errors.push(msg);
    }
  }

  if (errors.length === 0) return "Data tidak valid";
  return errors.join(", ");
}

/**
 * Translate field name ke bahasa Indonesia
 */
function translateFieldName(field: string): string {
  const map: Record<string, string> = {
    name: "Nama",
    email: "Email",
    username: "Username",
    password: "Password",
    passwordConfirm: "Konfirmasi password",
    role: "Peran",
    is_active: "Status aktif",
    nama: "Nama",
    kelas: "Kelas",
    nis: "NIS",
    ukuran: "Ukuran",
    stok: "Stok",
    harga: "Harga",
    kategori: "Kategori",
    jenis: "Jenis",
    tahun_ajaran: "Tahun ajaran",
  };
  return map[field] || field;
}

/**
 * Check apakah error karena token expired / auth invalid.
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof ClientResponseError) {
    return error.status === 401 || error.status === 403;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error
  ) {
    const status = (error as { status: number }).status;
    return status === 401 || status === 403;
  }
  return false;
}

/**
 * Check apakah error karena relasi constraint.
 */
export function isRelationConstraintError(error: unknown): boolean {
  if (error instanceof ClientResponseError) {
    const message = error.response?.message || error.message || "";
    return message.includes("required relation reference");
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error
  ) {
    const err = error as { data: { message?: string } };
    return err.data?.message?.includes("required relation reference") ?? false;
  }
  return false;
}

/**
 * Default fetch options untuk PocketBase list queries.
 */
export const DEFAULT_LIST_OPTIONS = {
  requestKey: null,
};