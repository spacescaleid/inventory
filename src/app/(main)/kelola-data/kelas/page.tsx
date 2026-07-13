"use client";

import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { KelasForm } from "@/components/features/lainnya/KelasForm";
import { KelasList } from "@/components/features/lainnya/KelasList";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  useClasses,
  useCreateClass,
  useDeleteClass,
  useUpdateClass,
} from "@/hooks/useKelas";
import { parsePocketBaseError } from "@/lib/pocketbase/api";
import type { Kelas } from "@/types";

export default function KelolaKelasPage() {
  const { isAdmin } = useAuth({ required: true });

  const [formOpen, setFormOpen] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [kelasToDelete, setKelasToDelete] = useState<Kelas | null>(null);

  const { data: kelasList, isLoading, error, refetch } = useClasses();
  const createMutation = useCreateClass();
  const updateMutation = useUpdateClass();
  const deleteMutation = useDeleteClass();

  const handleAdd = () => {
    setSelectedKelas(null);
    setFormOpen(true);
  };

  const handleEdit = (kelas: Kelas) => {
    setSelectedKelas(kelas);
    setFormOpen(true);
  };

  const handleDelete = (kelas: Kelas) => {
    setKelasToDelete(kelas);
    setDeleteConfirmOpen(true);
  };

  const handleSubmit = async (values: {
    nama: string;
    tahun_ajaran: string;
  }) => {
    try {
      if (selectedKelas) {
        await updateMutation.mutateAsync({
          id: selectedKelas.id,
          input: values,
        });
        toast.success("✓ Kelas berhasil diperbarui");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("✓ Kelas berhasil ditambahkan");
      }
      setFormOpen(false);
    } catch (err) {
      toast.error("Gagal menyimpan kelas", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!kelasToDelete) return;
    try {
      await deleteMutation.mutateAsync(kelasToDelete.id);
      toast.success("✓ Kelas berhasil dihapus");
      setDeleteConfirmOpen(false);
      setKelasToDelete(null);
    } catch (err) {
      toast.error("Gagal menghapus kelas", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <TopAppBar
        title="Kelas"
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
          Daftar kelas untuk autocomplete pencatatan.
          {!isAdmin && " Hubungi admin untuk menghapus."}
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
          <KelasList
            kelasList={kelasList ?? []}
            onEdit={handleEdit}
            onDelete={isAdmin ? handleDelete : undefined}
            onAdd={handleAdd}
          />
        )}
      </div>

      <KelasForm
        open={formOpen}
        onOpenChange={setFormOpen}
        kelas={selectedKelas}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Hapus kelas ini?"
        description={
          <>
            Kelas <strong>{kelasToDelete?.nama}</strong> akan dihapus dari
            daftar.
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