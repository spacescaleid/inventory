"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { User } from "@/types";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(72, "Password maksimal 72 karakter"),
    passwordConfirm: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.passwordConfirm, {
    message: "Password dan konfirmasi tidak sama",
    path: ["passwordConfirm"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (values: ResetPasswordValues) => Promise<void> | void;
  isLoading?: boolean;
}

export function ResetPasswordForm({
  open,
  onOpenChange,
  user,
  onSubmit,
  isLoading,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: { newPassword: "", passwordConfirm: "" },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      setShowPassword(false);
    }
  }, [open, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl px-4 pb-6 pt-0 sm:max-w-lg sm:mx-auto"
      >
        <div className="mx-auto mt-3 mb-4 h-1 w-8 rounded-full bg-[var(--color-neutral-300)]" />

        <SheetHeader className="text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-warning-100)]">
              <KeyRound className="h-5 w-5 text-[var(--color-warning-600)]" />
            </div>
            <div>
              <SheetTitle className="text-lg">Reset Password</SheetTitle>
              <SheetDescription>
                Buat password baru untuk <strong>{user?.name}</strong>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-4 rounded-lg bg-[var(--color-warning-50)] p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-warning-600)]" />
            <p className="text-xs text-[var(--color-warning-700)]">
              User akan diminta login ulang dengan password baru. Pastikan
              menyampaikan password baru kepada user yang bersangkutan.
            </p>
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">
              Password Baru{" "}
              <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
                className="pr-11"
                {...form.register("newPassword")}
                aria-invalid={!!form.formState.errors.newPassword}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--color-neutral-400)] transition-colors hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-600)]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {form.formState.errors.newPassword && (
              <p className="text-xs text-[var(--color-danger-600)]">
                ⚠ {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="passwordConfirmReset">
              Konfirmasi Password{" "}
              <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <Input
              id="passwordConfirmReset"
              type={showPassword ? "text" : "password"}
              placeholder="Ulangi password yang sama"
              autoComplete="new-password"
              {...form.register("passwordConfirm")}
              aria-invalid={!!form.formState.errors.passwordConfirm}
            />
            {form.formState.errors.passwordConfirm && (
              <p className="text-xs text-[var(--color-danger-600)]">
                ⚠ {form.formState.errors.passwordConfirm.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="mobile"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="mobile"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}