"use client";

import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTransactions } from "@/hooks/useTransaksi";
import { exportTransaksiToCSV } from "@/utils/export";

interface ExportOption {
  key: string;
  label: string;
  description: string;
  action: () => Promise<void> | void;
}

export function ExportButton() {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const { data: allTransactions } = useTransactions({ periode: "semua" });
  const activeTransactions = allTransactions?.filter((t) => !t.is_cancelled);

  const handleExport = async (option: ExportOption) => {
    setIsExporting(option.key);
    try {
      await option.action();
      toast.success(`✓ ${option.label} berhasil diekspor`);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Gagal ekspor data");
    } finally {
      setIsExporting(null);
    }
  };

  const options: ExportOption[] = [
    {
      key: "all-transactions",
      label: "Semua Riwayat",
      description: `${allTransactions?.length ?? 0} transaksi total`,
      action: () => {
        if (!allTransactions) throw new Error("Data belum siap");
        exportTransaksiToCSV(allTransactions, "riwayat-semua.csv");
      },
    },
    {
      key: "active-transactions",
      label: "Riwayat Aktif",
      description: `${
        activeTransactions?.length ?? 0
      } transaksi (tanpa yang dibatalkan)`,
      action: () => {
        if (!activeTransactions) throw new Error("Data belum siap");
        exportTransaksiToCSV(activeTransactions, "riwayat-aktif.csv");
      },
    },
  ];

  return (
    <>
      <Button
        variant="outline"
        size="mobile"
        onClick={() => setOpen(true)}
        className="w-full"
        disabled={!allTransactions}
      >
        <Download className="h-4 w-4" />
        Ekspor Data
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl px-4 pb-6 pt-0 sm:max-w-lg sm:mx-auto"
        >
          <div className="mx-auto mt-3 mb-4 h-1 w-8 rounded-full bg-[var(--color-neutral-300)]" />

          <SheetHeader className="text-left">
            <SheetTitle className="text-lg">Ekspor Data</SheetTitle>
            <SheetDescription>
              Pilih data yang ingin diunduh sebagai file CSV
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-2">
            {options.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => handleExport(option)}
                disabled={isExporting !== null}
                className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-neutral-200)] bg-white p-4 text-left transition-all hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-100)]">
                  {isExporting === option.key ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[var(--color-primary-600)]" />
                  ) : (
                    <FileSpreadsheet className="h-5 w-5 text-[var(--color-primary-600)]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-neutral-800)]">
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-neutral-500)]">
                    {option.description}
                  </p>
                </div>

                <Download className="h-4 w-4 flex-shrink-0 text-[var(--color-neutral-400)]" />
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-[var(--color-info-50)] p-3">
            <p className="text-xs text-[var(--color-info-600)]">
              💡 File CSV bisa dibuka dengan Excel, Google Sheets, atau Numbers
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}