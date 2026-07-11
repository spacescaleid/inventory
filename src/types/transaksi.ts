import type { PocketBaseRecord } from "./index";
import type { StockItem } from "./seragam";
import type { User } from "./auth";

export interface Transaksi extends PocketBaseRecord {
  nama_siswa: string;
  kelas: string;
  catatan: string;
  is_cancelled: boolean;
  cancelled_at: string | null;
  created_by: string;
  expand?: {
    created_by?: User;
    "transaction_items(transaction)"?: TransactionItem[];
  };
}

export interface TransactionItem extends PocketBaseRecord {
  transaction: string;
  stock_item: string;
  jumlah: number;
  stok_sebelum: number;
  stok_sesudah: number;
  expand?: {
    stock_item?: StockItem;
  };
}

export interface TransaksiInput {
  nama_siswa: string;
  kelas: string;
  catatan?: string;
  items: {
    stock_item_id: string;
    jumlah: number;
  }[];
}

export type StockLogType = "masuk" | "keluar" | "koreksi" | "batal";

export interface StockLog extends PocketBaseRecord {
  stock_item: string;
  tipe: StockLogType;
  jumlah: number;
  stok_sebelum: number;
  stok_sesudah: number;
  referensi: string;
  catatan: string;
  user: string;
}