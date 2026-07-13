"use client";

import { useCallback } from "react";
import pb from "@/lib/pocketbase/client";
import { COLLECTIONS } from "@/lib/pocketbase/collections";
import type { Transaksi, Kelas } from "@/types";

/**
 * Autocomplete untuk nama siswa dari transaksi lama.
 * Format hasil: "Budi Santoso (VII-A)" — biar user bisa auto-fill kelas juga.
 */
export function useAutocompleteNamaSiswa() {
  return useCallback(async (query: string): Promise<string[]> => {
    if (query.trim().length < 1) return [];

    try {
      const q = query.trim();

      // Cari transaksi dengan nama siswa yg match
      const result = await pb
        .collection(COLLECTIONS.TRANSACTIONS)
        .getList<Transaksi>(1, 20, {
          filter: `nama_siswa ~ "${q}"`,
          sort: "-created",
          fields: "id,nama_siswa,kelas,created",
        });

      // Dedupe: satu nama = satu suggestion (ambil kelas terbaru)
      const seen = new Map<string, string>();
      for (const trx of result.items) {
        const key = trx.nama_siswa.toLowerCase();
        if (!seen.has(key)) {
          seen.set(key, `${trx.nama_siswa} (${trx.kelas})`);
        }
      }

      return Array.from(seen.values()).slice(0, 5);
    } catch (err) {
      console.error("Autocomplete siswa error:", err);
      return [];
    }
  }, []);
}

/**
 * Autocomplete untuk kelas — dari master data kelas + transaksi lama.
 */
export function useAutocompleteKelas() {
  return useCallback(async (query: string): Promise<string[]> => {
    if (query.trim().length < 1) return [];

    try {
      const q = query.trim();

      // Fetch dari kedua source: classes master + transactions
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

      // Dedupe
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