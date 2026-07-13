"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase/client";
import { COLLECTIONS } from "@/lib/pocketbase/collections";
import { queryKeys } from "@/constants/query-keys";
import type { Kategori, KategoriInput } from "@/types";

/**
 * List semua kategori (sorted by urutan)
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: async () => {
      const result = await pb
        .collection(COLLECTIONS.CATEGORIES)
        .getFullList<Kategori>({
          sort: "urutan,nama",
        });
      return result;
    },
  });
}

/**
 * Get single kategori by ID
 */
export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: async () => {
      return await pb.collection(COLLECTIONS.CATEGORIES).getOne<Kategori>(id);
    },
    enabled: !!id,
  });
}

/**
 * Create kategori baru
 */
export function useCreateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: KategoriInput) => {
      return await pb.collection(COLLECTIONS.CATEGORIES).create<Kategori>({
        nama: input.nama,
        urutan: input.urutan ?? 0,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}

/**
 * Update kategori existing
 */
export function useUpdateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: Partial<KategoriInput>;
    }) => {
      return await pb
        .collection(COLLECTIONS.CATEGORIES)
        .update<Kategori>(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all() });
    },
  });
}

/**
 * Delete kategori
 */
export function useDeleteCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await pb.collection(COLLECTIONS.CATEGORIES).delete(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all() });
      qc.invalidateQueries({ queryKey: queryKeys.uniformTypes.all() });
      qc.invalidateQueries({ queryKey: queryKeys.stockItems.all() });
    },
  });
}