"use client";

import { MoreVertical, Plus } from "lucide-react";
import type { JenisSeragam, StockItem } from "@/types";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/format";
import { UkuranChip } from "./UkuranChip";

interface StokCardProps {
  jenis: JenisSeragam;
  items: StockItem[];
  threshold?: number;
  onAddStok?: (jenis: JenisSeragam) => void;
  onItemClick?: (item: StockItem) => void;
  onMenuClick?: (jenis: JenisSeragam) => void;
}

/**
 * Card untuk satu jenis seragam.
 * Menampilkan grid ukuran + total stok + action.
 */
export function StokCard({
  jenis,
  items,
  threshold = 5,
  onAddStok,
  onItemClick,
  onMenuClick,
}: StokCardProps) {
  const totalStok = items.reduce((sum, item) => sum + item.stok, 0);
  const jumlahUkuran = items.length;

  return (
    <div className="rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-neutral-100)] px-4 py-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-[var(--color-neutral-800)]">
            {jenis.nama}
          </h3>
          <p className="mt-0.5 text-xs text-[var(--color-neutral-500)]">
            {jumlahUkuran} ukuran
          </p>
        </div>

        {onMenuClick && (
          <button
            type="button"
            onClick={() => onMenuClick(jenis)}
            aria-label={`Menu untuk ${jenis.nama}`}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-neutral-400)] transition-colors hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-600)]"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Grid ukuran — horizontal scroll di mobile */}
      <div className="px-4 py-3">
        <div
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((item) => (
            <UkuranChip
              key={item.id}
              item={item}
              threshold={threshold}
              onClick={onItemClick}
            />
          ))}

          {/* Tombol tambah ukuran baru */}
          {onAddStok && (
            <button
              type="button"
              onClick={() => onAddStok(jenis)}
              className="flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[var(--color-neutral-300)] p-2 text-[var(--color-neutral-500)] transition-all hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-600)] active:scale-[0.97]"
              aria-label={`Tambah ukuran untuk ${jenis.nama}`}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              <span className="text-[10px] font-medium">Tambah</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer — total & action */}
      <div className="flex items-center justify-between border-t border-[var(--color-neutral-100)] px-4 py-3">
        <p className="text-xs text-[var(--color-neutral-500)]">
          Total{" "}
          <span className="ml-0.5 font-mono font-semibold text-[var(--color-neutral-800)]">
            {formatNumber(totalStok)}
          </span>{" "}
          unit
        </p>

        {onAddStok && (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => onAddStok(jenis)}
            className="text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)]"
          >
            <Plus className="h-3 w-3" />
            Stok
          </Button>
        )}
      </div>
    </div>
  );
}