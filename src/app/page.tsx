"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/authStore";

export default function RootPage() {
  const router = useRouter();
  const { user, isInitialized, init } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [isInitialized, init]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    // Admin → dashboard admin
    // Operator → beranda
    if (user.role === "admin") {
      router.replace(ROUTES.ADMIN);
    } else {
      router.replace(ROUTES.BERANDA);
    }
  }, [isInitialized, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-neutral-50)]">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary-500)]" />
    </div>
  );
}