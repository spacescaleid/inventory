// Re-export semua types
export type * from "./kategori";
export type * from "./seragam";
export type * from "./transaksi";
export type * from "./siswa";
export type * from "./auth";

// Common PocketBase types
export interface PocketBaseRecord {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
}

export interface PaginatedResult<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export type StokStatus = "aman" | "tipis" | "kritis" | "habis" | "defisit";