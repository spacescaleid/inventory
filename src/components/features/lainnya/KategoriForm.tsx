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
import type { Kategori } from "@/types";

const kategoriSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(1, "Nama kategori wajib diisi")
    .max(50, "Maksimal 50 karakter"),
  urutan: z.number().int().min(0).max(999).optional(),
});

type KategoriFormValues = z.infer<typeof kategoriSchema>;

interface KategoriFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kategori?: Kategori | null;
  onSubmit: (values: KategoriFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export function KategoriForm({
  open,
  onOpenChange,
  kategori,
  onSubmit,
  isLoading,
}: KategoriFormProps) {
  const isEdit = !!kategori;

  const form = useForm<KategoriFormValues>({
    resolver: zodResolver(kategoriSchema),
    defaultValues: {
      nama: "",
      urutan: 0,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        nama: kategori?.nama || "",
        urutan: kategori?.urutan || 0,
      });
    }
  }, [open, kategori, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl px-4 pb-6 pt-0 sm:max-w-lg sm:mx-auto"
      >
        <div className="mx-auto mt-3 mb-4 h-1 w-8 rounded-full bg-[var(--color-neutral-300)]" />

        <SheetHeader className="text-left">
          <SheetTitle className="text-lg">
            {isEdit ? "Edit Kategori" : "Tambah Kategori"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Ubah detail kategori seragam"
              : "Buat kategori baru untuk seragam"}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="kategori-nama">
              Nama Kategori{" "}
              <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <Input
              id="kategori-nama"
              placeholder="Contoh: Seragam Harian"
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
            <Label htmlFor="kategori-urutan">
              Urutan Tampilan{" "}
              <span className="text-[var(--color-neutral-400)]">
                (opsional)
              </span>
            </Label>
            <Input
              id="kategori-urutan"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="0"
              {...form.register("urutan", { valueAsNumber: true })}
            />
            <p className="text-xs text-[var(--color-neutral-500)]">
              Angka lebih kecil tampil lebih dulu
            </p>
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
                "Tambah Kategori"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}