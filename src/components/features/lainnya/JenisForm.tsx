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
import type { JenisSeragam, Kategori } from "@/types";

const jenisSchema = z.object({
  category: z.string().min(1, "Kategori wajib dipilih"),
  nama: z
    .string()
    .trim()
    .min(1, "Nama jenis wajib diisi")
    .max(50, "Maksimal 50 karakter"),
});

type JenisFormValues = z.infer<typeof jenisSchema>;

interface JenisFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jenis?: JenisSeragam | null;
  kategoris: Kategori[];
  onSubmit: (values: JenisFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export function JenisForm({
  open,
  onOpenChange,
  jenis,
  kategoris,
  onSubmit,
  isLoading,
}: JenisFormProps) {
  const isEdit = !!jenis;

  const form = useForm<JenisFormValues>({
    resolver: zodResolver(jenisSchema),
    defaultValues: {
      category: "",
      nama: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        category: jenis?.category || "",
        nama: jenis?.nama || "",
      });
    }
  }, [open, jenis, form]);

  const categoryValue = form.watch("category");

  const kategoriOptions = useMemo<SelectOption[]>(
    () =>
      kategoris.map((k) => ({
        value: k.id,
        label: k.nama,
      })),
    [kategoris]
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl px-4 pb-6 pt-0 sm:max-w-lg sm:mx-auto"
      >
        <div className="mx-auto mt-3 mb-4 h-1 w-8 rounded-full bg-[var(--color-neutral-300)]" />

        <SheetHeader className="text-left">
          <SheetTitle className="text-lg">
            {isEdit ? "Edit Jenis Seragam" : "Tambah Jenis Seragam"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Ubah detail jenis seragam"
              : "Contoh: Baju Atasan, Celana Panjang, Rok"}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="jenis-kategori">
              Kategori <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <CustomSelect
              id="jenis-kategori"
              value={categoryValue}
              onChange={(v) => form.setValue("category", v)}
              options={kategoriOptions}
              placeholder="Pilih kategori"
              aria-invalid={!!form.formState.errors.category}
            />
            {form.formState.errors.category && (
              <p className="text-xs text-[var(--color-danger-600)]">
                ⚠ {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="jenis-nama">
              Nama Jenis{" "}
              <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <Input
              id="jenis-nama"
              placeholder="Contoh: Baju Atasan"
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
                "Tambah Jenis"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}