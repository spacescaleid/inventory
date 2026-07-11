import { Loader2 } from "lucide-react";

/**
 * Global loading state untuk App Router.
 * Muncul saat navigasi antar halaman.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-neutral-50)]">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary-500)]" />
    </div>
  );
}