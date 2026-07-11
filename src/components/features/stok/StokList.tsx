"use client";

import type { JenisSeragam, StockItem, StokGrouped } from "@/types";
import { StokCard } from "./StokCard";

interface StokListProps {
  grouped: StokGrouped[];
  threshold?: number;
  onAddStok?: (jenis: JenisSeragam) => void;
  onItemClick?: (item: StockItem) => void;
  onMenuClick?: (jenis: JenisSeragam) => void;
}

/**
 * List stok grouped by kategori.
 * Setiap kategori punya section header, dalamnya list StokCard.
 */
export function StokList({
  grouped,
  threshold,
  onAddStok,
  onItemClick,
  onMenuClick,
}: StokListProps) {
  return (
    <div className="space-y-6">
      {grouped.map(({ kategori, jenisList }) => (
        <section key={kategori.id}>
          {/* Section header */}
          <div className="mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-[var(--color-neutral-200)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
              {kategori.nama}
            </h2>
            <div className="h-px flex-1 bg-[var(--color-neutral-200)]" />
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {jenisList.map(({ jenis, items }) => (
              <StokCard
                key={jenis.id}
                jenis={jenis}
                items={items}
                threshold={threshold}
                onAddStok={onAddStok}
                onItemClick={onItemClick}
                onMenuClick={onMenuClick}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}