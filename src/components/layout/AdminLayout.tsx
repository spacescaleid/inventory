"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "./BottomNav";

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Layout khusus admin. Auto-redirect kalau bukan admin.
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading, isAdmin } = useAuth({
    required: true,
    requireAdmin: true,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-neutral-50)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary-500)]" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)]">
      <main className="pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}