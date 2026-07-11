"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function ErrorState({
  title = "Gagal memuat data",
  description = "Terjadi kesalahan saat mengambil data. Silakan coba lagi.",
  onRetry,
  className,
  compact = false,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8" : "py-12",
        className
      )}
    >
      <div
        className={cn(
          "mb-4 flex items-center justify-center rounded-full bg-[var(--color-danger-100)]",
          compact ? "h-12 w-12" : "h-16 w-16"
        )}
      >
        <AlertTriangle
          className={cn(
            "text-[var(--color-danger-600)]",
            compact ? "h-6 w-6" : "h-8 w-8"
          )}
        />
      </div>

      <h3 className="text-base font-semibold text-[var(--color-neutral-800)]">
        {title}
      </h3>

      <p className="mt-1 max-w-xs text-sm text-[var(--color-neutral-500)]">
        {description}
      </p>

      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-4">
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
      )}
    </div>
  );
}