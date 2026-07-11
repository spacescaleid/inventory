"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { KelasForm } from "@/components/features/lainnya/KelasForm";
import { KelasList } from "@/components/features/lainnya/KelasList";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { Kelas } from "@/types";

const mockKelasData: Kelas[] = [
  {
    id: "kls-1",
    collectionId: "mock",
    collectionName: "classes",
    nama: "VII-A",
    tahun_ajaran: "2024/2025",
    created: "2025-01-15T10:00:00.000Z",
    updated: "2025-01-15T10:00:00.000Z",
  },
  {
    id: "kls-2",
    collectionId: "mock",
    collectionName: "classes",
    nama: "VII-B",
    tahun_ajaran: "2024/2025",
    created: "2025-01-15T10:00:00.000Z",
    updated: "2025-01-15T10:00:00.000Z",
  },
  {
    id: "kls-3",
    collectionId: "mock",
    collectionName: "classes",
    nama: "VIII-A",
    tahun_ajaran: "2024/2025",
    created: "2025-01-15T10:00:00.000Z",
    updated: "2025-01-15T10:00:00.000Z",
  },
  {
    id: "kls-4",
    collectionId: "mock",
    collectionName: "classes",
    nama: "IX-B",
    tahun_ajaran: "2024/2025",
    created: "2025-01-15T10:00:00.000Z",
    updated: "2025-01-15T10:00:00.000Z",
  },
];

export default function AdminKelasPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [kelasToDelete, setKelasToDelete] = useState<Kelas | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      console.log(selectedKelas ? "Update:" : "Create:", values);
      await new Promise((r) => setTimeout(r, 500));
      toast.success(
        selectedKelas
          ? "✓ Kelas berhasil diperbarui"
          : "✓ Kelas berhasil ditambahkan"
      );
      setFormOpen(false);
    } catch {
      toast.error("Gagal menyimpan kelas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!kelasToDelete) return;
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      toast.success("✓ Kelas berhasil dihapus");
      setDeleteConfirmOpen(false);
      setKelasToDelete(null);
    } catch {
      toast.error("Gagal menghapus kelas");
    } finally {
      setIsLoading(false);
    }
  };

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
        </p>

        <KelasList
          kelasList={mockKelasData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </div>

      <KelasForm
        open={formOpen}
        onOpenChange={setFormOpen}
        kelas={selectedKelas}
        onSubmit={handleSubmit}
        isLoading={isLoading}
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
        isLoading={isLoading}
        variant="danger"
      />
    </>
  );
}