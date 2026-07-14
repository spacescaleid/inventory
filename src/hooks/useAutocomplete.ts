"use client";

import { useCallback } from "react";
import pb from "@/lib/pocketbase/client";
import { COLLECTIONS } from "@/lib/pocketbase/collections";
import type { Student, Transaksi, Kelas } from "@/types";

/**
 * Autocomplete nama siswa — hybrid:
 * 1. Utama: dari master students (data resmi)
 * 2. Fallback: dari transaksi lama (siswa yang belum di-master)
 *
 * Format hasil: "Budi Santoso (VII-A)"
 * Kalau siswa dari master: ada tanda cek di depan.
 */
export function useAutocompleteNamaSiswa() {
  return useCallback(async (query: string): Promise<string[]> => {
    if (query.trim().length < 1) return [];

    try {
      const q = query.trim();

      // Fetch dari kedua sumber secara parallel
      const [students, transactions] = await Promise.all([
        pb.collection(COLLECTIONS.STUDENTS).getList<Student>(1, 10, {
          filter: `nama ~ "${q}"`,
          sort: "nama",
          expand: "class",
          fields: "id,nama,expand.class.nama",
        }),
        pb.collection(COLLECTIONS.TRANSACTIONS).getList<Transaksi>(1, 20, {
          filter: `nama_siswa ~ "${q}"`,
          sort: "-created",
          fields: "nama_siswa,kelas",
        }),
      ]);

      const suggestions = new Map<string, string>();

      // Prioritas 1: dari master students
      students.items.forEach((s) => {
        const kelas = s.expand?.class?.nama;
        const label = kelas ? `${s.nama} (${kelas})` : s.nama;
        suggestions.set(s.nama.toLowerCase(), label);
      });

      // Prioritas 2: dari transaksi (kalau belum ada di master)
      transactions.items.forEach((t) => {
        const key = t.nama_siswa.toLowerCase();
        if (!suggestions.has(key)) {
          suggestions.set(key, `${t.nama_siswa} (${t.kelas})`);
        }
      });

      return Array.from(suggestions.values()).slice(0, 5);
    } catch (err) {
      console.error("Autocomplete siswa error:", err);
      return [];
    }
  }, []);
}

/**
 * Autocomplete kelas dari master data classes.
 */
export function useAutocompleteKelas() {
  return useCallback(async (query: string): Promise<string[]> => {
    if (query.trim().length < 1) return [];

    try {
      const q = query.trim();

      const [classes, transactions] = await Promise.all([
        pb.collection(COLLECTIONS.CLASSES).getList<Kelas>(1, 20, {
          filter: `nama ~ "${q}"`,
          fields: "nama",
        }),
        pb.collection(COLLECTIONS.TRANSACTIONS).getList<Transaksi>(1, 20, {
          filter: `kelas ~ "${q}"`,
          fields: "kelas",
        }),
      ]);

      const unique = new Set<string>();
      classes.items.forEach((k) => unique.add(k.nama));
      transactions.items.forEach((t) => unique.add(t.kelas));

      return Array.from(unique).sort().slice(0, 5);
    } catch (err) {
      console.error("Autocomplete kelas error:", err);
      return [];
    }
  }, []);
}

/**
 * Search siswa lengkap (dengan detail) untuk pilihan siswa.
 * Digunakan di form catat.
 */
export interface StudentSuggestion {
  id: string;
  nama: string;
  kelas: string; // nama kelas
  classId: string; // ID kelas untuk relasi
  nis?: string;
}

export function useSearchStudents() {
  return useCallback(async (query: string): Promise<StudentSuggestion[]> => {
    if (query.trim().length < 1) return [];

    try {
      const result = await pb
        .collection(COLLECTIONS.STUDENTS)
        .getList<Student>(1, 10, {
          filter: `nama ~ "${query.trim()}" || nis ~ "${query.trim()}"`,
          sort: "nama",
          expand: "class",
        });

      return result.items.map((s) => ({
        id: s.id,
        nama: s.nama,
        kelas: s.expand?.class?.nama || "",
        classId: s.class,
        nis: s.nis,
      }));
    } catch (err) {
      console.error("Search students error:", err);
      return [];
    }
  }, []);
}