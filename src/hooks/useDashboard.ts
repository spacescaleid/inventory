"use client";

import { useQuery } from "@tanstack/react-query";
import pb from "@/lib/pocketbase/client";
import { COLLECTIONS } from "@/lib/pocketbase/collections";
import { queryKeys } from "@/constants/query-keys";
import type { StockItem, Transaksi, User } from "@/types";

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalStok: number;
  totalTransactions: number;
  totalCategories: number;
  totalUniformTypes: number;
  totalClasses: number;
  totalStudents: number;
}

/**
 * Aggregated stats untuk admin dashboard.
 */
export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: queryKeys.dashboard.adminStats(),
    queryFn: async (): Promise<AdminStats> => {
      const [
        users,
        stockItems,
        transactions,
        categories,
        uniformTypes,
        classes,
        students,
      ] = await Promise.all([
        pb.collection(COLLECTIONS.USERS).getFullList<User>(),
        pb.collection(COLLECTIONS.STOCK_ITEMS).getFullList<StockItem>(),
        pb.collection(COLLECTIONS.TRANSACTIONS).getFullList<Transaksi>({
          filter: "is_cancelled = false",
        }),
        pb.collection(COLLECTIONS.CATEGORIES).getFullList(),
        pb.collection(COLLECTIONS.UNIFORM_TYPES).getFullList(),
        pb.collection(COLLECTIONS.CLASSES).getFullList(),
        pb.collection(COLLECTIONS.STUDENTS).getFullList(),
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
        totalClasses: classes.length,
        totalStudents: students.length,
      };
    },
  });
}

export interface OperatorStats {
  totalItems: number;
  totalSiswaHariIni: number;
  totalTransaksiHariIni: number;
}

/**
 * Stats untuk operator dashboard (beranda).
 */
export function useOperatorStats() {
  return useQuery<OperatorStats>({
    queryKey: queryKeys.dashboard.operatorStats(),
    queryFn: async (): Promise<OperatorStats> => {
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