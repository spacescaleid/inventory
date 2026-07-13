import type { PocketBaseRecord } from "./index";

export interface Kelas extends PocketBaseRecord {
  nama: string;
  tahun_ajaran: string;
}

export interface KelasInput {
  nama: string;
  tahun_ajaran: string;
}

export interface Student extends PocketBaseRecord {
  nama: string;
  class: string; // ID kelas
  nis?: string;
  catatan?: string;
  expand?: {
    class?: Kelas;
  };
}

export interface StudentInput {
  nama: string;
  class: string;
  nis?: string;
  catatan?: string;
}