"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Package,
  User as UserIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/authStore";

const loginSchema = z.object({
  identity: z
    .string()
    .trim()
    .min(1, "Email atau username wajib diisi")
    .max(100, "Maksimal 100 karakter"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .max(100, "Maksimal 100 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const { user, isInitialized, init, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identity: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isInitialized) init();
  }, [isInitialized, init]);

  useEffect(() => {
    if (isInitialized && user) {
      if (redirect) {
        router.replace(redirect);
      } else if (user.role === "admin") {
        router.replace(ROUTES.ADMIN);
      } else {
        router.replace(ROUTES.BERANDA);
      }
    }
  }, [isInitialized, user, redirect, router]);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.identity, values.password);
      toast.success("✓ Berhasil masuk", {
        description: "Selamat datang kembali",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login gagal";
      toast.error("Login gagal", { description: message });
      form.setError("password", { message: "" });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary-500)] shadow-lg">
          <Package className="h-8 w-8 text-white" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-neutral-800)]">
          Inventory Seragam
        </h1>
        <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
          Masuk untuk mengelola stok seragam
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="identity" className="flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5" />
              Email atau Username
            </Label>
            <Input
              id="identity"
              type="text"
              placeholder="Masukkan email atau username"
              autoComplete="username"
              autoFocus
              {...form.register("identity")}
              aria-invalid={!!form.formState.errors.identity}
            />
            {form.formState.errors.identity && (
              <p className="text-xs text-[var(--color-danger-600)]">
                ⚠ {form.formState.errors.identity.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                autoComplete="current-password"
                className="pr-11"
                {...form.register("password")}
                aria-invalid={!!form.formState.errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--color-neutral-400)] transition-colors hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-600)]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {form.formState.errors.password &&
              form.formState.errors.password.message && (
                <p className="text-xs text-[var(--color-danger-600)]">
                  ⚠ {form.formState.errors.password.message}
                </p>
              )}
          </div>

          <Button
            type="submit"
            size="mobile-lg"
            disabled={form.formState.isSubmitting}
            className="mt-6 w-full"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Masuk
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-[var(--color-neutral-400)]">
        Hubungi admin sekolah jika lupa password
      </p>
    </div>
  );
}