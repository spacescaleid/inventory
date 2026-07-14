"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase/client";
import { COLLECTIONS } from "@/lib/pocketbase/collections";
import { queryKeys } from "@/constants/query-keys";
import { getCurrentUser } from "@/lib/pocketbase/client";
import type {
  Transaksi,
  TransactionItem,
  TransaksiInput,
  StockItem,
} from "@/types";

export type RiwayatPeriode =
  | "hari-ini"
  | "minggu-ini"
  | "bulan-ini"
  | "semua"
  | "custom";

interface RiwayatFilterOptions {
  search?: string;
  periode?: RiwayatPeriode;
  dateFrom?: string | null;
  dateTo?: string | null;
}

function buildFilter(options: RiwayatFilterOptions): string {
  const filters: string[] = [];
  const now = new Date();

  if (options.periode === "hari-ini") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    filters.push(`created >= "${start.toISOString()}"`);
  } else if (options.periode === "minggu-ini") {
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
    filters.push(`created >= "${startOfWeek.toISOString()}"`);
  } else if (options.periode === "bulan-ini") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    filters.push(`created >= "${start.toISOString()}"`);
  } else if (options.periode === "custom") {
    if (options.dateFrom) filters.push(`created >= "${options.dateFrom}"`);
    if (options.dateTo) {
      const to = new Date(options.dateTo);
      to.setHours(23, 59, 59, 999);
      filters.push(`created <= "${to.toISOString()}"`);
    }
  }

  if (options.search?.trim()) {
    const q = options.search.trim();
    filters.push(`(nama_siswa ~ "${q}" || kelas ~ "${q}")`);
  }

  return filters.join(" && ");
}

/**
 * List transaksi dengan filter
 */
export function useTransactions(options: RiwayatFilterOptions = {}) {
  return useQuery({
    queryKey: queryKeys.transactions.list({
      search: options.search,
      periode: options.periode,
      dateFrom: options.dateFrom,
      dateTo: options.dateTo,
    }),
    queryFn: async () => {
      const filter = buildFilter(options);

      const list = await pb
        .collection(COLLECTIONS.TRANSACTIONS)
        .getFullList<Transaksi>({
          filter,
          sort: "-created",
        });

      const withItems = await Promise.all(
        list.map(async (trx) => {
          const items = await pb
            .collection(COLLECTIONS.TRANSACTION_ITEMS)
            .getFullList<TransactionItem>({
              filter: `transaction = "${trx.id}"`,
              expand: "stock_item.uniform_type.category",
            });

          return { ...trx, items };
        })
      );

      return withItems;
    },
  });
}

/**
 * Get transaksi by ID (dengan items)
 */
export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: async () => {
      const trx = await pb
        .collection(COLLECTIONS.TRANSACTIONS)
        .getOne<Transaksi>(id, {
          expand: "created_by",
        });

      const items = await pb
        .collection(COLLECTIONS.TRANSACTION_ITEMS)
        .getFullList<TransactionItem>({
          filter: `transaction = "${id}"`,
          expand: "stock_item.uniform_type.category",
        });

      return { ...trx, items };
    },
    enabled: !!id,
  });
}

/**
 * Transaksi terakhir (untuk dashboard)
 */
export function useTransaksiTerakhir(limit: number = 5) {
  return useQuery({
    queryKey: queryKeys.transactions.terakhir(limit),
    queryFn: async () => {
      const result = await pb
        .collection(COLLECTIONS.TRANSACTIONS)
        .getList<Transaksi>(1, limit, {
          filter: "is_cancelled = false",
          sort: "-created",
        });

      const withItems = await Promise.all(
        result.items.map(async (trx) => {
          const items = await pb
            .collection(COLLECTIONS.TRANSACTION_ITEMS)
            .getFullList<TransactionItem>({
              filter: `transaction = "${trx.id}"`,
              expand: "stock_item.uniform_type",
            });

          return { ...trx, items };
        })
      );

      return withItems;
    },
  });
}

