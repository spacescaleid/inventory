import type { PocketBaseRecord } from "./index";

export interface Kategori extends PocketBaseRecord {
  nama: string;
  urutan: number;
}

export interface KategoriInput {
  nama: string;
  urutan?: number;
}