"use client";

import { Ban, ChevronRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import type { Transaksi, TransactionItem } from "@/types";
import { formatWaktu } from "@/utils/date";
import { cn } from "@/utils/cn";

interface RiwayatCardProps {
  transaksi: Transaksi & { items: TransactionItem[] };
  onClick?: (transaksi: Transaksi & { items: TransactionItem[] }) => void;
}

export function RiwayatCard({ transaksi, onClick }: RiwayatCardProps) {
  const totalItems = transaksi.items.reduce(
    (sum, item) => sum + item.jumlah,
    0
  );

  const itemPreview = transaksi.items
    .slice(0, 2)
    .map((item) => {
      const nama = item.expand?.stock_item?.expand?.uniform_type?.nama;
      const ukuran = item.expand?.stock_item?.ukuran;
      return nama ? `${nama} (${ukuran})` : "";
    })
    .filter(Boolean)
    .join(", ");

  const moreCount = transaksi.items.length - 2;

  // Client-only untuk waktu
  const [mounted, setMounted] = useState(false);
  const [displayTime, setDisplayTime] = useState("");

  useEffect(() => {
    setMounted(true);
    setDisplayTime(formatWaktu(transaksi.created));
  }, [transaksi.created]);

  return (
    <button
      type="button"
      onClick={() => onClick?.(transaksi)}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-xl bg-white p-3 text-left shadow-sm transition-all",
        "hover:shadow-md active:scale-[0.99]",
        transaksi.is_cancelled && "opacity-60"
      )}
    >
      {transaksi.is_cancelled && (
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-danger-100)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-danger-700)]">
            <Ban className="h-3 w-3" />
            Dibatalkan
          </span>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "truncate text-sm font-medium text-[var(--color-neutral-800)]",
              transaksi.is_cancelled && "line-through"
            )}
          >
            {transaksi.nama_siswa}
          </p>
          <span
            className="flex-shrink-0 rounded-full bg-[var(--color-neutral-100)] px-2 py-0.5 font-mono text-xs text-[var(--color-neutral-600)]"
            aria-label={`Kelas ${transaksi.kelas}`}
          >
            {transaksi.kelas}
          </span>
        </div>

        <p className="mt-1 truncate text-xs text-[var(--color-neutral-500)]">
          <span className="font-medium text-[var(--color-neutral-600)]">
            {totalItems} item
          </span>
          {itemPreview && (
            <>
              {" · "}
              <span className="text-[var(--color-neutral-400)]">
                {itemPreview}
                {moreCount > 0 && ` +${moreCount} lainnya`}
              </span>
            </>
          )}
        </p>

        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[var(--color-neutral-400)]">
          <Clock className="h-3 w-3" />
          <span className="font-mono" suppressHydrationWarning>
            {mounted ? displayTime : "\u00A0\u00A0\u00A0\u00A0\u00A0"}
          </span>
          {transaksi.catatan && (
            <>
              <span className="mx-1">·</span>
              <span className="italic">Ada catatan</span>
            </>
          )}
        </div>
      </div>

      <ChevronRight
        className="h-4 w-4 flex-shrink-0 text-[var(--color-neutral-300)] transition-colors group-hover:text-[var(--color-neutral-500)]"
        aria-hidden="true"
      />
    </button>
  );
}