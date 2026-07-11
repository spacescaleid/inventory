import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Layout untuk halaman auth (login, register).
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--color-primary-50)] via-[var(--color-neutral-50)] to-[var(--color-info-50)] px-4 py-8">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}