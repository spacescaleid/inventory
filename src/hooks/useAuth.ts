"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/constants/routes";

/**
 * Hook untuk auth check.
 * Auto-redirect kalau tidak login (di halaman yang protected).
 */
export function useAuth(options?: {
  required?: boolean;
  requireAdmin?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized, init } = useAuthStore();

  // Init sekali saat mount
  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [isInitialized, init]);

  // Auto-redirect kalau tidak auth
  useEffect(() => {
    if (!isInitialized) return;

    // Require login tapi belum login
    if (options?.required && !user) {
      const redirect = encodeURIComponent(pathname);
      router.replace(`${ROUTES.LOGIN}?redirect=${redirect}`);
      return;
    }

    // Require admin tapi bukan admin
    if (options?.requireAdmin && user && user.role !== "admin") {
      router.replace(ROUTES.BERANDA);
      return;
    }
  }, [
    isInitialized,
    user,
    options?.required,
    options?.requireAdmin,
    pathname,
    router,
  ]);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading: !isInitialized,
  };
}