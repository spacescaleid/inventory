"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { RiwayatDetail } from "@/components/features/riwayat/RiwayatDetail";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ROUTES } from "@/constants/routes";
import { getMockTransactionById } from "@/lib/mock-data";
import type { Transaksi, TransactionItem } from "@/types";

export default function RiwayatDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const transaksi = getMockTransactionById(params.id);

  const handleCancel = async (
    trx: Transaksi & { items: TransactionItem[] }
  ) => {
    setIsCancelling(true);
    try {
      // TODO: integrasi PocketBase
      console.log("Cancel:", trx.id);
      await new Promise((r) => setTimeout(r, 600));

      toast.success("✓ Transaksi berhasil dibatalkan");
      router.push(ROUTES.RIWAYAT);
    } catch (error) {
      console.error(error);
      toast.error("Gagal membatalkan transaksi");
    } finally {
      setIsCancelling(false);
    }
  };

  if (!transaksi) {
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

      {/* Auto-open detail sheet */}
      <RiwayatDetail
        open={true}
        onOpenChange={(open) => {
          if (!open) router.push(ROUTES.RIWAYAT);
        }}
        transaksi={transaksi}
        onCancel={handleCancel}
        isCancelling={isCancelling}
      />

      {/* Fallback content */}
      <div className="px-4 py-8 text-center text-sm text-[var(--color-neutral-500)]">
        Sedang memuat detail...
      </div>
    </>
  );
}