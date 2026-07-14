"use client";

import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { KategoriForm } from "@/components/features/lainnya/KategoriForm";
import { KategoriList } from "@/components/features/lainnya/KategoriList";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/useCategories";
import { parsePocketBaseError } from "@/lib/pocketbase/api";
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

  const { data: kategoris, isLoading, error, refetch } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

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
    try {
      if (selectedKategori) {
        await updateMutation.mutateAsync({
          id: selectedKategori.id,
          input: values,
        });
        toast.success("✓ Kategori berhasil diperbarui");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("✓ Kategori berhasil ditambahkan");
      }
      setFormOpen(false);
    } catch (err) {
      toast.error("Gagal menyimpan kategori", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!kategoriToDelete) return;
    try {
      await deleteMutation.mutateAsync(kategoriToDelete.id);
      toast.success("✓ Kategori berhasil dihapus");
      setDeleteConfirmOpen(false);
      setKategoriToDelete(null);
    } catch (err) {
      toast.error("Gagal menghapus kategori", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

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

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary-500)]" />
          </div>
        ) : error ? (
          <ErrorState
            description={parsePocketBaseError(error)}
            onRetry={() => refetch()}
          />
        ) : (
          <KategoriList
            kategoris={kategoris ?? []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        )}
      </div>

      <KategoriForm
        open={formOpen}
        onOpenChange={setFormOpen}
        kategori={selectedKategori}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
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
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}