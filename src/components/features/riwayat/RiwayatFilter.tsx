"use client";

import { FilterChips, type FilterChipOption } from "@/components/shared/FilterChips";
import { SearchInput } from "@/components/shared/SearchInput";
import type { RiwayatPeriode } from "@/hooks/useTransaksi";

interface RiwayatFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  periode: RiwayatPeriode;
  onPeriodeChange: (periode: RiwayatPeriode) => void;
}

const PERIODE_OPTIONS: FilterChipOption<RiwayatPeriode>[] = [
  { value: "hari-ini", label: "Hari Ini" },
  { value: "minggu-ini", label: "Minggu Ini" },
  { value: "bulan-ini", label: "Bulan Ini" },
  { value: "semua", label: "Semua" },
];

export function RiwayatFilter({
  searchValue,
  onSearchChange,
  periode,
  onPeriodeChange,
}: RiwayatFilterProps) {
  return (
    <div className="space-y-3">
      <SearchInput
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        onClear={() => onSearchChange("")}
        placeholder="Cari nama siswa atau kelas..."
      />

      <FilterChips
        options={PERIODE_OPTIONS}
        value={periode}
        onChange={(v) => onPeriodeChange(v as RiwayatPeriode)}
        allowClear={false}
      />
    </div>
  );
}