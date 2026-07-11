"use client";

import { Ban, Calendar, GraduationCap, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Transaksi, TransactionItem } from "@/types";
import { formatTanggalWaktu } from "@/utils/date";
import { cn } from "@/utils/cn";

interface RiwayatDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaksi: (Transaksi & { items: TransactionItem[] }) | null;
  onCancel?: (transaksi: Transaksi & { items: TransactionItem[] }) => Promise<void> | void;
  isCancelling?: boolean;
}

export function RiwayatDetail({
  open,
  onOpenChange,
  transaksi,
  onCancel,
  isCancelling,
}: RiwayatDetailProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!transaksi) return null;

  const totalItems = transaksi.items.reduce(
    (sum, item) => sum + item.jumlah,
    0
  );

  const handleCancel = async () => {
    if (onCancel) {
      await onCancel(transaksi);
      setShowCancelConfirm(false);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[90vh] overflow-y-auto rounded-t-2xl px-4 pb-6 pt-0 sm:max-w-lg sm:mx-auto"
        >
          {/* Drag handle */}
          <div className="mx-auto mt-3 mb-4 h-1 w-8 rounded-full bg-[var(--color-neutral-300)]" />

          <SheetHeader className="text-left">
            <div className="flex items-start justify-between gap-3">
              <div>
                <SheetTitle className="text-lg">Detail Transaksi</SheetTitle>
                <SheetDescription className="mt-1">
                  {formatTanggalWaktu(transaksi.created)}
                </SheetDescription>
              </div>

              {transaksi.is_cancelled && (
                <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-[var(--color-danger-100)] px-2 py-1 text-xs font-semibold text-[var(--color-danger-700)]">
                  <Ban className="h-3 w-3" />
                  Dibatalkan
                </span>
              )}
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {/* Identitas */}
            <div className="rounded-xl bg-[var(--color-neutral-50)] p-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
                Identitas
              </h3>
              <dl className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[var(--color-neutral-400)]" />
                  <dt className="text-xs text-[var(--color-neutral-500)]">
                    Siswa:
                  </dt>
                  <dd
                    className={cn(
                      "text-sm font-semibold text-[var(--color-neutral-800)]",
                      transaksi.is_cancelled && "line-through"
                    )}
                  >
                    {transaksi.nama_siswa}
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[var(--color-neutral-400)]" />
                  <dt className="text-xs text-[var(--color-neutral-500)]">
                    Kelas:
                  </dt>
                  <dd className="font-mono text-sm font-semibold text-[var(--color-neutral-800)]">
                    {transaksi.kelas}
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[var(--color-neutral-400)]" />
                  <dt className="text-xs text-[var(--color-neutral-500)]">
                    Waktu:
                  </dt>
                  <dd className="text-xs text-[var(--color-neutral-700)]">
                    {formatTanggalWaktu(transaksi.created)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Items */}
            <div className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-3">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
                  Item Diambil
                </h3>
                <span className="rounded-full bg-[var(--color-primary-100)] px-2 py-0.5 font-mono text-xs font-semibold text-[var(--color-primary-700)]">
                  {totalItems} unit
                </span>
              </div>

              <div className="divide-y divide-[var(--color-neutral-100)]">
                {transaksi.items.map((item, idx) => {
                  const stock = item.expand?.stock_item;
                  const jenis = stock?.expand?.uniform_type;
                  const kategori = jenis?.expand?.category;

                  return (
                    <div
                      key={item.id}
                      className="py-2.5 first:pt-0 last:pb-0"
                    >
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
                          <p className="mt-1 font-mono text-[10px] text-[var(--color-neutral-400)]">
                            Stok: {item.stok_sebelum} → {item.stok_sesudah}
                          </p>
                        </div>

                        <div className="flex-shrink-0 rounded-md bg-[var(--color-primary-50)] px-2.5 py-1">
                          <span className="font-mono text-sm font-semibold text-[var(--color-primary-700)]">
                            ×{item.jumlah}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-[var(--color-neutral-400)]">
                        #{idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Catatan */}
            {transaksi.catatan && (
              <div className="rounded-xl border border-[var(--color-neutral-200)] bg-white p-3">
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5 text-[var(--color-neutral-400)]" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
                    Catatan
                  </h3>
                </div>
                <p className="text-sm italic text-[var(--color-neutral-700)]">
                  &ldquo;{transaksi.catatan}&rdquo;
                </p>
              </div>
            )}

            {/* Cancelled info */}
            {transaksi.is_cancelled && transaksi.cancelled_at && (
              <div className="rounded-xl border border-[var(--color-danger-200)] bg-[var(--color-danger-50)] p-3">
                <p className="text-xs text-[var(--color-danger-700)]">
                  <strong>Transaksi ini sudah dibatalkan</strong> pada{" "}
                  {formatTanggalWaktu(transaksi.cancelled_at)}. Stok sudah
                  dikembalikan.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          {!transaksi.is_cancelled && onCancel && (
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                size="mobile"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Tutup
              </Button>
              <Button
                variant="destructive"
                size="mobile"
                onClick={() => setShowCancelConfirm(true)}
                className="flex-1"
              >
                <Ban className="h-4 w-4" />
                Batalkan
              </Button>
            </div>
          )}

          {transaksi.is_cancelled && (
            <div className="mt-6">
              <Button
                variant="outline"
                size="mobile"
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                Tutup
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={showCancelConfirm}
        onOpenChange={setShowCancelConfirm}
        title="Batalkan transaksi ini?"
        description={
          <>
            Pengambilan seragam oleh{" "}
            <strong>{transaksi.nama_siswa}</strong> ({transaksi.kelas}) akan
            dibatalkan. Stok akan dikembalikan ke sistem.
            <br />
            <br />
            <span className="text-xs text-[var(--color-neutral-500)]">
              Data transaksi tetap disimpan sebagai riwayat.
            </span>
          </>
        }
        confirmLabel="Ya, Batalkan"
        cancelLabel="Tidak"
        onConfirm={handleCancel}
        isLoading={isCancelling}
        variant="danger"
      />
    </>
  );
}