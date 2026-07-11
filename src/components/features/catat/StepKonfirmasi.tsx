"use client";

import { Calendar, GraduationCap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getMockStockItemById } from "@/lib/mock-data";
import { useCatatStore } from "@/stores/catatStore";
import { formatTanggalWaktu } from "@/utils/date";
import { cn } from "@/utils/cn";

interface StepKonfirmasiProps {
  onConfirm: () => Promise<void> | void;
  isSubmitting?: boolean;
}

export function StepKonfirmasi({
  onConfirm,
  isSubmitting,
}: StepKonfirmasiProps) {
  const { namaSiswa, kelas, items, catatan, setCatatan, setStep } =
    useCatatStore();

  const totalItems = items.reduce((sum, item) => sum + item.jumlah, 0);
  const now = new Date();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-neutral-800)]">
          Konfirmasi Pengambilan
        </h2>
        <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
          Periksa kembali sebelum menyimpan
        </p>
      </div>

      {/* Ringkasan Identitas */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
          Identitas
        </h3>

        <dl className="space-y-2.5">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-[var(--color-neutral-400)]" />
            <dt className="text-xs text-[var(--color-neutral-500)]">Siswa:</dt>
            <dd className="text-sm font-semibold text-[var(--color-neutral-800)]">
              {namaSiswa}
            </dd>
          </div>

          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-[var(--color-neutral-400)]" />
            <dt className="text-xs text-[var(--color-neutral-500)]">Kelas:</dt>
            <dd className="font-mono text-sm font-semibold text-[var(--color-neutral-800)]">
              {kelas}
            </dd>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-[var(--color-neutral-400)]" />
            <dt className="text-xs text-[var(--color-neutral-500)]">Waktu:</dt>
            <dd className="text-xs text-[var(--color-neutral-700)]">
              {formatTanggalWaktu(now)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Ringkasan Item */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
            Item yang Diambil
          </h3>
          <span className="rounded-full bg-[var(--color-primary-100)] px-2 py-0.5 font-mono text-xs font-semibold text-[var(--color-primary-700)]">
            {totalItems} unit
          </span>
        </div>

        <div className="divide-y divide-[var(--color-neutral-100)]">
          {items.map((item, idx) => {
            const stock = item.stockItemId
              ? getMockStockItemById(item.stockItemId)
              : null;
            const jenis = stock?.expand?.uniform_type;
            const kategori = jenis?.expand?.category;
            const stokSesudah = stock ? stock.stok - item.jumlah : 0;
            const isDefisit = stokSesudah < 0;

            return (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--color-neutral-800)]">
                      {jenis?.nama || "Seragam"}{" "}
                      <span className="font-mono text-[var(--color-neutral-500)]">
                        ({stock?.ukuran})
                      </span>
                    </p>
                    {kategori && (
                      <p className="mt-0.5 text-xs text-[var(--color-neutral-500)]">
                        {kategori.nama}
                      </p>
                    )}
                    {stock && (
                      <p className="mt-1 font-mono text-[11px] text-[var(--color-neutral-500)]">
                        Stok: {stock.stok} →{" "}
                        <span
                          className={cn(
                            "font-semibold",
                            isDefisit
                              ? "text-[var(--color-danger-600)]"
                              : "text-[var(--color-neutral-700)]"
                          )}
                        >
                          {stokSesudah}
                          {isDefisit && " ⚠"}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0 rounded-md bg-[var(--color-primary-50)] px-2.5 py-1">
                    <span className="font-mono text-sm font-semibold text-[var(--color-primary-700)]">
                      ×{item.jumlah}
                    </span>
                  </div>
                </div>

                {/* Ukuran index untuk mobile */}
                <div className="mt-1 font-mono text-[10px] text-[var(--color-neutral-400)]">
                  #{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Catatan opsional */}
      <div className="space-y-1.5">
        <Label htmlFor="catatan" className="text-sm">
          Catatan{" "}
          <span className="text-[var(--color-neutral-400)]">(opsional)</span>
        </Label>
        <textarea
          id="catatan"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Contoh: Tukar ukuran, mengganti yang rusak, dll"
          rows={2}
          maxLength={200}
          className="w-full rounded-md border border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] px-3 py-2 text-sm text-[var(--color-neutral-800)] placeholder:text-[var(--color-neutral-400)] transition-colors focus:border-[var(--color-primary-500)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="mobile"
          onClick={() => setStep("seragam")}
          disabled={isSubmitting}
          className="flex-1"
        >
          ← Edit
        </Button>
        <Button
          size="mobile"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Menyimpan..." : "✓ Konfirmasi Simpan"}
        </Button>
      </div>
    </div>
  );
}