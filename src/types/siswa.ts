import type { PocketBaseRecord } from "./index";

export interface Kelas extends PocketBaseRecord {
  nama: string;
  tahun_ajaran: string;
}

export interface KelasInput {
  nama: string;
  tahun_ajaran: string;
}