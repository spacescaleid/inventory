"use client";

import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { RiwayatDetail } from "@/components/features/riwayat/RiwayatDetail";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ROUTES } from "@/constants/routes";
import {
  useCancelTransaction,
  useTransaction,
} from "@/hooks/useTransaksi";
import { parsePocketBaseError } from "@/lib/pocketbase/api";
import type { Transaksi, TransactionItem } from "@/types";

export default function RiwayatDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: transaksi, isLoading, error } = useTransaction(params.id);
  const cancelMutation = useCancelTransaction();

  const handleCancel = async (
    trx: Transaksi & { items: TransactionItem[] }
  ) => {
    try {
      await cancelMutation.mutateAsync(trx.id);
      toast.success("✓ Transaksi berhasil dibatalkan");
      router.push(ROUTES.RIWAYAT);
    } catch (err) {
      toast.error("Gagal membatalkan", {
        description: parsePocketBaseError(err),
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <TopAppBar title="Detail Transaksi" showBack />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary-500)]" />
        </div>
      </>
    );
  }

  if (error || !transaksi) {
    return (
      <>
        <TopAppBar title="Detail Transaksi" showBack />
        <div className="px-4 py-8">
          <div className="rounded-xl bg-white shadow-sm">
            <EmptyState
              icon={AlertCircle}
              title="Transaksi tidak ditemukan"
              description="Transaksi mungkin sudah dihapus atau ID tidak valid"
              action={
                <Button
                  variant="outline"
                  size="mobile"
                  render={<Link href={ROUTES.RIWAYAT} />}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Riwayat
                </Button>
              }
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopAppBar title="Detail Transaksi" showBack />

      <RiwayatDetail
        open={true}
        onOpenChange={(open) => {
          if (!open) router.push(ROUTES.RIWAYAT);
        }}
        transaksi={transaksi}
        onCancel={handleCancel}
        isCancelling={cancelMutation.isPending}
      />

      <div className="px-4 py-8 text-center text-sm text-[var(--color-neutral-500)]">
        Sedang memuat detail...
      </div>
    </>
  );
}