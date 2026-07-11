import { create } from "zustand";

export type CatatStep = "identitas" | "seragam" | "konfirmasi" | "sukses";

export interface CatatItemInput {
  id: string; // client-side ID untuk key
  kategoriId: string | null;
  jenisId: string | null;
  stockItemId: string | null;
  jumlah: number;
}

interface CatatState {
  step: CatatStep;
  namaSiswa: string;
  kelas: string;
  catatan: string;
  items: CatatItemInput[];

  setStep: (step: CatatStep) => void;
  setIdentitas: (nama: string, kelas: string) => void;
  setCatatan: (catatan: string) => void;

  addItem: () => void;
  updateItem: (id: string, patch: Partial<CatatItemInput>) => void;
  removeItem: (id: string) => void;

  reset: () => void;
}

const createEmptyItem = (): CatatItemInput => ({
  id: crypto.randomUUID(),
  kategoriId: null,
  jenisId: null,
  stockItemId: null,
  jumlah: 1,
});

/**
 * State untuk multi-step form Catat Pengambilan.
 * Sengaja tidak di-persist supaya form fresh setiap buka.
 */
export const useCatatStore = create<CatatState>((set) => ({
  step: "identitas",
  namaSiswa: "",
  kelas: "",
  catatan: "",
  items: [createEmptyItem()],

  setStep: (step) => set({ step }),

  setIdentitas: (nama, kelas) => set({ namaSiswa: nama, kelas }),

  setCatatan: (catatan) => set({ catatan }),

  addItem: () =>
    set((state) => ({
      items: [...state.items, createEmptyItem()],
    })),

  updateItem: (id, patch) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items:
        state.items.length > 1
          ? state.items.filter((item) => item.id !== id)
          : state.items, // Minimal 1 item
    })),

  reset: () =>
    set({
      step: "identitas",
      namaSiswa: "",
      kelas: "",
      catatan: "",
      items: [createEmptyItem()],
    }),
}));