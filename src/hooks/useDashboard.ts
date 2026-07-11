"use client";

import { useQuery } from "@tanstack/react-query";
import pb from "@/lib/pocketbase/client";
import { COLLECTIONS } from "@/lib/pocketbase/collections";
import { queryKeys } from "@/constants/query-keys";
import type { StockItem, Transaksi, User } from "@/types";

/**
 * Aggregated stats untuk admin dashboard.
 */
export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.adminStats(),
    queryFn: async () => {
      // Fetch parallel
      const [users, stockItems, transactions, categories, uniformTypes] =
        await Promise.all([
          pb.collection(COLLECTIONS.USERS).getFullList<User>(),
          pb.collection(COLLECTIONS.STOCK_ITEMS).getFullList<StockItem>(),
          pb
            .collection(COLLECTIONS.TRANSACTIONS)
            .getFullList<Transaksi>({
              filter: "is_cancelled = false",
            }),
          pb.collection(COLLECTIONS.CATEGORIES).getFullList(),
          pb.collection(COLLECTIONS.UNIFORM_TYPES).getFullList(),
        ]);

      const activeUsers = users.filter((u) => u.is_active).length;
      const totalStok = stockItems.reduce((sum, item) => sum + item.stok, 0);

      return {
        totalUsers: users.length,
        activeUsers,
        totalStok,
        totalTransactions: transactions.length,
        totalCategories: categories.length,
        totalUniformTypes: uniformTypes.length,
      };
    },
  });
}

/**
 * Stats untuk operator dashboard (beranda).
 */
export function useOperatorStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.operatorStats(),
    queryFn: async () => {
      const [stockItems, todayTransactions] = await Promise.all([
        pb.collection(COLLECTIONS.STOCK_ITEMS).getFullList<StockItem>(),
        pb.collection(COLLECTIONS.TRANSACTIONS).getFullList<Transaksi>({
          filter: `created >= "${new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          ).toISOString()}" && is_cancelled = false`,
        }),
      ]);

      const totalItems = stockItems.reduce((sum, item) => sum + item.stok, 0);
      const uniqueSiswaToday = new Set(
        todayTransactions.map((t) => t.nama_siswa)
      ).size;

      return {
        totalItems,
        totalSiswaHariIni: uniqueSiswaToday,
        totalTransaksiHariIni: todayTransactions.length,
      };
    },
  });
}