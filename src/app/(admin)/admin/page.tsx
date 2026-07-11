"use client";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Database,
  Eye,
  GraduationCap,
  Layers,
  Package,
  Settings,
  Shield,
  Shirt,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { mockUsers } from "@/lib/mock-users";
import {
  getMockStats,
  getMockStokMenipis,
  mockJenis,
  mockKategoris,
  mockTransactions,
} from "@/lib/mock-data";
import { useSettingsStore } from "@/stores/settingsStore";
import { formatNumber } from "@/utils/format";
import { getGreeting } from "@/utils/date";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const { user } = useAuth({ required: true, requireAdmin: true });
  const namaSekolah = useSettingsStore((s) => s.namaSekolah);
  const tahunAjaran = useSettingsStore((s) => s.tahunAjaran);

  // Stats
  const stats = getMockStats();
  const stokMenipis = getMockStokMenipis();
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter((u) => u.is_active).length;
  const totalTransactions = mockTransactions.filter((t) => !t.is_cancelled).length;

  // Greeting client-only untuk hindari hydration
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Selamat datang");

  useEffect(() => {
    setMounted(true);
    setGreeting(getGreeting());
  }, []);

  if (!user) return null;

  return (
    <>
      <TopAppBar
        centerSlot={
          <div>
            <p className="text-base font-semibold text-[var(--color-neutral-800)]">
              Dashboard Admin
            </p>
            <p className="truncate text-xs text-[var(--color-neutral-500)]">
              {mounted ? greeting : "\u00A0"}, {user.name}
            </p>
          </div>
        }
        rightSlot={
          <Button
            size="sm"
            variant="ghost"
            render={<Link href={`${ROUTES.BERANDA}?as=operator`} />}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Mode Operator</span>
          </Button>
        }
      />

      <div className="space-y-6 px-4 py-4">
        {/* Info sekolah */}
        <div className="rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] via-[var(--color-primary-600)] to-[var(--color-primary-700)] p-5 text-white shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                Sekolah
              </p>
              <h1 className="mt-1 truncate text-lg font-bold">
                {namaSekolah}
              </h1>
              <p className="text-xs text-white/80">
                Tahun Ajaran {tahunAjaran}
              </p>
            </div>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Shield className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Stats overview */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
            Ringkasan Sistem
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Users}
              label="Total User"
              value={totalUsers}
              detail={`${activeUsers} aktif`}
              color="primary"
              href={ROUTES.ADMIN_USERS}
            />
            <StatCard
              icon={Package}
              label="Total Stok"
              value={stats.totalItems}
              detail="unit"
              color="info"
              href={ROUTES.ADMIN_LAPORAN}
            />
            <StatCard
              icon={Activity}
              label="Transaksi"
              value={totalTransactions}
              detail="total"
              color="success"
              href={ROUTES.ADMIN_LAPORAN}
            />
            <StatCard
              icon={Layers}
              label="Kategori"
              value={mockKategoris.length}
              detail={`${mockJenis.length} jenis`}
              color="warning"
              href={ROUTES.ADMIN_KATEGORI}
            />
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
            Aksi Cepat
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <QuickAction
              icon={UserPlus}
              label="Tambah User"
              href={ROUTES.ADMIN_USERS}
              color="primary"
            />
            <QuickAction
              icon={Database}
              label="Kelola Data"
              href={ROUTES.ADMIN_KATEGORI}
              color="info"
            />
            <QuickAction
              icon={BarChart3}
              label="Lihat Laporan"
              href={ROUTES.ADMIN_LAPORAN}
              color="warning"
            />
            <QuickAction
              icon={Settings}
              label="Pengaturan"
              href={ROUTES.ADMIN_PENGATURAN}
              color="neutral"
            />
          </div>
        </section>

        {/* Alerts */}
        {stokMenipis.length > 0 && (
          <section>
            <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
              ⚠️ Perlu Perhatian
            </h2>

            <Link
              href={`${ROUTES.BERANDA}?as=operator`}
              className="flex items-center gap-3 rounded-xl bg-[var(--color-warning-50)] p-4 shadow-sm transition-all hover:bg-[var(--color-warning-100)]"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-warning-200)]">
                <Package className="h-5 w-5 text-[var(--color-warning-700)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--color-warning-800)]">
                  {stokMenipis.length} jenis seragam stok menipis
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-warning-700)]">
                  Perlu segera ditambahkan
                </p>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-[var(--color-warning-600)]" />
            </Link>
          </section>
        )}

        {/* Manajemen data master */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
            Data Master
          </h2>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <MasterDataRow
              icon={Layers}
              label="Kategori Seragam"
              count={mockKategoris.length}
              href={ROUTES.ADMIN_KATEGORI}
            />
            <MasterDataRow
              icon={Shirt}
              label="Jenis Seragam"
              count={mockJenis.length}
              href={ROUTES.ADMIN_JENIS}
              divider
            />
            <MasterDataRow
              icon={GraduationCap}
              label="Kelas"
              count={4}
              href={ROUTES.ADMIN_KELAS}
              divider
            />
          </div>
        </section>

        <div className="pt-4 text-center">
          <p className="text-xs text-[var(--color-neutral-400)]">
            Versi 1.0.0 · Admin Panel
          </p>
        </div>
      </div>
    </>
  );
}

