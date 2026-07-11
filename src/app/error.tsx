"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-neutral-50)] px-4">
      <div className="max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-danger-100)]">
            <AlertTriangle className="h-8 w-8 text-[var(--color-danger-600)]" />
          </div>
        </div>

        <h1 className="mb-2 text-xl font-semibold text-[var(--color-neutral-800)]">
          Terjadi kesalahan
        </h1>

        <p className="mb-6 text-sm text-[var(--color-neutral-500)]">
          Aplikasi mengalami masalah. Silakan coba lagi beberapa saat.
        </p>

        <Button onClick={reset} size="mobile">
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}