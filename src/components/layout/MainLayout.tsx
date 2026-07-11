"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "./BottomNav";

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Layout untuk halaman-halaman utama (bukan auth).
 * Protect semua route di dalamnya.
 */
export function MainLayout({ children }: MainLayoutProps) {
  const { user, isLoading } = useAuth({ required: true });
  const pathname = usePathname();
  const router = useRouter();

  // Redirect admin dari halaman operator ke dashboard admin
  // (kecuali kalau admin sengaja akses via tombol "Mode Operator")
  useEffect(() => {
    if (!user) return;

    // Admin yang buka /beranda → redirect ke /admin
    // (Kecuali kalau ada query "?as=operator")
    if (
      user.role === "admin" &&
      pathname === ROUTES.BERANDA &&
      !window.location.search.includes("as=operator")
    ) {
      router.replace(ROUTES.ADMIN);
    }
  }, [user, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-neutral-50)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary-500)]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)]">
      <main className="pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}