"use client";

import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "default" | "danger";
}

/**
 * Dialog konfirmasi untuk aksi penting (hapus, batalkan, dll).
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  onConfirm,
  isLoading = false,
  variant = "default",
}: ConfirmDialogProps) {
  const isDanger = variant === "danger";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            {isDanger && (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-danger-100)]">
                <AlertTriangle className="h-5 w-5 text-[var(--color-danger-600)]" />
              </div>
            )}
            <div className="flex-1">
              <DialogTitle
                className={cn(
                  "text-base",
                  isDanger && "text-[var(--color-neutral-900)]"
                )}
              >
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="mt-1.5 text-sm text-[var(--color-neutral-500)]">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-4 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            size="mobile"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="sm:w-auto"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDanger ? "destructive" : "default"}
            size="mobile"
            onClick={onConfirm}
            disabled={isLoading}
            className="sm:w-auto"
          >
            {isLoading ? "Memproses..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}