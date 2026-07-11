import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_MENIPIS_THRESHOLD } from "@/constants/stok";

interface SettingsState {
  namaSekolah: string;
  tahunAjaran: string;
  thresholdMenipis: number;

  setNamaSekolah: (nama: string) => void;
  setTahunAjaran: (tahun: string) => void;
  setThresholdMenipis: (threshold: number) => void;
}

/**
 * Settings disimpan di localStorage.
 * Untuk MVP cukup client-side. Nanti bisa pindah ke DB.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      namaSekolah: "Sekolah Saya",
      tahunAjaran: "2024/2025",
      thresholdMenipis: DEFAULT_MENIPIS_THRESHOLD,

      setNamaSekolah: (nama) => set({ namaSekolah: nama }),
      setTahunAjaran: (tahun) => set({ tahunAjaran: tahun }),
      setThresholdMenipis: (threshold) => set({ thresholdMenipis: threshold }),
    }),
    {
      name: "inventory-settings",
    }
  )
);