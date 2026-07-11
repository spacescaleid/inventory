"use client";

import { useEffect, useState } from "react";
import { AktivitasTerakhir } from "@/components/features/dashboard/AktivitasTerakhir";
import { StokMenipis } from "@/components/features/dashboard/StokMenipis";
import { SummaryCards } from "@/components/features/dashboard/SummaryCards";
import { TopAppBar } from "@/components/layout/TopAppBar";
import {
  getMockStats,
  getMockStokMenipis,
  getMockTransaksiTerakhir,
} from "@/lib/mock-data";
import { useSettingsStore } from "@/stores/settingsStore";
import { formatTanggalLengkap, getGreeting } from "@/utils/date";

export default function BerandaPage() {
  const stats = getMockStats();
  const stokMenipis = getMockStokMenipis();
  const transaksiTerakhir = getMockTransaksiTerakhir();

  const namaSekolah = useSettingsStore((state) => state.namaSekolah);

  // Prevent hydration mismatch untuk waktu & tanggal
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Selamat datang");
  const [tanggal, setTanggal] = useState("");

  useEffect(() => {
    setMounted(true);
    setGreeting(getGreeting());
    setTanggal(formatTanggalLengkap(new Date()));
  }, []);

  return (
    <>
      <TopAppBar
        centerSlot={
          <div>
            <p className="text-base font-semibold text-[var(--color-neutral-800)]">
              {greeting} 👋
            </p>
            <p className="truncate text-xs text-[var(--color-neutral-500)]">
              {namaSekolah}
            </p>
          </div>
        }
      />

      <div className="space-y-6 px-4 py-4">
        {/* Tanggal hari ini — client only */}
        <p
          className="text-xs text-[var(--color-neutral-500)]"
          suppressHydrationWarning
        >
          {mounted ? tanggal : "\u00A0"}
        </p>

        {/* Summary cards */}
        <SummaryCards data={stats} />

        {/* Stok menipis */}
        <StokMenipis items={stokMenipis} />

        {/* Aktivitas terakhir */}
        <AktivitasTerakhir items={transaksiTerakhir} />
      </div>
    </>
  );
}