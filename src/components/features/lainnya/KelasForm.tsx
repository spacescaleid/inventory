"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useSettingsStore } from "@/stores/settingsStore";
import type { Kelas } from "@/types";

const kelasSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(1, "Nama kelas wajib diisi")
    .max(20, "Maksimal 20 karakter"),
  tahun_ajaran: z
    .string()
    .trim()
    .min(1, "Tahun ajaran wajib diisi")
    .max(20, "Maksimal 20 karakter"),
});

type KelasFormValues = z.infer<typeof kelasSchema>;

interface KelasFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kelas?: Kelas | null;
  onSubmit: (values: KelasFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export function KelasForm({
  open,
  onOpenChange,
  kelas,
  onSubmit,
  isLoading,
}: KelasFormProps) {
  const isEdit = !!kelas;
  const defaultTahunAjaran = useSettingsStore((s) => s.tahunAjaran);

  const form = useForm<KelasFormValues>({
    resolver: zodResolver(kelasSchema),
    defaultValues: {
      nama: "",
      tahun_ajaran: defaultTahunAjaran,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        nama: kelas?.nama || "",
        tahun_ajaran: kelas?.tahun_ajaran || defaultTahunAjaran,
      });
    }
  }, [open, kelas, defaultTahunAjaran, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl px-4 pb-6 pt-0 sm:max-w-lg sm:mx-auto"
      >
        <div className="mx-auto mt-3 mb-4 h-1 w-8 rounded-full bg-[var(--color-neutral-300)]" />

        <SheetHeader className="text-left">
          <SheetTitle className="text-lg">
            {isEdit ? "Edit Kelas" : "Tambah Kelas"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Ubah detail kelas"
              : "Contoh: VII-A, X IPA 2, XI IPS 1"}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="kelas-nama">
              Nama Kelas{" "}
              <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <Input
              id="kelas-nama"
              placeholder="Contoh: VII-A"
              {...form.register("nama")}
              autoComplete="off"
              aria-invalid={!!form.formState.errors.nama}
            />
            {form.formState.errors.nama && (
              <p className="text-xs text-[var(--color-danger-600)]">
                ⚠ {form.formState.errors.nama.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kelas-tahun">
              Tahun Ajaran{" "}
              <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <Input
              id="kelas-tahun"
              placeholder="Contoh: 2024/2025"
              {...form.register("tahun_ajaran")}
              autoComplete="off"
              aria-invalid={!!form.formState.errors.tahun_ajaran}
            />
            {form.formState.errors.tahun_ajaran && (
              <p className="text-xs text-[var(--color-danger-600)]">
                ⚠ {form.formState.errors.tahun_ajaran.message}
              </p>
            )}
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
                "Tambah Kelas"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}