"use client";

import { useEffect, useState } from "react";
import { AktivitasTerakhir } from "@/components/features/dashboard/AktivitasTerakhir";
import { StokMenipis } from "@/components/features/dashboard/StokMenipis";
import { SummaryCards } from "@/components/features/dashboard/SummaryCards";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { useOperatorStats } from "@/hooks/useDashboard";
import { useStokMenipis } from "@/hooks/useStok";
import { useTransaksiTerakhir } from "@/hooks/useTransaksi";
import { useSettingsStore } from "@/stores/settingsStore";
import { formatTanggalLengkap, getGreeting } from "@/utils/date";

export default function BerandaPage() {
  const namaSekolah = useSettingsStore((state) => state.namaSekolah);
  const threshold = useSettingsStore((state) => state.thresholdMenipis);

  const { data: stats, isLoading: statsLoading } = useOperatorStats();
  const { data: stokMenipis, isLoading: menipisLoading } =
    useStokMenipis(threshold);
  const { data: transaksiTerakhir, isLoading: trxLoading } =
    useTransaksiTerakhir(5);

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
        <p
          className="text-xs text-[var(--color-neutral-500)]"
          suppressHydrationWarning
        >
          {mounted ? tanggal : "\u00A0"}
        </p>

        <SummaryCards
          data={
            stats
              ? {
                  totalItems: stats.totalItems,
                  totalSiswaHariIni: stats.totalSiswaHariIni,
                }
              : undefined
          }
          isLoading={statsLoading}
        />

        <StokMenipis
          items={stokMenipis}
          isLoading={menipisLoading}
          threshold={threshold}
        />

        <AktivitasTerakhir
          items={transaksiTerakhir}
          isLoading={trxLoading}
        />
      </div>
    </>
  );
}