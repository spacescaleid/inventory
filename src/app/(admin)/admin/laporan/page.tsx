"use client";

import { AlertTriangle, Package, TrendingUp, Users } from "lucide-react";
import { ExportButton } from "@/components/features/lainnya/ExportButton";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { useAdminStats } from "@/hooks/useDashboard";
import { useStokMenipis } from "@/hooks/useStok";
import { useTransactions } from "@/hooks/useTransaksi";
import { useSettingsStore } from "@/stores/settingsStore";
import { formatNumber } from "@/utils/format";

export default function AdminLaporanPage() {
  const threshold = useSettingsStore((s) => s.thresholdMenipis);
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: stokMenipis, isLoading: menipisLoading } =
    useStokMenipis(threshold);
  const { data: transactions } = useTransactions({ periode: "semua" });

  const isLoading = statsLoading || menipisLoading;

  const totalKeluar =
    transactions?.reduce(
      (sum, trx) =>
        sum +
        (trx.is_cancelled
          ? 0
          : trx.items.reduce((s, i) => s + i.jumlah, 0)),
      0
    ) ?? 0;

  const uniqueSiswa = new Set(
    transactions?.filter((t) => !t.is_cancelled).map((t) => t.nama_siswa) ?? []
  ).size;

  return (
    <>
      <TopAppBar title="Laporan" showBack />

      <div className="space-y-6 px-4 py-4">
        <p className="px-1 text-xs text-[var(--color-neutral-500)]">
          Ringkasan data stok dan pengambilan seragam
        </p>

        <section>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
            Ringkasan
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-xl bg-white shadow-sm"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={Package}
                label="Total Stok"
                value={stats?.totalStok ?? 0}
                unit="unit"
                color="primary"
              />
              <StatCard
                icon={TrendingUp}
                label="Total Keluar"
                value={totalKeluar}
                unit="unit"
                color="success"
              />
              <StatCard
                icon={Users}
                label="Siswa Terlayani"
                value={uniqueSiswa}
                unit="siswa"
                color="info"
              />
              <StatCard
                icon={AlertTriangle}
                label="Stok Menipis"
                value={stokMenipis?.length ?? 0}
                unit="jenis"
                color="warning"
              />
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
            Ekspor Data
          </h2>
          <ExportButton />
        </section>

        <div className="rounded-xl border border-dashed border-[var(--color-neutral-200)] p-4 text-center">
          <p className="text-xs text-[var(--color-neutral-500)]">
            🚧 Laporan lengkap per periode & grafik akan tersedia di update
            berikutnya
          </p>
        </div>
      </div>
    </>
  );
}

interface StatCardProps {
  icon: typeof Package;
  label: string;
  value: number;
  unit?: string;
  color: "primary" | "success" | "info" | "warning";
}

function StatCard({ icon: Icon, label, value, unit, color }: StatCardProps) {
  const colorMap = {
    primary: {
      bg: "bg-[var(--color-primary-100)]",
      icon: "text-[var(--color-primary-600)]",
    },
    success: {
      bg: "bg-[var(--color-success-100)]",
      icon: "text-[var(--color-success-600)]",
    },
    info: {
      bg: "bg-[var(--color-info-100)]",
      icon: "text-[var(--color-info-600)]",
    },
    warning: {
      bg: "bg-[var(--color-warning-100)]",
      icon: "text-[var(--color-warning-600)]",
    },
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[color].bg}`}
      >
        <Icon className={`h-5 w-5 ${colorMap[color].icon}`} />
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