/**
 * Create transaksi + items + decrement stock (multi-step)
 */
export function useCreateTransaction() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: TransaksiInput) => {
      const user = getCurrentUser();
      if (!user) throw new Error("User tidak terauthentikasi");

      const stockItems = await Promise.all(
        input.items.map((item) =>
          pb
            .collection(COLLECTIONS.STOCK_ITEMS)
            .getOne<StockItem>(item.stock_item_id)
        )
      );

      const transaction = await pb
        .collection(COLLECTIONS.TRANSACTIONS)
        .create<Transaksi>({
          nama_siswa: input.nama_siswa.trim(),
          kelas: input.kelas.trim(),
          catatan: input.catatan?.trim() || "",
          is_cancelled: false,
          created_by: user.id,
        });

      const createdItems: TransactionItem[] = [];

      for (let i = 0; i < input.items.length; i++) {
        const item = input.items[i];
        const stock = stockItems[i];

        const stokSebelum = stock.stok;
        const stokSesudah = stokSebelum - item.jumlah;

        const trxItem = await pb
          .collection(COLLECTIONS.TRANSACTION_ITEMS)
          .create<TransactionItem>({
            transaction: transaction.id,
            stock_item: item.stock_item_id,
            jumlah: item.jumlah,
            stok_sebelum: stokSebelum,
            stok_sesudah: stokSesudah,
          });

        createdItems.push(trxItem);

        await pb
          .collection(COLLECTIONS.STOCK_ITEMS)
          .update(item.stock_item_id, {
            stok: stokSesudah,
          });

        await pb.collection(COLLECTIONS.STOCK_LOGS).create({
          stock_item: item.stock_item_id,
          tipe: "keluar",
          jumlah: item.jumlah,
          stok_sebelum: stokSebelum,
          stok_sesudah: stokSesudah,
          referensi: transaction.id,
          catatan: `Pengambilan oleh ${input.nama_siswa} (${input.kelas})`,
          user: user.id,
        });
      }

      return { ...transaction, items: createdItems };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all() });
      qc.invalidateQueries({ queryKey: queryKeys.stockItems.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
      qc.invalidateQueries({ queryKey: queryKeys.stockLogs.all() });
    },
  });
}

/**
 * Cancel transaction (restore stock)
 */
export function useCancelTransaction() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      const user = getCurrentUser();
      if (!user) throw new Error("User tidak terauthentikasi");

      const transaction = await pb
        .collection(COLLECTIONS.TRANSACTIONS)
        .getOne<Transaksi>(transactionId);

      if (transaction.is_cancelled) {
        throw new Error("Transaksi sudah dibatalkan sebelumnya");
      }

      const items = await pb
        .collection(COLLECTIONS.TRANSACTION_ITEMS)
        .getFullList<TransactionItem>({
          filter: `transaction = "${transactionId}"`,
        });

      for (const item of items) {
        const stock = await pb
          .collection(COLLECTIONS.STOCK_ITEMS)
          .getOne<StockItem>(item.stock_item);

        const stokSebelum = stock.stok;
        const stokSesudah = stokSebelum + item.jumlah;

        await pb.collection(COLLECTIONS.STOCK_ITEMS).update(item.stock_item, {
          stok: stokSesudah,
        });

        await pb.collection(COLLECTIONS.STOCK_LOGS).create({
          stock_item: item.stock_item,
          tipe: "batal",
          jumlah: item.jumlah,
          stok_sebelum: stokSebelum,
          stok_sesudah: stokSesudah,
          referensi: transactionId,
          catatan: `Pembatalan transaksi ${transaction.nama_siswa}`,
          user: user.id,
        });
      }

      return await pb
        .collection(COLLECTIONS.TRANSACTIONS)
        .update<Transaksi>(transactionId, {
          is_cancelled: true,
          cancelled_at: new Date().toISOString(),
        });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all() });
      qc.invalidateQueries({ queryKey: queryKeys.stockItems.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}