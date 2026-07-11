"use client";

import { ChevronRight, Clock, Inbox } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListItemSkeleton } from "@/components/shared/LoadingSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { ROUTES } from "@/constants/routes";
import type { Transaksi, TransactionItem } from "@/types";
import { formatWaktu, formatRelatif } from "@/utils/date";
import { cn } from "@/utils/cn";

interface AktivitasTerakhirProps {
  items?: (Transaksi & { items: TransactionItem[] })[];
  isLoading?: boolean;
}

export function AktivitasTerakhir({
  items,
  isLoading,
}: AktivitasTerakhirProps) {
  return (
    <section>
      <PageHeader
        title="📋 Aktivitas Terakhir"
        description="Pengambilan seragam hari ini"
        action={
          items && items.length > 0 ? (
            <Link
              href={ROUTES.RIWAYAT}
              className="flex items-center gap-0.5 text-xs font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
            >
              Lihat semua
              <ChevronRight className="h-3 w-3" />
            </Link>
          ) : undefined
        }
      />

      <div className="mt-3 space-y-2">
        {isLoading ? (
          <>
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
          </>
        ) : items && items.length > 0 ? (
          items
            .slice(0, 5)
            .map((trx) => <AktivitasItem key={trx.id} transaksi={trx} />)
        ) : (
          <div className="rounded-xl bg-white shadow-sm">
            <EmptyState
              icon={Inbox}
              title="Belum ada aktivitas"
              description="Pengambilan seragam akan tampil di sini"
              compact
            />
          </div>
        )}
      </div>
    </section>
  );
}

function AktivitasItem({
  transaksi,
}: {
  transaksi: Transaksi & { items: TransactionItem[] };
}) {
  const totalItems = transaksi.items.reduce(
    (sum, item) => sum + item.jumlah,
    0
  );

  // Client-only untuk formatting waktu (hindari hydration mismatch)
  const [mounted, setMounted] = useState(false);
  const [displayTime, setDisplayTime] = useState("");

  useEffect(() => {
    setMounted(true);
    const isToday =
      new Date(transaksi.created).toDateString() ===
      new Date().toDateString();
    setDisplayTime(
      isToday ? formatWaktu(transaksi.created) : formatRelatif(transaksi.created)
    );
  }, [transaksi.created]);

  return (
    <Link
      href={ROUTES.RIWAYAT_DETAIL(transaksi.id)}
      className={cn(
        "block rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.99]",
        transaksi.is_cancelled && "opacity-60"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-[var(--color-neutral-800)]">
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
            {totalItems} item
            {transaksi.items.length > 0 && (
              <span className="text-[var(--color-neutral-400)]">
                {" · "}
                {transaksi.items
                  .slice(0, 2)
                  .map((item) => {
                    const nama =
                      item.expand?.stock_item?.expand?.uniform_type?.nama;
                    const ukuran = item.expand?.stock_item?.ukuran;
                    return nama ? `${nama} (${ukuran})` : "";
                  })
                  .filter(Boolean)
                  .join(", ")}
                {transaksi.items.length > 2 &&
                  ` +${transaksi.items.length - 2} lainnya`}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1 text-xs text-[var(--color-neutral-400)]">
          <Clock className="h-3 w-3" />
          <span className="font-mono" suppressHydrationWarning>
            {mounted ? displayTime : "\u00A0\u00A0\u00A0\u00A0\u00A0"}
          </span>
        </div>
      </div>
    </Link>
  );
}