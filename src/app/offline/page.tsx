"use client";

import { RefreshCw, WifiOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function OfflinePage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-neutral-50)] px-4">
      <div className="max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-neutral-100)]">
            <WifiOff className="h-10 w-10 text-[var(--color-neutral-500)]" />
          </div>
        </div>

        <h1 className="mb-2 text-xl font-semibold text-[var(--color-neutral-800)]">
          Tidak Ada Koneksi
        </h1>

        <p className="mb-6 text-sm text-[var(--color-neutral-500)]">
          Sepertinya kamu sedang offline. Beberapa halaman mungkin masih bisa
          diakses dari cache.
        </p>

        <div className="flex flex-col gap-2">
          <Button size="mobile" onClick={handleReload}>
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </Button>

          <Button
            variant="outline"
            size="mobile"
            render={<Link href={ROUTES.BERANDA} />}
          >
            Ke Beranda
          </Button>
        </div>

        <div className="mt-8 rounded-lg bg-[var(--color-info-50)] p-3">
          <p className="text-xs text-[var(--color-info-600)]">
            💡 Aplikasi ini bisa di-install ke HP untuk akses lebih cepat
          </p>
        </div>
      </div>
    </div>
  );
}