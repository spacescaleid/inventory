"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase/client";
import { COLLECTIONS } from "@/lib/pocketbase/collections";
import { queryKeys } from "@/constants/query-keys";
import { normalizeUkuran } from "@/utils/format";
import { getCurrentUser } from "@/lib/pocketbase/client";
import type {
  StockItem,
  StockItemInput,
  StokGrouped,
  Kategori,
  JenisSeragam,
} from "@/types";

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

export function useStokGrouped() {
  return useQuery({
    queryKey: queryKeys.stockItems.grouped(),
    queryFn: async (): Promise<StokGrouped[]> => {
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

        if (jenisList.some((j) => j.items.length > 0)) {
          result.push({ kategori, jenisList });
        }
      }

      return result;
    },
  });
}

export interface UpsertStockResult {
  action: "created" | "incremented";
  item: StockItem;
  stokSebelum?: number;
  stokSesudah?: number;
  ukuran: string;
}

/**
 * Smart create/increment stock:
 * - Kalau ukuran belum ada → CREATE baru
 * - Kalau ukuran sudah ada → INCREMENT stok existing
 */
export function useUpsertStock() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: StockItemInput): Promise<UpsertStockResult> => {
      const user = getCurrentUser();
      const ukuranNormalized = normalizeUkuran(input.ukuran);

      const existing = await pb
        .collection(COLLECTIONS.STOCK_ITEMS)
        .getFullList<StockItem>({
          filter: `uniform_type = "${input.uniform_type}" && ukuran = "${ukuranNormalized}"`,
        });

      if (existing.length > 0) {
        const current = existing[0];
        const stokSebelum = current.stok;
        const stokSesudah = stokSebelum + input.stok;

        const updatePayload: Record<string, unknown> = {
          stok: stokSesudah,
          stok_awal: (current.stok_awal ?? 0) + input.stok,
        };

        if (input.harga !== undefined && input.harga > 0) {
          updatePayload.harga = input.harga;
        }

        const updated = await pb
          .collection(COLLECTIONS.STOCK_ITEMS)
          .update<StockItem>(current.id, updatePayload);

        if (user) {
          try {
            await pb.collection(COLLECTIONS.STOCK_LOGS).create({
              stock_item: current.id,
              tipe: "masuk",
              jumlah: input.stok,
              stok_sebelum: stokSebelum,
              stok_sesudah: stokSesudah,
              catatan: "Tambah stok",
              user: user.id,
            });
          } catch (err) {
            console.warn("Stock log failed:", err);
          }
        }

        return {
          action: "incremented",
          item: updated,
          stokSebelum,
          stokSesudah,
          ukuran: ukuranNormalized,
        };
      }

      const payload: Record<string, unknown> = {
        uniform_type: input.uniform_type,
        ukuran: ukuranNormalized,
        stok: input.stok,
        stok_awal: input.stok_awal ?? input.stok,
      };

      if (input.harga !== undefined && input.harga > 0) {
        payload.harga = input.harga;
      }

      const created = await pb
        .collection(COLLECTIONS.STOCK_ITEMS)
        .create<StockItem>(payload);

      if (user) {
        try {
          await pb.collection(COLLECTIONS.STOCK_LOGS).create({
            stock_item: created.id,
            tipe: "masuk",
            jumlah: input.stok,
            stok_sebelum: 0,
            stok_sesudah: input.stok,
            catatan: "Stok awal",
            user: user.id,
          });
        } catch (err) {
          console.warn("Stock log failed:", err);
        }
      }

      return {
        action: "created",
        item: created,
        stokSebelum: 0,
        stokSesudah: input.stok,
        ukuran: ukuranNormalized,
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stockItems.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
      qc.invalidateQueries({ queryKey: queryKeys.stockLogs.all() });
    },
  });
}

export function useCreateStockItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: StockItemInput) => {
      const ukuranNormalized = normalizeUkuran(input.ukuran);

      const existing = await pb
        .collection(COLLECTIONS.STOCK_ITEMS)
        .getFullList<StockItem>({
          filter: `uniform_type = "${input.uniform_type}" && ukuran = "${ukuranNormalized}"`,
        });

      if (existing.length > 0) {
        throw new Error(
          `Ukuran ${ukuranNormalized} sudah ada. Edit stok yang ada atau gunakan ukuran lain.`
        );
      }

      const payload: Record<string, unknown> = {
        uniform_type: input.uniform_type,
        ukuran: ukuranNormalized,
        stok: input.stok,
        stok_awal: input.stok_awal ?? input.stok,
      };

      if (input.harga !== undefined && input.harga > 0) {
        payload.harga = input.harga;
      }

      return await pb
        .collection(COLLECTIONS.STOCK_ITEMS)
        .create<StockItem>(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stockItems.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}

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
      const payload: Record<string, unknown> = { ...input };

      if (input.ukuran) {
        const ukuranNormalized = normalizeUkuran(input.ukuran);

        const current = await pb
          .collection(COLLECTIONS.STOCK_ITEMS)
          .getOne<StockItem>(id);

        if (ukuranNormalized !== current.ukuran) {
          const existing = await pb
            .collection(COLLECTIONS.STOCK_ITEMS)
            .getFullList<StockItem>({
              filter: `uniform_type = "${current.uniform_type}" && ukuran = "${ukuranNormalized}" && id != "${id}"`,
            });

          if (existing.length > 0) {
            throw new Error(
              `Ukuran ${ukuranNormalized} sudah ada untuk jenis ini.`
            );
          }
        }

        payload.ukuran = ukuranNormalized;
      }

      return await pb
        .collection(COLLECTIONS.STOCK_ITEMS)
        .update<StockItem>(id, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stockItems.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}

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
      const current = await pb
        .collection(COLLECTIONS.STOCK_ITEMS)
        .getOne<StockItem>(stockItemId);

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