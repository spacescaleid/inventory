"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase/client";
import { COLLECTIONS } from "@/lib/pocketbase/collections";
import { queryKeys } from "@/constants/query-keys";
import type {
  StockItem,
  StockItemInput,
  StokGrouped,
  Kategori,
  JenisSeragam,
} from "@/types";

/**
 * List semua stock items (dengan expand jenis + kategori)
 */
export function useStockItems() {
  return useQuery({
    queryKey: queryKeys.stockItems.list(),
    queryFn: async () => {
      return await pb
        .collection(COLLECTIONS.STOCK_ITEMS)
        .getFullList<StockItem>({
          sort: "-created",
          expand: "uniform_type.category",
        });
    },
  });
}

/**
 * Get single stock item by ID
 */
export function useStockItem(id: string) {
  return useQuery({
    queryKey: queryKeys.stockItems.detail(id),
    queryFn: async () => {
      return await pb.collection(COLLECTIONS.STOCK_ITEMS).getOne<StockItem>(id, {
        expand: "uniform_type.category",
      });
    },
    enabled: !!id,
  });
}

/**
 * Get stock items by uniform_type ID
 */
export function useStockItemsByJenis(uniformTypeId: string) {
  return useQuery({
    queryKey: queryKeys.stockItems.byUniformType(uniformTypeId),
    queryFn: async () => {
      return await pb
        .collection(COLLECTIONS.STOCK_ITEMS)
        .getFullList<StockItem>({
          filter: `uniform_type = "${uniformTypeId}"`,
          sort: "ukuran",
          expand: "uniform_type",
        });
    },
    enabled: !!uniformTypeId,
  });
}

/**
 * Get stok menipis (di bawah threshold)
 */
export function useStokMenipis(threshold: number = 5) {
  return useQuery({
    queryKey: queryKeys.stockItems.menipis(threshold),
    queryFn: async () => {
      return await pb
        .collection(COLLECTIONS.STOCK_ITEMS)
        .getFullList<StockItem>({
          filter: `stok > 0 && stok <= ${threshold}`,
          sort: "stok",
          expand: "uniform_type.category",
        });
    },
  });
}

/**
 * Get grouped stock (per kategori → per jenis → items)
 */
export function useStokGrouped() {
  return useQuery({
    queryKey: queryKeys.stockItems.grouped(),
    queryFn: async (): Promise<StokGrouped[]> => {
      // Fetch all data secara parallel
      const [categories, uniformTypes, stockItems] = await Promise.all([
        pb.collection(COLLECTIONS.CATEGORIES).getFullList<Kategori>({
          sort: "urutan,nama",
        }),
        pb.collection(COLLECTIONS.UNIFORM_TYPES).getFullList<JenisSeragam>({
          sort: "nama",
        }),
        pb.collection(COLLECTIONS.STOCK_ITEMS).getFullList<StockItem>({
          expand: "uniform_type",
        }),
      ]);

      // Group jenis by kategori, items by jenis
      const result: StokGrouped[] = [];

      for (const kategori of categories) {
        const jenisInKategori = uniformTypes.filter(
          (j) => j.category === kategori.id
        );

        const jenisList = jenisInKategori.map((jenis) => ({
          jenis,
          items: stockItems
            .filter((item) => item.uniform_type === jenis.id)
            .sort((a, b) => {
              const aNum = parseFloat(a.ukuran);
              const bNum = parseFloat(b.ukuran);
              if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
              return a.ukuran.localeCompare(b.ukuran);
            }),
        }));

        // Skip kategori tanpa items
        if (jenisList.some((j) => j.items.length > 0)) {
          result.push({ kategori, jenisList });
        }
      }

      return result;
    },
  });
}

/**
 * Create stock item baru
 */
export function useCreateStockItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: StockItemInput) => {
      return await pb.collection(COLLECTIONS.STOCK_ITEMS).create<StockItem>({
        uniform_type: input.uniform_type,
        ukuran: input.ukuran.trim(),
        stok: input.stok,
        stok_awal: input.stok_awal ?? input.stok,
        harga: input.harga ?? 0,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stockItems.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}

/**
 * Update stock item
 */
export function useUpdateStockItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: Partial<StockItemInput>;
    }) => {
      return await pb
        .collection(COLLECTIONS.STOCK_ITEMS)
        .update<StockItem>(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stockItems.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}

/**
 * Delete stock item
 */
export function useDeleteStockItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await pb.collection(COLLECTIONS.STOCK_ITEMS).delete(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stockItems.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}

/**
 * Tambah stok ke item existing (increment)
 */
export function useIncrementStock() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      stockItemId,
      jumlah,
    }: {
      stockItemId: string;
      jumlah: number;
    }) => {
      // Get current stock
      const current = await pb
        .collection(COLLECTIONS.STOCK_ITEMS)
        .getOne<StockItem>(stockItemId);

      // Update
      return await pb
        .collection(COLLECTIONS.STOCK_ITEMS)
        .update<StockItem>(stockItemId, {
          stok: current.stok + jumlah,
        });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stockItems.all() });
    },
  });
}