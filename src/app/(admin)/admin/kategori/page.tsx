"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { KategoriForm } from "@/components/features/lainnya/KategoriForm";
import { KategoriList } from "@/components/features/lainnya/KategoriList";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { mockKategoris } from "@/lib/mock-data";
import type { Kategori } from "@/types";

export default function AdminKategoriPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState<Kategori | null>(
    null
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [kategoriToDelete, setKategoriToDelete] = useState<Kategori | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const kategoris = mockKategoris;

  const handleAdd = () => {
    setSelectedKategori(null);
    setFormOpen(true);
  };

  const handleEdit = (kategori: Kategori) => {
    setSelectedKategori(kategori);
    setFormOpen(true);
  };

  const handleDelete = (kategori: Kategori) => {
    setKategoriToDelete(kategori);
    setDeleteConfirmOpen(true);
  };

  const handleSubmit = async (values: { nama: string; urutan?: number }) => {
    setIsLoading(true);
    try {
      console.log(selectedKategori ? "Update:" : "Create:", values);
      await new Promise((r) => setTimeout(r, 500));
      toast.success(
        selectedKategori
          ? "✓ Kategori berhasil diperbarui"
          : "✓ Kategori berhasil ditambahkan"
      );
      setFormOpen(false);
    } catch {
      toast.error("Gagal menyimpan kategori");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!kategoriToDelete) return;
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      toast.success("✓ Kategori berhasil dihapus");
      setDeleteConfirmOpen(false);
      setKategoriToDelete(null);
    } catch {
      toast.error("Gagal menghapus kategori");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TopAppBar
        title="Kategori Seragam"
        showBack
        rightSlot={
          <Button size="sm" onClick={handleAdd} className="gap-1">
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        }
      />

      <div className="space-y-4 px-4 py-4">
        <p className="px-1 text-xs text-[var(--color-neutral-500)]">
          Kelompok utama seragam (contoh: Harian, Olahraga, Pramuka).
        </p>

        <KategoriList
          kategoris={kategoris}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </div>

      <KategoriForm
        open={formOpen}
        onOpenChange={setFormOpen}
        kategori={selectedKategori}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Hapus kategori ini?"
        description={
          <>
            Kategori <strong>{kategoriToDelete?.nama}</strong> akan dihapus.
            Semua jenis seragam & stok di dalamnya juga akan terpengaruh.
          </>
        }
        confirmLabel="Ya, Hapus"
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
        variant="danger"
      />
    </>
  );
}