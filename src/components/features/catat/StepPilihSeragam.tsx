"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCatatStore } from "@/stores/catatStore";
import { ItemSeragamRow } from "./ItemSeragamRow";

export function StepPilihSeragam() {
  const {
    items,
    namaSiswa,
    kelas,
    addItem,
    updateItem,
    removeItem,
    setStep,
  } = useCatatStore();

  // Check semua item sudah lengkap
  const allItemsValid = items.every(
    (item) => item.stockItemId !== null && item.jumlah > 0
  );

  const handleNext = () => {
    if (!allItemsValid) return;
    setStep("konfirmasi");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-neutral-800)]">
          Pilih Seragam
        </h2>
        <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
          Untuk{" "}
          <strong className="text-[var(--color-neutral-700)]">
            {namaSiswa}
          </strong>{" "}
          <span className="font-mono text-xs text-[var(--color-neutral-500)]">
            ({kelas})
          </span>
        </p>
      </div>

      {/* List items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <ItemSeragamRow
            key={item.id}
            item={item}
            index={index}
            onUpdate={updateItem}
            onRemove={removeItem}
            canRemove={items.length > 1}
          />
        ))}
      </div>

      {/* Tambah item baru */}
      <Button
        type="button"
        variant="outline"
        size="mobile"
        onClick={addItem}
        className="w-full border-dashed"
      >
        <Plus className="h-4 w-4" />
        Tambah Item Lain
      </Button>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="mobile"
          onClick={() => setStep("identitas")}
          className="flex-1"
        >
          ← Kembali
        </Button>
        <Button
          size="mobile"
          onClick={handleNext}
          disabled={!allItemsValid}
          className="flex-1"
        >
          Lanjut →
        </Button>
      </div>

      {!allItemsValid && (
        <p className="text-center text-xs text-[var(--color-neutral-500)]">
          Lengkapi semua item untuk melanjutkan
        </p>
      )}
    </div>
  );
}