"use client";

import { Package, Users } from "lucide-react";
import { SummaryCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { formatNumber } from "@/utils/format";
import { cn } from "@/utils/cn";

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
  iconBg: string;
  iconColor: string;
}

function SummaryCard({
  icon,
  label,
  value,
  unit,
  iconBg,
  iconColor,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          iconBg
        )}
      >
        <div className={iconColor}>{icon}</div>
      </div>

      <p className="mt-3 text-xs font-medium text-[var(--color-neutral-500)]">
        {label}
      </p>

      <p className="mt-1 font-mono text-2xl font-semibold text-[var(--color-neutral-800)]">
        {formatNumber(value)}
      </p>

      {unit && (
        <p className="mt-0.5 text-xs text-[var(--color-neutral-400)]">{unit}</p>
      )}
    </div>
  );
}

interface SummaryCardsProps {
  data?: {
    totalItems: number;
    totalSiswaHariIni: number;
  };
  isLoading?: boolean;
}

export function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <SummaryCard
        icon={<Package className="h-5 w-5" />}
        label="Total Item"
        value={data.totalItems}
        unit="unit tersisa"
        iconBg="bg-[var(--color-primary-100)]"
        iconColor="text-[var(--color-primary-600)]"
      />

      <SummaryCard
        icon={<Users className="h-5 w-5" />}
        label="Hari Ini"
        value={data.totalSiswaHariIni}
        unit="siswa mengambil"
        iconBg="bg-[var(--color-success-100)]"
        iconColor="text-[var(--color-success-600)]"
      />
    </div>
  );
}