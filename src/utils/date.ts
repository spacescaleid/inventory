import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format tanggal lengkap: "Selasa, 15 Januari 2025"
 */
export function formatTanggalLengkap(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEEE, d MMMM yyyy", { locale: id });
}

/**
 * Format tanggal pendek: "15 Jan 2025"
 */
export function formatTanggalPendek(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "d MMM yyyy", { locale: id });
}

/**
 * Format waktu: "10:32 WIB"
 */
export function formatWaktu(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "HH:mm") + " WIB";
}

/**
 * Format tanggal + waktu: "15 Jan 2025 · 10:32 WIB"
 */
export function formatTanggalWaktu(date: string | Date): string {
  return `${formatTanggalPendek(date)} · ${formatWaktu(date)}`;
}

/**
 * Format relatif: "2 jam lalu", "Kemarin", "3 hari lalu"
 */
export function formatRelatif(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;

  if (isToday(d)) {
    return formatDistanceToNow(d, { addSuffix: true, locale: id });
  }

  if (isYesterday(d)) {
    return "Kemarin";
  }

  return formatDistanceToNow(d, { addSuffix: true, locale: id });
}

/**
 * Format label grup tanggal untuk riwayat
 * "Hari ini", "Kemarin", atau tanggal lengkap
 */
export function formatLabelGrupTanggal(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;

  if (isToday(d)) return "Hari ini";
  if (isYesterday(d)) return "Kemarin";
  return formatTanggalLengkap(d);
}

/**
 * Greeting berdasarkan waktu
 */
export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 4 && hour < 11) return "Selamat pagi";
  if (hour >= 11 && hour < 15) return "Selamat siang";
  if (hour >= 15 && hour < 18) return "Selamat sore";
  return "Selamat malam";
}