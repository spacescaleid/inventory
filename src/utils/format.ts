/**
 * Format angka dengan pemisah ribuan (format Indonesia)
 * @example formatNumber(1234) → "1.234"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Format harga dalam Rupiah
 * @example formatRupiah(85000) → "Rp 85.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Truncate teks dengan ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

/**
 * Kapitalisasi kata pertama
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Normalize input kelas (contoh: "7a" → "7A", "vii a" → "VII A")
 */
export function normalizeKelas(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, " ");
}

/**
 * Normalize nama (Title Case)
 */
export function normalizeNama(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}