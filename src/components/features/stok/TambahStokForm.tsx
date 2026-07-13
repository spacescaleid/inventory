"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Package } from "lucide-react";
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
import { INPUT_LIMITS } from "@/constants/stok";
import { useStockItemsByJenis } from "@/hooks/useStok";
import { normalizeUkuran } from "@/utils/format";
import type { JenisSeragam } from "@/types";

const tambahStokSchema = z.object({
  jenisId: z.string().min(1, "Jenis seragam wajib dipilih"),
  ukuran: z
    .string()
    .trim()
    .min(1, "Ukuran wajib diisi")
    .max(INPUT_LIMITS.MAX_UKURAN_LENGTH),
  jumlah: z
    .number({ message: "Jumlah harus berupa angka" })
    .int()
    .min(1, "Minimal 1 unit")
    .max(INPUT_LIMITS.MAX_STOK),
  harga: z.number().int().min(0).optional(),
});

type TambahStokFormValues = z.infer<typeof tambahStokSchema>;

interface TambahStokFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jenis: JenisSeragam | null;
  jenisList?: JenisSeragam[];
  onSubmit: (values: {
    jenisId: string;
    ukuran: string;
    jumlah: number;
    harga?: number;
  }) => Promise<void> | void;
  isLoading?: boolean;
}

export function TambahStokForm({
  open,
  onOpenChange,
  jenis,
  jenisList = [],
  onSubmit,
  isLoading,
}: TambahStokFormProps) {
  const form = useForm<TambahStokFormValues>({
    resolver: zodResolver(tambahStokSchema),
    defaultValues: {
      jenisId: "",
      ukuran: "",
      jumlah: 1,
      harga: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        jenisId: jenis?.id ?? "",
        ukuran: "",
        jumlah: 1,
        harga: undefined,
      });
    }
  }, [open, jenis, form]);

  const handleSubmit = async (values: TambahStokFormValues) => {
    await onSubmit(values);
  };

  const jenisIdValue = form.watch("jenisId");
  const ukuranValue = form.watch("ukuran");
  const jumlahValue = form.watch("jumlah");
  const showJenisSelect = !jenis && jenisList.length > 0;

  const { data: existingItems } = useStockItemsByJenis(jenisIdValue);

  const ukuranPreview = ukuranValue ? normalizeUkuran(ukuranValue) : "";
  const existingItem = useMemo(() => {
    if (!ukuranPreview || !existingItems) return null;
    return existingItems.find((item) => item.ukuran === ukuranPreview) ?? null;
  }, [ukuranPreview, existingItems]);

  const showCaseHint =
    ukuranValue && ukuranValue !== ukuranPreview && ukuranValue.length > 0;

  // Options untuk jenis
  const jenisOptions = useMemo<SelectOption[]>(
    () =>
      jenisList.map((j) => ({
        value: j.id,
        label: j.expand?.category?.nama
          ? `${j.expand.category.nama} — ${j.nama}`
          : j.nama,
      })),
    [jenisList]
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-2xl px-4 pb-6 pt-0 sm:max-w-lg sm:mx-auto"
      >
        <div className="mx-auto mt-3 mb-4 h-1 w-8 rounded-full bg-[var(--color-neutral-300)]" />

        <SheetHeader className="text-left">
          <SheetTitle className="text-lg">Tambah Stok</SheetTitle>
          <SheetDescription>
            {jenis
              ? `Tambah ukuran & jumlah untuk ${jenis.nama}`
              : "Pilih jenis dan isi detail stok baru"}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 space-y-4"
        >
          {showJenisSelect && (
            <div className="space-y-1.5">
              <Label htmlFor="jenisId">
                Jenis Seragam{" "}
                <span className="text-[var(--color-danger-500)]">*</span>
              </Label>
              <CustomSelect
                id="jenisId"
                value={jenisIdValue}
                onChange={(v) => form.setValue("jenisId", v)}
                options={jenisOptions}
                placeholder="Pilih jenis seragam"
                aria-invalid={!!form.formState.errors.jenisId}
              />
              {form.formState.errors.jenisId && (
                <p className="text-xs text-[var(--color-danger-600)]">
                  ⚠ {form.formState.errors.jenisId.message}
                </p>
              )}
            </div>
          )}

          {jenis && (
            <div className="rounded-lg bg-[var(--color-neutral-100)] px-3 py-2 text-xs text-[var(--color-neutral-600)]">
              Menambah stok untuk:{" "}
              <strong className="text-[var(--color-neutral-800)]">
                {jenis.nama}
              </strong>
            </div>
          )}

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
              className="uppercase"
              style={{ textTransform: "uppercase" }}
            />
            {form.formState.errors.ukuran ? (
              <p className="text-xs text-[var(--color-danger-600)]">
                ⚠ {form.formState.errors.ukuran.message}
              </p>
            ) : showCaseHint ? (
              <p className="text-xs text-[var(--color-info-600)]">
                💡 Akan disimpan sebagai:{" "}
                <strong className="font-mono">{ukuranPreview}</strong>
              </p>
            ) : (
              <p className="text-xs text-[var(--color-neutral-500)]">
                Otomatis huruf besar. Bebas: huruf (M, XL) atau angka (32, 36)
              </p>
            )}
          </div>

          {existingItem && (
            <div className="flex items-start gap-2 rounded-lg border border-[var(--color-info-200)] bg-[var(--color-info-50)] p-3">
              <Package className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-info-600)]" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[var(--color-info-700)]">
                  Ukuran {ukuranPreview} sudah ada (stok: {existingItem.stok})
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-info-600)]">
                  Jumlah baru akan{" "}
                  <strong>ditambahkan ke stok yang ada</strong>. Total menjadi:{" "}
                  <strong className="font-mono">
                    {existingItem.stok + (jumlahValue || 0)} unit
                  </strong>
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="jumlah">
              Jumlah {existingItem ? "yang Diterima" : ""}{" "}
              <span className="text-[var(--color-danger-500)]">*</span>
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
                ⚠ {form.formState.errors.jumlah.message}
              </p>
            )}
          </div>

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
                placeholder={existingItem?.harga ? String(existingItem.harga) : "0"}
                min={0}
                className="pl-10"
                {...form.register("harga", {
                  setValueAs: (v) =>
                    v === "" || v === null ? undefined : Number(v),
                })}
                aria-invalid={!!form.formState.errors.harga}
              />
            </div>
            {existingItem?.harga && (
              <p className="text-xs text-[var(--color-neutral-500)]">
                Harga saat ini: Rp {existingItem.harga.toLocaleString("id-ID")}.
                Kosongkan untuk tetap.
              </p>
            )}
            {form.formState.errors.harga && (
              <p className="text-xs text-[var(--color-danger-600)]">
                ⚠ {form.formState.errors.harga.message}
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
              ) : existingItem ? (
                "Tambahkan ke Stok"
              ) : (
                "Simpan Stok Baru"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}