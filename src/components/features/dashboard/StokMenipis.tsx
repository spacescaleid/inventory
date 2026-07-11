"use client";

import { AlertTriangle, ChevronRight, PackageCheck } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListItemSkeleton } from "@/components/shared/LoadingSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ROUTES } from "@/constants/routes";
import type { StockItem } from "@/types";
import { getStokStatus } from "@/utils/stok";
import { cn } from "@/utils/cn";

interface StokMenipisProps {
  items?: StockItem[];
  isLoading?: boolean;
  threshold?: number;
}

export function StokMenipis({
  items,
  isLoading,
  threshold = 5,
}: StokMenipisProps) {
  return (
    <section>
      <PageHeader
        title="⚠️ Stok Menipis"
        description="Perlu segera ditambahkan"
        action={
          items && items.length > 0 ? (
            <Link
              href={ROUTES.STOK}
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
          items.slice(0, 3).map((item) => (
            <StokMenipisItem key={item.id} item={item} threshold={threshold} />
          ))
        ) : (
          <div className="rounded-xl bg-white shadow-sm">
            <EmptyState
              icon={PackageCheck}
              title="Semua stok masih aman"
              description="Tidak ada seragam yang perlu ditambahkan"
              compact
            />
          </div>
        )}
      </div>
    </section>
  );
}

function StokMenipisItem({
  item,
  threshold,
}: {
  item: StockItem;
  threshold: number;
}) {
  const status = getStokStatus(item.stok, threshold);
  const jenisNama = item.expand?.uniform_type?.nama || "Seragam";
  const kategoriNama = item.expand?.uniform_type?.expand?.category?.nama || "";

  const statusIconColor: Record<string, string> = {
    tipis: "text-[var(--color-warning-500)]",
    kritis: "text-[var(--color-danger-500)]",
    habis: "text-[var(--color-danger-600)]",
    defisit: "text-[var(--color-danger-700)]",
    aman: "text-[var(--color-success-500)]",
  };

  return (
    <Link
      href={ROUTES.STOK_DETAIL(item.id)}
      className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-warning-50)]">
        <AlertTriangle
          className={cn("h-5 w-5", statusIconColor[status])}
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--color-neutral-800)]">
          {jenisNama}{" "}
          <span className="font-mono text-[var(--color-neutral-500)]">
            ({item.ukuran})
          </span>
        </p>
        {kategoriNama && (
          <p className="truncate text-xs text-[var(--color-neutral-500)]">
            {kategoriNama}
          </p>
        )}
      </div>

      <StatusBadge status={status} count={item.stok} showLabel={false} />
    </Link>
  );
}