"use client";

import type { StockItem } from "@/types";
import { formatNumber } from "@/utils/format";
import { getStokStatus, getStokStatusColor } from "@/utils/stok";
import { cn } from "@/utils/cn";

interface UkuranChipProps {
  item: StockItem;
  threshold?: number;
  onClick?: (item: StockItem) => void;
  isSelected?: boolean;
}

/**
 * Chip yang menampilkan ukuran + jumlah stok.
 * Warna background berubah sesuai status stok.
 */
export function UkuranChip({
  item,
  threshold = 5,
  onClick,
  isSelected = false,
}: UkuranChipProps) {
  const status = getStokStatus(item.stok, threshold);
  const colors = getStokStatusColor(status);

  const isClickable = !!onClick;

  const content = (
    <>
      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
        {item.ukuran}
      </span>
      <span className="font-mono text-lg font-semibold leading-none">
        {status === "habis" ? "0" : formatNumber(item.stok)}
      </span>
    </>
  );

  const commonClasses = cn(
    "flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-lg border p-2 transition-all",
    colors.bg,
    colors.text,
    "border-transparent",
    isSelected && "ring-2 ring-[var(--color-primary-500)] ring-offset-1",
    isClickable && "hover:brightness-95 active:scale-[0.97] cursor-pointer"
  );

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={() => onClick(item)}
        className={commonClasses}
        aria-label={`${item.ukuran}: ${item.stok} unit`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={commonClasses}
      role="status"
      aria-label={`${item.ukuran}: ${item.stok} unit`}
    >
      {content}
    </div>
  );
}