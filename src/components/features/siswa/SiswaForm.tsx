"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CustomSelect, type SelectOption } from "@/components/shared/CustomSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useClasses } from "@/hooks/useKelas";
import { normalizeNama } from "@/utils/format";
import type { Student } from "@/types";

const siswaSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(1, "Nama siswa wajib diisi")
    .max(100, "Maksimal 100 karakter"),
  class: z.string().min(1, "Kelas wajib dipilih"),
  nis: z.string().trim().max(20).optional(),
  catatan: z.string().trim().max(200).optional(),
});

type SiswaFormValues = z.infer<typeof siswaSchema>;

interface SiswaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siswa?: Student | null;
  defaultClassId?: string;
  defaultNama?: string;
  onSubmit: (values: SiswaFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export function SiswaForm({
  open,
  onOpenChange,
  siswa,
  defaultClassId,
  defaultNama,
  onSubmit,
  isLoading,
}: SiswaFormProps) {
  const isEdit = !!siswa;
  const { data: classes } = useClasses();

  const form = useForm<SiswaFormValues>({
    resolver: zodResolver(siswaSchema),
    defaultValues: {
      nama: "",
      class: "",
      nis: "",
      catatan: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        nama: siswa?.nama || defaultNama || "",
        class: siswa?.class || defaultClassId || "",
        nis: siswa?.nis || "",
        catatan: siswa?.catatan || "",
      });
    }
  }, [open, siswa, defaultClassId, defaultNama, form]);

  const classOptions = useMemo<SelectOption[]>(
    () =>
      (classes ?? []).map((k) => ({
        value: k.id,
        label: k.nama,
        description: `Tahun Ajaran ${k.tahun_ajaran}`,
      })),
    [classes]
  );

  const handleSubmit = async (values: SiswaFormValues) => {
    await onSubmit({
      ...values,
      nama: normalizeNama(values.nama),
    });
  };

  const classValue = form.watch("class");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-2xl px-4 pb-6 pt-0 sm:max-w-lg sm:mx-auto"
      >
        <div className="mx-auto mt-3 mb-4 h-1 w-8 rounded-full bg-[var(--color-neutral-300)]" />

        <SheetHeader className="text-left">
          <SheetTitle className="text-lg">
            {isEdit ? "Edit Data Siswa" : "Tambah Siswa Baru"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? `Ubah informasi ${siswa.nama}`
              : "Isi data siswa baru untuk memudahkan pencatatan"}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="siswa-nama">
              Nama Lengkap{" "}
              <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <Input
              id="siswa-nama"
              placeholder="Contoh: Budi Santoso"
              {...form.register("nama")}
              autoComplete="off"
              aria-invalid={!!form.formState.errors.nama}
            />
            {form.formState.errors.nama ? (
              <p className="text-xs text-[var(--color-danger-600)]">
                ⚠ {form.formState.errors.nama.message}
              </p>
            ) : (
              <p className="text-xs text-[var(--color-neutral-500)]">
                Nama akan otomatis di-format (Title Case)
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="siswa-kelas">
              Kelas <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <CustomSelect
              id="siswa-kelas"
              value={classValue}
              onChange={(v) => form.setValue("class", v)}
              options={classOptions}
              placeholder="Pilih kelas"
              aria-invalid={!!form.formState.errors.class}
              emptyMessage="Belum ada kelas. Tambah di menu Kelas."
            />
            {form.formState.errors.class && (
              <p className="text-xs text-[var(--color-danger-600)]">
                ⚠ {form.formState.errors.class.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="siswa-nis">
              NIS{" "}
              <span className="text-[var(--color-neutral-400)]">(opsional)</span>
            </Label>
            <Input
              id="siswa-nis"
              placeholder="Nomor Induk Siswa"
              {...form.register("nis")}
              autoComplete="off"
              maxLength={20}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="siswa-catatan">
              Catatan{" "}
              <span className="text-[var(--color-neutral-400)]">(opsional)</span>
            </Label>
            <textarea
              id="siswa-catatan"
              placeholder="Contoh: Alergi bahan tertentu, dll"
              rows={2}
              maxLength={200}
              {...form.register("catatan")}
              className="w-full rounded-md border border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] px-3 py-2 text-sm text-[var(--color-neutral-800)] placeholder:text-[var(--color-neutral-400)] transition-colors focus:border-[var(--color-primary-500)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="mobile"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="mobile"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : isEdit ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Siswa"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}