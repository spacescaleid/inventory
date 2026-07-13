"use client";

import { AlertCircle, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { CustomSelect, type SelectOption } from "@/components/shared/CustomSelect";
import { StepperInput } from "@/components/shared/StepperInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hooks/useCategories";
import { useUniformTypes } from "@/hooks/useJenis";
import { useStockItemsByJenis } from "@/hooks/useStok";
import type { CatatItemInput } from "@/stores/catatStore";
import { getStokStatus } from "@/utils/stok";
import { cn } from "@/utils/cn";

interface ItemSeragamRowProps {
  item: CatatItemInput;
  index: number;
  onUpdate: (id: string, patch: Partial<CatatItemInput>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function ItemSeragamRow({
  item,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: ItemSeragamRowProps) {
  const { data: categories } = useCategories();
  const { data: allJenis } = useUniformTypes();
  const { data: stockItems } = useStockItemsByJenis(item.jenisId || "");

  // Options untuk kategori
  const kategoriOptions = useMemo<SelectOption[]>(
    () =>
      (categories ?? []).map((k) => ({
        value: k.id,
        label: k.nama,
      })),
    [categories]
  );

  // Options untuk jenis (filtered by kategori)
  const jenisOptions = useMemo<SelectOption[]>(() => {
    if (!item.kategoriId) return [];
    return (allJenis ?? [])
      .filter((j) => j.category === item.kategoriId)
      .map((j) => ({
        value: j.id,
        label: j.nama,
      }));
  }, [allJenis, item.kategoriId]);

  // Options untuk ukuran
  const ukuranOptions = useMemo<SelectOption[]>(
    () =>
      (stockItems ?? []).map((s) => ({
        value: s.id,
        label: s.ukuran,
        description: s.stok === 0 ? "Habis" : `Stok: ${s.stok} unit`,
      })),
    [stockItems]
  );

  const selectedStock = stockItems?.find((s) => s.id === item.stockItemId);
  const stockStatus = selectedStock ? getStokStatus(selectedStock.stok) : null;
  const isOverStock = selectedStock && item.jumlah > selectedStock.stok;

  const handleKategoriChange = (value: string) => {
    onUpdate(item.id, {
      kategoriId: value,
      jenisId: null,
      stockItemId: null,
    });
  };

  const handleJenisChange = (value: string) => {
    onUpdate(item.id, {
      jenisId: value,
      stockItemId: null,
    });
  };

  const handleStockChange = (value: string) => {
    onUpdate(item.id, { stockItemId: value });
  };

  return (
    <div className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
          Item {index + 1}
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(item.id)}
            aria-label={`Hapus item ${index + 1}`}
            className="text-[var(--color-danger-500)] hover:bg-[var(--color-danger-50)] hover:text-[var(--color-danger-600)]"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs">Kategori</Label>
          <CustomSelect
            value={item.kategoriId ?? ""}
            onChange={handleKategoriChange}
            options={kategoriOptions}
            placeholder="Pilih kategori"
            emptyMessage="Belum ada kategori"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Jenis Seragam</Label>
          <CustomSelect
            value={item.jenisId ?? ""}
            onChange={handleJenisChange}
            options={jenisOptions}
            placeholder={
              item.kategoriId ? "Pilih jenis seragam" : "Pilih kategori dulu"
            }
            disabled={!item.kategoriId}
            emptyMessage="Belum ada jenis di kategori ini"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Ukuran</Label>
            <CustomSelect
              value={item.stockItemId ?? ""}
              onChange={handleStockChange}
              options={ukuranOptions}
              placeholder={item.jenisId ? "Pilih" : "-"}
              disabled={!item.jenisId}
              emptyMessage="Belum ada ukuran"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Jumlah</Label>
            <StepperInput
              value={item.jumlah}
              onChange={(v) => onUpdate(item.id, { jumlah: v })}
              min={1}
              max={99}
              disabled={!item.stockItemId}
            />
          </div>
        </div>

        {selectedStock && stockStatus && (
          <div
            className={cn(
              "flex items-start gap-2 rounded-md p-2 text-xs",
              stockStatus === "habis" &&
                "bg-[var(--color-danger-50)] text-[var(--color-danger-700)]",
              stockStatus === "kritis" &&
                "bg-[var(--color-danger-50)] text-[var(--color-danger-600)]",
              stockStatus === "tipis" &&
                "bg-[var(--color-warning-50)] text-[var(--color-warning-700)]",
              stockStatus === "aman" &&
                "bg-[var(--color-neutral-50)] text-[var(--color-neutral-600)]"
            )}
          >
            {stockStatus !== "aman" && (
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            )}
            <div>
              {stockStatus === "habis" && (
                <>
                  <strong>Stok habis.</strong> Tetap bisa dicatat (stok jadi
                  defisit).
                </>
              )}
              {stockStatus === "kritis" && (
                <>Stok tersisa {selectedStock.stok} unit — sudah kritis.</>
              )}
              {stockStatus === "tipis" && (
                <>Stok tersisa {selectedStock.stok} unit — menipis.</>
              )}
              {stockStatus === "aman" && (
                <>Stok tersedia: {selectedStock.stok} unit</>
              )}
              {isOverStock && (
                <div className="mt-1 font-semibold">
                  ⚠ Jumlah melebihi stok tersedia!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}