"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useCatatStore } from "@/stores/catatStore";

interface StepSuksesProps {
  namaSiswa: string;
  kelas: string;
  totalItems: number;
}

export function StepSukses({ namaSiswa, kelas, totalItems }: StepSuksesProps) {
  const reset = useCatatStore((state) => state.reset);
  const [countdown, setCountdown] = useState(3);

  // Auto-reset countdown
  useEffect(() => {
    if (countdown === 0) {
      reset();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, reset]);

  const handleCatatLagi = () => {
    reset();
  };

  return (
    <div className="flex flex-col items-center py-8 text-center">
      {/* Animated checkmark */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-success-100)] animate-in zoom-in duration-300">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success-500)]">
          <Check
            className="h-8 w-8 text-white animate-in fade-in duration-500"
            strokeWidth={3}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-[var(--color-neutral-800)]">
        Berhasil Dicatat!
      </h2>

      <div className="mt-3 space-y-1">
        <p className="text-sm text-[var(--color-neutral-600)]">
          <strong>{namaSiswa}</strong>{" "}
          <span className="font-mono text-xs text-[var(--color-neutral-500)]">
            ({kelas})
          </span>
        </p>
        <p className="text-sm text-[var(--color-neutral-500)]">
          {totalItems} item seragam telah tercatat
        </p>
      </div>

      {/* Countdown info */}
      <p className="mt-6 text-xs text-[var(--color-neutral-400)]">
        Form akan reset otomatis dalam{" "}
        <span className="font-mono font-semibold text-[var(--color-neutral-600)]">
          {countdown}
        </span>{" "}
        detik
      </p>

      {/* Actions */}
      <div className="mt-8 flex w-full flex-col gap-2">
        <Button size="mobile-lg" onClick={handleCatatLagi} className="w-full">
          Catat Pengambilan Lain
        </Button>
        <Button
          size="mobile"
          variant="outline"
          render={<Link href={ROUTES.RIWAYAT} />}
          className="w-full"
        >
          Lihat Riwayat
        </Button>
      </div>
    </div>
  );
}