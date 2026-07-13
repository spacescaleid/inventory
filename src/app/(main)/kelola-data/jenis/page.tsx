"use client";

import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { JenisForm } from "@/components/features/lainnya/JenisForm";
import { JenisList } from "@/components/features/lainnya/JenisList";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import {
  useCreateUniformType,
  useDeleteUniformType,
  useUniformTypes,
  useUpdateUniformType,
} from "@/hooks/useJenis";
import { parsePocketBaseError } from "@/lib/pocketbase/api";
import type { JenisSeragam } from "@/types";

export default function KelolaJenisPage() {
  const { isAdmin } = useAuth({ required: true });

  const [formOpen, setFormOpen] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState<JenisSeragam | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jenisToDelete, setJenisToDelete] = useState<JenisSeragam | null>(null);

  const { data: kategoris } = useCategories();
  const {
    data: jenisList,
    isLoading,
    error,
    refetch,
  } = useUniformTypes();

  const createMutation = useCreateUniformType();
  const updateMutation = useUpdateUniformType();
  const deleteMutation = useDeleteUniformType();

  const handleAdd = () => {
    setSelectedJenis(null);
    setFormOpen(true);
  };

  const handleEdit = (jenis: JenisSeragam) => {
    setSelectedJenis(jenis);
    setFormOpen(true);
  };

  const handleDelete = (jenis: JenisSeragam) => {
    setJenisToDelete(jenis);
    setDeleteConfirmOpen(true);
  };

  const handleSubmit = async (values: {
    category: string;
    nama: string;
  }) => {
    try {
      if (selectedJenis) {
        await updateMutation.mutateAsync({
          id: selectedJenis.id,
          input: values,
        });
        toast.success("✓ Jenis berhasil diperbarui");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("✓ Jenis berhasil ditambahkan");
      }
      setFormOpen(false);
    } catch (err) {
      toast.error("Gagal menyimpan jenis", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!jenisToDelete) return;
    try {
      await deleteMutation.mutateAsync(jenisToDelete.id);
      toast.success("✓ Jenis berhasil dihapus");
      setDeleteConfirmOpen(false);
      setJenisToDelete(null);
    } catch (err) {
      toast.error("Gagal menghapus jenis", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <TopAppBar
        title="Jenis Seragam"
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
          Jenis seragam di dalam setiap kategori (Baju, Celana, Rok, Topi).
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
          <JenisList
            jenisList={jenisList ?? []}
            kategoris={kategoris ?? []}
            onEdit={handleEdit}
            onDelete={isAdmin ? handleDelete : undefined}
            onAdd={handleAdd}
          />
        )}
      </div>

      <JenisForm
        open={formOpen}
        onOpenChange={setFormOpen}
        jenis={selectedJenis}
        kategoris={kategoris ?? []}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Hapus jenis ini?"
        description={
          <>
            Jenis <strong>{jenisToDelete?.nama}</strong> akan dihapus beserta
            semua ukuran & stoknya.
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