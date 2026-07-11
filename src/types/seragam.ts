import type { PocketBaseRecord } from "./index";
import type { Kategori } from "./kategori";

export interface JenisSeragam extends PocketBaseRecord {
  category: string; // ID kategori
  nama: string;
  expand?: {
    category?: Kategori;
  };
}

export interface JenisSeragamInput {
  category: string;
  nama: string;
}

export interface StockItem extends PocketBaseRecord {
  uniform_type: string; // ID jenis seragam
  ukuran: string;
  stok: number;
  stok_awal?: number;
  harga?: number;
  expand?: {
    uniform_type?: JenisSeragam & {
      expand?: {
        category?: Kategori;
      };
    };
  };
}

export interface StockItemInput {
  uniform_type: string;
  ukuran: string;
  stok: number;
  stok_awal?: number;
  harga?: number;
}

// Grouped view untuk halaman stok
export interface StokGrouped {
  kategori: Kategori;
  jenisList: {
    jenis: JenisSeragam;
    items: StockItem[];
  }[];
}