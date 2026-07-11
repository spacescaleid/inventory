"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { JenisForm } from "@/components/features/lainnya/JenisForm";
import { JenisList } from "@/components/features/lainnya/JenisList";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { mockJenis, mockKategoris } from "@/lib/mock-data";
import type { JenisSeragam } from "@/types";

export default function AdminJenisPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState<JenisSeragam | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jenisToDelete, setJenisToDelete] = useState<JenisSeragam | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      console.log(selectedJenis ? "Update:" : "Create:", values);
      await new Promise((r) => setTimeout(r, 500));
      toast.success(
        selectedJenis
          ? "✓ Jenis berhasil diperbarui"
          : "✓ Jenis berhasil ditambahkan"
      );
      setFormOpen(false);
    } catch {
      toast.error("Gagal menyimpan jenis");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!jenisToDelete) return;
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      toast.success("✓ Jenis berhasil dihapus");
      setDeleteConfirmOpen(false);
      setJenisToDelete(null);
    } catch {
      toast.error("Gagal menghapus jenis");
    } finally {
      setIsLoading(false);
    }
  };

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
        </p>

        <JenisList
          jenisList={mockJenis}
          kategoris={mockKategoris}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </div>

      <JenisForm
        open={formOpen}
        onOpenChange={setFormOpen}
        jenis={selectedJenis}
        kategoris={mockKategoris}
        onSubmit={handleSubmit}
        isLoading={isLoading}
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
        isLoading={isLoading}
        variant="danger"
      />
    </>
  );
}