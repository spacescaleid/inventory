"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase/client";
import { COLLECTIONS } from "@/lib/pocketbase/collections";
import { queryKeys } from "@/constants/query-keys";
import type { JenisSeragam, JenisSeragamInput } from "@/types";

/**
 * List jenis seragam (optionally filter by kategori)
 */
export function useUniformTypes(categoryId?: string) {
  return useQuery({
    queryKey: queryKeys.uniformTypes.list(categoryId),
    queryFn: async () => {
      const filter = categoryId ? `category = "${categoryId}"` : "";

      return await pb
        .collection(COLLECTIONS.UNIFORM_TYPES)
        .getFullList<JenisSeragam>({
          filter,
          sort: "nama",
          expand: "category",
        });
    },
  });
}

/**
 * Get single jenis seragam by ID
 */
export function useUniformType(id: string) {
  return useQuery({
    queryKey: queryKeys.uniformTypes.detail(id),
    queryFn: async () => {
      return await pb
        .collection(COLLECTIONS.UNIFORM_TYPES)
        .getOne<JenisSeragam>(id, {
          expand: "category",
        });
    },
    enabled: !!id,
  });
}

/**
 * Create jenis seragam baru
 */
export function useCreateUniformType() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: JenisSeragamInput) => {
      return await pb
        .collection(COLLECTIONS.UNIFORM_TYPES)
        .create<JenisSeragam>({
          category: input.category,
          nama: input.nama,
        });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.uniformTypes.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}

/**
 * Update jenis seragam
 */
export function useUpdateUniformType() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: Partial<JenisSeragamInput>;
    }) => {
      return await pb
        .collection(COLLECTIONS.UNIFORM_TYPES)
        .update<JenisSeragam>(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.uniformTypes.all() });
      qc.invalidateQueries({ queryKey: queryKeys.stockItems.all() });
    },
  });
}

/**
 * Delete jenis seragam
 */
export function useDeleteUniformType() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await pb.collection(COLLECTIONS.UNIFORM_TYPES).delete(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.uniformTypes.all() });
      qc.invalidateQueries({ queryKey: queryKeys.stockItems.all() });
    },
  });
}