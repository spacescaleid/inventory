"use client";

import {
  ChevronRight,
  GraduationCap,
  Layers,
  Shirt,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

interface MenuItem {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export default function KelolaDataPage() {
  const items: MenuItem[] = [
    {
      label: "Kategori Seragam",
      description: "Kelompok utama seragam",
      href: ROUTES.KELOLA_KATEGORI,
      icon: Layers,
      iconBg: "bg-[var(--color-primary-100)]",
      iconColor: "text-[var(--color-primary-600)]",
    },
    {
      label: "Jenis Seragam",
      description: "Baju, Celana, Rok, Topi",
      href: ROUTES.KELOLA_JENIS,
      icon: Shirt,
      iconBg: "bg-[var(--color-info-100)]",
      iconColor: "text-[var(--color-info-600)]",
    },
    {
      label: "Kelas",
      description: "Daftar kelas di sekolah",
      href: ROUTES.KELOLA_KELAS,
      icon: GraduationCap,
      iconBg: "bg-[var(--color-success-100)]",
      iconColor: "text-[var(--color-success-600)]",
    },
    {
      label: "Siswa",
      description: "Daftar siswa per kelas",
      href: ROUTES.KELOLA_SISWA,
      icon: Users,
      iconBg: "bg-[var(--color-warning-100)]",
      iconColor: "text-[var(--color-warning-600)]",
    },
  ];

  return (
    <>
      <TopAppBar title="Kelola Data" showBack />

      <div className="space-y-4 px-4 py-4">
        <p className="px-1 text-xs text-[var(--color-neutral-500)]">
          Kelola data master untuk kategori, jenis seragam, kelas, dan siswa.
        </p>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {items.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--color-neutral-50)]",
                idx !== items.length - 1 &&
                  "border-b border-[var(--color-neutral-100)]"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
                  item.iconBg
                )}
              >
                <item.icon className={cn("h-5 w-5", item.iconColor)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-neutral-800)]">
                  {item.label}
                </p>
                <p className="mt-0.5 truncate text-xs text-[var(--color-neutral-500)]">
                  {item.description}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-[var(--color-neutral-300)]" />
            </Link>
          ))}
        </div>

        <div className="rounded-lg bg-[var(--color-info-50)] p-3">
          <p className="text-xs text-[var(--color-info-700)]">
            💡 Sebagai operator, kamu bisa menambah dan mengedit data. Hanya
            admin yang bisa menghapus data.
          </p>
        </div>
      </div>
    </>
  );
}