"use client";

import { FilterChips, type FilterChipOption } from "@/components/shared/FilterChips";
import { SearchInput } from "@/components/shared/SearchInput";
import type { Kategori } from "@/types";

interface FilterStokProps {
  kategoris: Kategori[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  kategoriId: string | null;
  onKategoriChange: (id: string | null) => void;
}

export function FilterStok({
  kategoris,
  searchValue,
  onSearchChange,
  kategoriId,
  onKategoriChange,
}: FilterStokProps) {
  const options: FilterChipOption[] = kategoris.map((k) => ({
    value: k.id,
    label: k.nama,
  }));

  return (
    <div className="space-y-3">
      <SearchInput
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        onClear={() => onSearchChange("")}
        placeholder="Cari jenis atau ukuran..."
      />

      <FilterChips
        options={options}
        value={kategoriId}
        onChange={onKategoriChange}
        allLabel="Semua Kategori"
      />
    </div>
  );
}