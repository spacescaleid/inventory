"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RiwayatDetail } from "@/components/features/riwayat/RiwayatDetail";
import { RiwayatEmpty } from "@/components/features/riwayat/RiwayatEmpty";
import { RiwayatFilter } from "@/components/features/riwayat/RiwayatFilter";
import { RiwayatList } from "@/components/features/riwayat/RiwayatList";
import { RiwayatSkeleton } from "@/components/features/riwayat/RiwayatSkeleton";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import {
  useCancelTransaction,
  useTransactions,
} from "@/hooks/useTransaksi";
import { parsePocketBaseError } from "@/lib/pocketbase/api";
import { useFilterStore } from "@/stores/filterStore";
import type { Transaksi, TransactionItem } from "@/types";
import { exportTransaksiToCSV } from "@/utils/export";

export default function RiwayatPage() {
  const {
    riwayatSearch,
    riwayatPeriode,
    riwayatDateFrom,
    riwayatDateTo,
    setRiwayatSearch,
    setRiwayatPeriode,
    resetRiwayatFilter,
  } = useFilterStore();

  const [selectedTrx, setSelectedTrx] = useState<
    (Transaksi & { items: TransactionItem[] }) | null
  >(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useTransactions({
    search: riwayatSearch,
    periode: riwayatPeriode,
    dateFrom: riwayatDateFrom,
    dateTo: riwayatDateTo,
  });

  const cancelMutation = useCancelTransaction();

  const isFiltered =
    riwayatSearch.trim().length > 0 || riwayatPeriode !== "hari-ini";

  const handleItemClick = (
    transaksi: Transaksi & { items: TransactionItem[] }
  ) => {
    setSelectedTrx(transaksi);
    setDetailOpen(true);
  };

  const handleCancel = async (
    transaksi: Transaksi & { items: TransactionItem[] }
  ) => {
    try {
      await cancelMutation.mutateAsync(transaksi.id);
      toast.success("✓ Transaksi berhasil dibatalkan", {
        description: `Stok ${transaksi.items.length} item telah dikembalikan`,
      });
    } catch (err) {
      toast.error("Gagal membatalkan", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      toast.info("Tidak ada data untuk diekspor");
      return;
    }

    try {
      exportTransaksiToCSV(transactions);
      toast.success("✓ Data berhasil diekspor", {
        description: `${transactions.length} transaksi diunduh sebagai CSV`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal ekspor data");
    }
  };

  return (
    <>
      <TopAppBar
        title="Riwayat"
        rightSlot={
          <Button
            size="sm"
            variant="ghost"
            onClick={handleExport}
            disabled={!transactions || transactions.length === 0}
            className="gap-1"
          >
            <Download className="h-4 w-4" />
            Ekspor
          </Button>
        }
      />

      <div className="space-y-4 px-4 py-4">
        <RiwayatFilter
          searchValue={riwayatSearch}
          onSearchChange={setRiwayatSearch}
          periode={riwayatPeriode}
          onPeriodeChange={setRiwayatPeriode}
        />

        {isLoading ? (
          <RiwayatSkeleton />
        ) : error ? (
          <ErrorState
            description={parsePocketBaseError(error)}
            onRetry={() => refetch()}
          />
        ) : !transactions || transactions.length === 0 ? (
          <RiwayatEmpty
            isFiltered={isFiltered}
            onReset={resetRiwayatFilter}
          />
        ) : (
          <>
            <div className="flex items-center justify-between px-1 text-xs text-[var(--color-neutral-500)]">
              <span>
                Menampilkan{" "}
                <strong className="text-[var(--color-neutral-700)]">
                  {transactions.length}
                </strong>{" "}
                transaksi
              </span>
              {isFiltered && (
                <button
                  type="button"
                  onClick={resetRiwayatFilter}
                  className="text-[var(--color-primary-600)] hover:underline"
                >
                  Reset filter
                </button>
              )}
            </div>

            <RiwayatList
              transactions={transactions}
              onItemClick={handleItemClick}
            />
          </>
        )}
      </div>

      <RiwayatDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        transaksi={selectedTrx}
        onCancel={handleCancel}
        isCancelling={cancelMutation.isPending}
      />
    </>
  );
}