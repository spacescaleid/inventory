"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase/client";
import { COLLECTIONS } from "@/lib/pocketbase/collections";
import { queryKeys } from "@/constants/query-keys";
import type { Kelas, KelasInput } from "@/types";

/**
 * List semua kelas
 */
export function useClasses() {
  return useQuery({
    queryKey: queryKeys.classes.list(),
    queryFn: async () => {
      return await pb.collection(COLLECTIONS.CLASSES).getFullList<Kelas>({
        sort: "-tahun_ajaran,nama",
      });
    },
  });
}

/**
 * Create kelas baru
 */
export function useCreateClass() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: KelasInput) => {
      return await pb.collection(COLLECTIONS.CLASSES).create<Kelas>({
        nama: input.nama.trim(),
        tahun_ajaran: input.tahun_ajaran.trim(),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.classes.all() });
    },
  });
}

/**
 * Update kelas
 */
export function useUpdateClass() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: Partial<KelasInput>;
    }) => {
      return await pb.collection(COLLECTIONS.CLASSES).update<Kelas>(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.classes.all() });
    },
  });
}

/**
 * Delete kelas
 */
export function useDeleteClass() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await pb.collection(COLLECTIONS.CLASSES).delete(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.classes.all() });
    },
  });
}