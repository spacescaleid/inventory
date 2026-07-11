"use client";

import { AlertCircle, Trash2 } from "lucide-react";
import { StepperInput } from "@/components/shared/StepperInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getMockJenisByKategori,
  getMockStockByJenis,
  mockKategoris,
} from "@/lib/mock-data";
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
  // Get options based on cascade selection
  const jenisOptions = item.kategoriId
    ? getMockJenisByKategori(item.kategoriId)
    : [];
  const stockOptions = item.jenisId ? getMockStockByJenis(item.jenisId) : [];

  const selectedStock = stockOptions.find((s) => s.id === item.stockItemId);
  const stockStatus = selectedStock ? getStokStatus(selectedStock.stok) : null;
  const isOverStock =
    selectedStock && item.jumlah > selectedStock.stok;

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
      {/* Header */}
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
        {/* Kategori */}
        <div className="space-y-1">
          <Label className="text-xs">Kategori</Label>
          <Select
            value={item.kategoriId || ""}
            onValueChange={handleKategoriChange}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {mockKategoris.map((k) => (
                <SelectItem key={k.id} value={k.id}>
                  {k.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Jenis */}
        <div className="space-y-1">
          <Label className="text-xs">Jenis Seragam</Label>
          <Select
            value={item.jenisId || ""}
            onValueChange={handleJenisChange}
            disabled={!item.kategoriId}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue
                placeholder={
                  item.kategoriId
                    ? "Pilih jenis seragam"
                    : "Pilih kategori dulu"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {jenisOptions.map((j) => (
                <SelectItem key={j.id} value={j.id}>
                  {j.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ukuran + Jumlah dalam 2 kolom */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Ukuran</Label>
            <Select
              value={item.stockItemId || ""}
              onValueChange={handleStockChange}
              disabled={!item.jenisId}
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue
                  placeholder={item.jenisId ? "Pilih" : "-"}
                />
              </SelectTrigger>
              <SelectContent>
                {stockOptions.map((s) => {
                  const isHabis = s.stok === 0;
                  return (
                    <SelectItem
                      key={s.id}
                      value={s.id}
                      disabled={false}
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-mono font-semibold">
                          {s.ukuran}
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            isHabis
                              ? "text-[var(--color-danger-600)]"
                              : "text-[var(--color-neutral-500)]"
                          )}
                        >
                          {isHabis ? "(habis)" : `(${s.stok})`}
                        </span>
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
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

        {/* Warning stok */}
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