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
import { INPUT_LIMITS } from "@/constants/stok";
import type { JenisSeragam } from "@/types";

const tambahStokSchema = z.object({
  ukuran: z
    .string()
    .trim()
    .min(1, "Ukuran wajib diisi")
    .max(
      INPUT_LIMITS.MAX_UKURAN_LENGTH,
      `Maksimal ${INPUT_LIMITS.MAX_UKURAN_LENGTH} karakter`
    ),
  jumlah: z
    .number({ message: "Jumlah harus berupa angka" })
    .int("Jumlah harus bilangan bulat")
    .min(1, "Minimal 1 unit")
    .max(INPUT_LIMITS.MAX_STOK, `Maksimal ${INPUT_LIMITS.MAX_STOK} unit`),
  harga: z
    .number({ message: "Harga harus berupa angka" })
    .int("Harga harus bilangan bulat")
    .min(0, "Harga tidak boleh negatif")
    .optional(),
});

type TambahStokFormValues = z.infer<typeof tambahStokSchema>;

interface TambahStokFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jenis: JenisSeragam | null;
  onSubmit: (values: TambahStokFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export function TambahStokForm({
  open,
  onOpenChange,
  jenis,
  onSubmit,
  isLoading,
}: TambahStokFormProps) {
  const form = useForm<TambahStokFormValues>({
    resolver: zodResolver(tambahStokSchema),
    defaultValues: {
      ukuran: "",
      jumlah: 1,
      harga: undefined,
    },
  });

  // Reset form saat sheet dibuka/ditutup
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const handleSubmit = async (values: TambahStokFormValues) => {
    await onSubmit(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl px-4 pb-6 pt-0 sm:max-w-lg sm:mx-auto"
      >
        {/* Drag handle */}
        <div className="mx-auto mt-3 mb-4 h-1 w-8 rounded-full bg-[var(--color-neutral-300)]" />

        <SheetHeader className="text-left">
          <SheetTitle className="text-lg">Tambah Stok</SheetTitle>
          <SheetDescription>
            {jenis
              ? `Tambah ukuran & jumlah untuk ${jenis.nama}`
              : "Isi detail stok baru"}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 space-y-4"
        >
          {/* Ukuran */}
          <div className="space-y-1.5">
            <Label htmlFor="ukuran">
              Ukuran <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <Input
              id="ukuran"
              placeholder="Contoh: M, XL, 32, 6.5"
              {...form.register("ukuran")}
              autoComplete="off"
              aria-invalid={!!form.formState.errors.ukuran}
            />
            {form.formState.errors.ukuran ? (
              <p className="text-xs text-[var(--color-danger-600)]">
                {form.formState.errors.ukuran.message}
              </p>
            ) : (
              <p className="text-xs text-[var(--color-neutral-500)]">
                Bebas: huruf (M, XL) atau angka (32, 36)
              </p>
            )}
          </div>

          {/* Jumlah */}
          <div className="space-y-1.5">
            <Label htmlFor="jumlah">
              Jumlah <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <Input
              id="jumlah"
              type="number"
              inputMode="numeric"
              placeholder="0"
              min={1}
              max={INPUT_LIMITS.MAX_STOK}
              {...form.register("jumlah", { valueAsNumber: true })}
              aria-invalid={!!form.formState.errors.jumlah}
            />
            {form.formState.errors.jumlah && (
              <p className="text-xs text-[var(--color-danger-600)]">
                {form.formState.errors.jumlah.message}
              </p>
            )}
          </div>

          {/* Harga (opsional) */}
          <div className="space-y-1.5">
            <Label htmlFor="harga">
              Harga per Unit{" "}
              <span className="text-[var(--color-neutral-400)]">(opsional)</span>
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-neutral-500)]">
                Rp
              </span>
              <Input
                id="harga"
                type="number"
                inputMode="numeric"
                placeholder="0"
                min={0}
                className="pl-10"
                {...form.register("harga", {
                  setValueAs: (v) =>
                    v === "" || v === null ? undefined : Number(v),
                })}
                aria-invalid={!!form.formState.errors.harga}
              />
            </div>
            {form.formState.errors.harga && (
              <p className="text-xs text-[var(--color-danger-600)]">
                {form.formState.errors.harga.message}
              </p>
            )}
          </div>

          {/* Actions */}
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
              ) : (
                "Simpan Stok"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}