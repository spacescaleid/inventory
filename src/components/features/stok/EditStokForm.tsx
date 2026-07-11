"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { INPUT_LIMITS } from "@/constants/stok";
import type { StockItem } from "@/types";

const editStokSchema = z.object({
  ukuran: z
    .string()
    .trim()
    .min(1, "Ukuran wajib diisi")
    .max(INPUT_LIMITS.MAX_UKURAN_LENGTH),
  stok: z
    .number({ message: "Stok harus berupa angka" })
    .int("Stok harus bilangan bulat")
    .min(0, "Stok tidak boleh negatif")
    .max(INPUT_LIMITS.MAX_STOK),
  harga: z
    .number()
    .int()
    .min(0)
    .optional(),
});

type EditStokFormValues = z.infer<typeof editStokSchema>;

interface EditStokFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: StockItem | null;
  onSubmit: (values: EditStokFormValues) => Promise<void> | void;
  onDelete?: (item: StockItem) => Promise<void> | void;
  isLoading?: boolean;
  isDeleting?: boolean;
}

export function EditStokForm({
  open,
  onOpenChange,
  item,
  onSubmit,
  onDelete,
  isLoading,
  isDeleting,
}: EditStokFormProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<EditStokFormValues>({
    resolver: zodResolver(editStokSchema),
    defaultValues: {
      ukuran: "",
      stok: 0,
      harga: undefined,
    },
  });

  // Reset form saat item berubah
  useEffect(() => {
    if (item && open) {
      form.reset({
        ukuran: item.ukuran,
        stok: item.stok,
        harga: item.harga || undefined,
      });
    }
  }, [item, open, form]);

  const handleSubmit = async (values: EditStokFormValues) => {
    await onSubmit(values);
  };

  const handleDelete = async () => {
    if (item && onDelete) {
      await onDelete(item);
      setShowDeleteConfirm(false);
    }
  };

  const jenisNama =
    item?.expand?.uniform_type?.nama || "Seragam";

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl px-4 pb-6 pt-0 sm:max-w-lg sm:mx-auto"
        >
          <div className="mx-auto mt-3 mb-4 h-1 w-8 rounded-full bg-[var(--color-neutral-300)]" />

          <SheetHeader className="text-left">
            <SheetTitle className="text-lg">Edit Stok</SheetTitle>
            <SheetDescription>
              {jenisNama} — {item?.ukuran}
            </SheetDescription>
          </SheetHeader>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="edit-ukuran">
                Ukuran <span className="text-[var(--color-danger-500)]">*</span>
              </Label>
              <Input
                id="edit-ukuran"
                placeholder="Contoh: M, XL, 32"
                {...form.register("ukuran")}
                autoComplete="off"
                aria-invalid={!!form.formState.errors.ukuran}
              />
              {form.formState.errors.ukuran && (
                <p className="text-xs text-[var(--color-danger-600)]">
                  {form.formState.errors.ukuran.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-stok">
                Stok Saat Ini{" "}
                <span className="text-[var(--color-danger-500)]">*</span>
              </Label>
              <Input
                id="edit-stok"
                type="number"
                inputMode="numeric"
                min={0}
                {...form.register("stok", { valueAsNumber: true })}
                aria-invalid={!!form.formState.errors.stok}
              />
              {form.formState.errors.stok ? (
                <p className="text-xs text-[var(--color-danger-600)]">
                  {form.formState.errors.stok.message}
                </p>
              ) : (
                <p className="text-xs text-[var(--color-neutral-500)]">
                  Sesuaikan jika stok fisik berbeda dari sistem
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-harga">
                Harga per Unit{" "}
                <span className="text-[var(--color-neutral-400)]">
                  (opsional)
                </span>
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-neutral-500)]">
                  Rp
                </span>
                <Input
                  id="edit-harga"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  className="pl-10"
                  {...form.register("harga", {
                    setValueAs: (v) =>
                      v === "" || v === null ? undefined : Number(v),
                  })}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-mobile"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading || isDeleting}
                  aria-label="Hapus ukuran"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
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
                  "Simpan Perubahan"
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Hapus ukuran ini?"
        description={
          <>
            Ukuran <strong>{item?.ukuran}</strong> untuk {jenisNama} akan
            dihapus permanen. Data riwayat tidak akan hilang.
          </>
        }
        confirmLabel="Ya, Hapus"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}