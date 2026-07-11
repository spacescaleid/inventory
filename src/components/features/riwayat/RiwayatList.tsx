"use client";

import type { Transaksi, TransactionItem } from "@/types";
import { formatLabelGrupTanggal } from "@/utils/date";
import { groupTransactionsByDate } from "@/lib/mock-data";
import { RiwayatCard } from "./RiwayatCard";

interface RiwayatListProps {
  transactions: (Transaksi & { items: TransactionItem[] })[];
  onItemClick?: (transaksi: Transaksi & { items: TransactionItem[] }) => void;
}

/**
 * List riwayat grouped by tanggal.
 * Header per tanggal: "Hari ini", "Kemarin", atau tanggal lengkap.
 */
export function RiwayatList({ transactions, onItemClick }: RiwayatListProps) {
  const grouped = groupTransactionsByDate(transactions);

  return (
    <div className="space-y-6">
      {grouped.map(({ date, items }) => (
        <section key={date}>
          {/* Section header */}
          <div className="mb-3 flex items-center gap-2 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
              {formatLabelGrupTanggal(date)}
            </h2>
            <div className="h-px flex-1 bg-[var(--color-neutral-200)]" />
            <span className="font-mono text-xs text-[var(--color-neutral-400)]">
              {items.length} transaksi
            </span>
          </div>

          {/* Cards */}
          <div className="space-y-2">
            {items.map((trx) => (
              <RiwayatCard
                key={trx.id}
                transaksi={trx}
                onClick={onItemClick}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}