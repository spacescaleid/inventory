"use client";

import { Loader2, Plus, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ImportSiswaModal } from "@/components/features/siswa/ImportSiswaModal";
import { SiswaForm } from "@/components/features/siswa/SiswaForm";
import { SiswaList } from "@/components/features/siswa/SiswaList";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { CustomSelect, type SelectOption } from "@/components/shared/CustomSelect";
import { ErrorState } from "@/components/shared/ErrorState";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useClasses } from "@/hooks/useKelas";
import {
  useCreateStudent,
  useDeleteStudent,
  useStudents,
  useUpdateStudent,
} from "@/hooks/useSiswa";
import { parsePocketBaseError } from "@/lib/pocketbase/api";
import type { Student, StudentInput } from "@/types";

export default function KelolaSiswaPage() {
  const { isAdmin } = useAuth({ required: true });

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>("");

  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<Student | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [siswaToDelete, setSiswaToDelete] = useState<Student | null>(null);

  const { data: classes } = useClasses();
  const {
    data: siswaList,
    isLoading,
    error,
    refetch,
  } = useStudents({
    search,
    classId: classFilter || undefined,
  });

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  const classOptions = useMemo<SelectOption[]>(
    () => [
      { value: "", label: "Semua Kelas" },
      ...(classes ?? []).map((k) => ({
        value: k.id,
        label: k.nama,
        description: `TA ${k.tahun_ajaran}`,
      })),
    ],
    [classes]
  );

  const handleAdd = () => {
    setSelectedSiswa(null);
    setFormOpen(true);
  };

  const handleEdit = (siswa: Student) => {
    setSelectedSiswa(siswa);
    setFormOpen(true);
  };

  const handleDelete = (siswa: Student) => {
    setSiswaToDelete(siswa);
    setDeleteConfirmOpen(true);
  };

  const handleSubmit = async (values: StudentInput) => {
    try {
      if (selectedSiswa) {
        await updateMutation.mutateAsync({
          id: selectedSiswa.id,
          input: values,
        });
        toast.success("✓ Data siswa berhasil diperbarui");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("✓ Siswa berhasil ditambahkan");
      }
      setFormOpen(false);
    } catch (err) {
      toast.error("Gagal menyimpan siswa", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!siswaToDelete) return;
    try {
      await deleteMutation.mutateAsync(siswaToDelete.id);
      toast.success("✓ Siswa berhasil dihapus");
      setDeleteConfirmOpen(false);
      setSiswaToDelete(null);
    } catch (err) {
      toast.error("Gagal menghapus siswa", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <TopAppBar
        title="Kelola Siswa"
        showBack
        rightSlot={
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setImportOpen(true)}
              className="gap-1"
              aria-label="Import Excel"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button size="sm" onClick={handleAdd} className="gap-1">
              <Plus className="h-4 w-4" />
              Tambah
            </Button>
          </div>
        }
      />

      <div className="space-y-4 px-4 py-4">
        <p className="px-1 text-xs text-[var(--color-neutral-500)]">
          Daftar siswa untuk mempermudah pencatatan. Bisa{" "}
          <strong>import banyak siswa sekaligus</strong> dari Excel/CSV.
          {!isAdmin && " Hubungi admin untuk menghapus."}
        </p>

        <div className="space-y-3">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Cari nama atau NIS..."
          />

          <CustomSelect
            value={classFilter}
            onChange={setClassFilter}
            options={classOptions}
            placeholder="Filter kelas"
          />
        </div>

        <div className="px-1 text-xs text-[var(--color-neutral-500)]">
          Total{" "}
          <strong className="text-[var(--color-neutral-700)]">
            {siswaList?.length ?? 0}
          </strong>{" "}
          siswa
        </div>

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
          <SiswaList
            siswaList={siswaList ?? []}
            onEdit={handleEdit}
            onDelete={isAdmin ? handleDelete : undefined}
            onAdd={handleAdd}
            groupByClass={!classFilter}
          />
        )}
      </div>

      <SiswaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        siswa={selectedSiswa}
        defaultClassId={classFilter || undefined}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />

      <ImportSiswaModal open={importOpen} onOpenChange={setImportOpen} />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Hapus siswa ini?"
        description={
          <>
            Siswa <strong>{siswaToDelete?.nama}</strong> akan dihapus dari
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