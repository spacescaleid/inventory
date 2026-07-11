"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

const schema = z
  .object({
    oldPassword: z.string().min(1, "Password lama wajib diisi"),
    newPassword: z.string().min(8, "Password minimal 8 karakter").max(72),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.passwordConfirm, {
    message: "Password baru tidak sama",
    path: ["passwordConfirm"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Password baru harus berbeda dari password lama",
    path: ["newPassword"],
  });

type FormValues = z.infer<typeof schema>;

interface ChangeMyPasswordFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export function ChangeMyPasswordForm({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: ChangeMyPasswordFormProps) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      passwordConfirm: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      setShowOld(false);
      setShowNew(false);
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
          <SheetTitle className="text-lg">Ganti Password</SheetTitle>
          <SheetDescription>
            Buat password baru untuk keamanan akunmu
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="oldPassword">
              Password Lama{" "}
              <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <div className="relative">
              <Input
                id="oldPassword"
                type={showOld ? "text" : "password"}
                autoComplete="current-password"
                className="pr-11"
                {...form.register("oldPassword")}
                aria-invalid={!!form.formState.errors.oldPassword}
              />
              <button
                type="button"
                onClick={() => setShowOld((v) => !v)}
                aria-label="Toggle"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--color-neutral-400)] hover:bg-[var(--color-neutral-100)]"
              >
                {showOld ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {form.formState.errors.oldPassword && (
              <p className="text-xs text-[var(--color-danger-600)]">
                ⚠ {form.formState.errors.oldPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword2">
              Password Baru{" "}
              <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <div className="relative">
              <Input
                id="newPassword2"
                type={showNew ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
                className="pr-11"
                {...form.register("newPassword")}
                aria-invalid={!!form.formState.errors.newPassword}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                aria-label="Toggle"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--color-neutral-400)] hover:bg-[var(--color-neutral-100)]"
              >
                {showNew ? (
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
            <Label htmlFor="passwordConfirm2">
              Konfirmasi Password Baru{" "}
              <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <Input
              id="passwordConfirm2"
              type={showNew ? "text" : "password"}
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
                "Ganti Password"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}