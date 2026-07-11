import { create } from "zustand";

interface FilterState {
  // Filter untuk halaman Stok
  stokSearch: string;
  stokKategoriId: string | null;

  // Filter untuk halaman Riwayat
  riwayatSearch: string;
  riwayatPeriode: "hari-ini" | "minggu-ini" | "bulan-ini" | "semua" | "custom";
  riwayatDateFrom: string | null;
  riwayatDateTo: string | null;

  // Actions
  setStokSearch: (search: string) => void;
  setStokKategoriId: (id: string | null) => void;
  resetStokFilter: () => void;

  setRiwayatSearch: (search: string) => void;
  setRiwayatPeriode: (periode: FilterState["riwayatPeriode"]) => void;
  setRiwayatDateRange: (from: string | null, to: string | null) => void;
  resetRiwayatFilter: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  stokSearch: "",
  stokKategoriId: null,

  riwayatSearch: "",
  riwayatPeriode: "hari-ini",
  riwayatDateFrom: null,
  riwayatDateTo: null,

  setStokSearch: (search) => set({ stokSearch: search }),
  setStokKategoriId: (id) => set({ stokKategoriId: id }),
  resetStokFilter: () => set({ stokSearch: "", stokKategoriId: null }),

  setRiwayatSearch: (search) => set({ riwayatSearch: search }),
  setRiwayatPeriode: (periode) => set({ riwayatPeriode: periode }),
  setRiwayatDateRange: (from, to) =>
    set({ riwayatDateFrom: from, riwayatDateTo: to }),
  resetRiwayatFilter: () =>
    set({
      riwayatSearch: "",
      riwayatPeriode: "hari-ini",
      riwayatDateFrom: null,
      riwayatDateTo: null,
    }),
}));