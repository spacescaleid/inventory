import type { StokStatus } from "@/types";
import { DEFAULT_MENIPIS_THRESHOLD, STOK_THRESHOLD } from "@/constants/stok";

/**
 * Tentukan status stok berdasarkan jumlah
 */
export function getStokStatus(
  stok: number,
  threshold: number = DEFAULT_MENIPIS_THRESHOLD
): StokStatus {
  if (stok < 0) return "defisit";
  if (stok === 0) return "habis";
  if (stok <= STOK_THRESHOLD.KRITIS) return "kritis";
  if (stok <= threshold) return "tipis";
  return "aman";
}

/**
 * Label bahasa Indonesia untuk status stok
 */
export function getStokStatusLabel(status: StokStatus): string {
  const labels: Record<StokStatus, string> = {
    aman: "Aman",
    tipis: "Menipis",
    kritis: "Kritis",
    habis: "Habis",
    defisit: "Defisit",
  };
  return labels[status];
}

/**
 * Class Tailwind untuk warna status stok
 */
export function getStokStatusColor(status: StokStatus): {
  bg: string;
  text: string;
  border: string;
} {
  const colors: Record<StokStatus, { bg: string; text: string; border: string }> =
    {
      aman: {
        bg: "bg-[var(--color-success-100)]",
        text: "text-[var(--color-success-700)]",
        border: "border-[var(--color-success-500)]",
      },
      tipis: {
        bg: "bg-[var(--color-warning-100)]",
        text: "text-[var(--color-warning-700)]",
        border: "border-[var(--color-warning-500)]",
      },
      kritis: {
        bg: "bg-[var(--color-danger-100)]",
        text: "text-[var(--color-danger-600)]",
        border: "border-[var(--color-danger-500)]",
      },
      habis: {
        bg: "bg-[var(--color-danger-100)]",
        text: "text-[var(--color-danger-700)]",
        border: "border-[var(--color-danger-600)]",
      },
      defisit: {
        bg: "bg-[var(--color-danger-50)]",
        text: "text-[var(--color-danger-700)]",
        border: "border-[var(--color-danger-600)]",
      },
    };
  return colors[status];
}

/**
 * Icon untuk status stok
 */
export function getStokStatusIcon(status: StokStatus): string {
  const icons: Record<StokStatus, string> = {
    aman: "●",
    tipis: "⚠",
    kritis: "⚠",
    habis: "✗",
    defisit: "!",
  };
  return icons[status];
}