// ============================================
// Sub Components
// ============================================

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  detail?: string;
  color: "primary" | "info" | "success" | "warning";
  href?: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  color,
  href,
}: StatCardProps) {
  const colorMap = {
    primary: {
      bg: "bg-[var(--color-primary-100)]",
      icon: "text-[var(--color-primary-600)]",
    },
    info: {
      bg: "bg-[var(--color-info-100)]",
      icon: "text-[var(--color-info-600)]",
    },
    success: {
      bg: "bg-[var(--color-success-100)]",
      icon: "text-[var(--color-success-600)]",
    },
    warning: {
      bg: "bg-[var(--color-warning-100)]",
      icon: "text-[var(--color-warning-600)]",
    },
  };

  const content = (
    <>
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          colorMap[color].bg
        )}
      >
        <Icon className={cn("h-5 w-5", colorMap[color].icon)} />
      </div>
      <p className="mt-3 text-xs font-medium text-[var(--color-neutral-500)]">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-semibold text-[var(--color-neutral-800)]">
        {formatNumber(value)}
      </p>
      {detail && (
        <p className="mt-0.5 text-xs text-[var(--color-neutral-400)]">
          {detail}
        </p>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
      >
        {content}
      </Link>
    );
  }

  return <div className="rounded-xl bg-white p-4 shadow-sm">{content}</div>;
}

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  href: string;
  color: "primary" | "info" | "warning" | "neutral";
}

function QuickAction({ icon: Icon, label, href, color }: QuickActionProps) {
  const colorMap = {
    primary: "bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]",
    info: "bg-[var(--color-info-500)] hover:bg-[var(--color-info-600)]",
    warning: "bg-[var(--color-warning-500)] hover:bg-[var(--color-warning-600)]",
    neutral:
      "bg-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-800)]",
  };

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-white shadow-sm transition-all active:scale-[0.98]",
        colorMap[color]
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs font-semibold">{label}</span>
    </Link>
  );
}

interface MasterDataRowProps {
  icon: LucideIcon;
  label: string;
  count: number;
  href: string;
  divider?: boolean;
}

function MasterDataRow({
  icon: Icon,
  label,
  count,
  href,
  divider,
}: MasterDataRowProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--color-neutral-50)]",
        divider && "border-t border-[var(--color-neutral-100)]"
      )}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-neutral-100)]">
        <Icon className="h-5 w-5 text-[var(--color-neutral-600)]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--color-neutral-800)]">
          {label}
        </p>
        <p className="mt-0.5 font-mono text-xs text-[var(--color-neutral-500)]">
          {count} item
        </p>
      </div>
      <ArrowRight className="h-4 w-4 flex-shrink-0 text-[var(--color-neutral-300)]" />
    </Link>
  );
}