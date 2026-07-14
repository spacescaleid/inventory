"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase/client";
import { COLLECTIONS } from "@/lib/pocketbase/collections";
import { queryKeys } from "@/constants/query-keys";
import type { Student, StudentInput } from "@/types";

interface StudentFilterOptions {
  search?: string;
  classId?: string;
}

/**
 * List semua siswa (dengan expand class)
 */
export function useStudents(options: StudentFilterOptions = {}) {
  return useQuery({
    queryKey: queryKeys.students.list({
      search: options.search,
      classId: options.classId,
    }),
    queryFn: async () => {
      const filters: string[] = [];

      if (options.classId) {
        filters.push(`class = "${options.classId}"`);
      }

      if (options.search?.trim()) {
        const q = options.search.trim();
        filters.push(`(nama ~ "${q}" || nis ~ "${q}")`);
      }

      return await pb.collection(COLLECTIONS.STUDENTS).getFullList<Student>({
        filter: filters.join(" && "),
        sort: "nama",
        expand: "class",
      });
    },
  });
}

/**
 * Get siswa by ID
 */
export function useStudent(id: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: async () => {
      return await pb.collection(COLLECTIONS.STUDENTS).getOne<Student>(id, {
        expand: "class",
      });
    },
    enabled: !!id,
  });
}

/**
 * Get siswa by class
 */
export function useStudentsByClass(classId: string) {
  return useQuery({
    queryKey: queryKeys.students.byClass(classId),
    queryFn: async () => {
      return await pb.collection(COLLECTIONS.STUDENTS).getFullList<Student>({
        filter: `class = "${classId}"`,
        sort: "nama",
        expand: "class",
      });
    },
    enabled: !!classId,
  });
}

/**
 * Create siswa baru
 */
export function useCreateStudent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: StudentInput) => {
      return await pb.collection(COLLECTIONS.STUDENTS).create<Student>({
        nama: input.nama.trim(),
        class: input.class,
        nis: input.nis?.trim() || "",
        catatan: input.catatan?.trim() || "",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.students.all() });
    },
  });
}

/**
 * Update siswa
 */
export function useUpdateStudent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: Partial<StudentInput>;
    }) => {
      const payload: Record<string, unknown> = {};
      if (input.nama !== undefined) payload.nama = input.nama.trim();
      if (input.class !== undefined) payload.class = input.class;
      if (input.nis !== undefined) payload.nis = input.nis.trim();
      if (input.catatan !== undefined) payload.catatan = input.catatan.trim();

      return await pb
        .collection(COLLECTIONS.STUDENTS)
        .update<Student>(id, payload);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.students.all() });
      qc.invalidateQueries({ queryKey: queryKeys.students.detail(data.id) });
    },
  });
}

/**
 * Delete siswa
 */
export function useDeleteStudent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await pb.collection(COLLECTIONS.STUDENTS).delete(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.students.all() });
    },
  });
}

/**
 * Autocomplete: cari nama siswa dari master students
 * Format hasil: "Budi Santoso (VII-A)"
 */
export function useAutocompleteStudentsFromMaster() {
  return async (query: string): Promise<string[]> => {
    if (query.trim().length < 1) return [];

    try {
      const result = await pb
        .collection(COLLECTIONS.STUDENTS)
        .getList<Student>(1, 10, {
          filter: `nama ~ "${query.trim()}"`,
          sort: "nama",
          expand: "class",
          fields: "id,nama,expand.class.nama",
        });

      return result.items.map((s) => {
        const kelas = s.expand?.class?.nama;
        return kelas ? `${s.nama} (${kelas})` : s.nama;
      });
    } catch (err) {
      console.error("Autocomplete students error:", err);
      return [];
    }
  };
}