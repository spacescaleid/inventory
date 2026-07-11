"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightSlot?: ReactNode;
  leftSlot?: ReactNode;
  centerSlot?: ReactNode;
  className?: string;
}

/**
 * Top App Bar — header aplikasi.
 *
 * Behavior:
 * - Sticky di atas
 * - Menampilkan border-bottom saat scroll > 0
 * - Support back button, custom left/right slot
 * - Height 56px + safe area (untuk iPhone notch)
 */
export function TopAppBar({
  title,
  showBack = false,
  onBack,
  rightSlot,
  leftSlot,
  centerSlot,
  className,
}: TopAppBarProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-white transition-all duration-200",
        scrolled && "border-b border-[var(--color-neutral-200)]",
        className
      )}
    >
      <div className="safe-top" />
      <div className="flex h-14 items-center gap-2 px-4">
        {/* Left slot */}
        <div className="flex items-center min-w-[44px]">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Kembali"
              className="flex h-11 w-11 items-center justify-center rounded-md text-[var(--color-neutral-700)] transition-colors hover:bg-[var(--color-neutral-100)] active:bg-[var(--color-neutral-200)]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            leftSlot
          )}
        </div>

        {/* Center — title atau custom */}
        <div className="flex-1 min-w-0">
          {centerSlot ??
            (title && (
              <h1 className="truncate text-base font-semibold text-[var(--color-neutral-800)]">
                {title}
              </h1>
            ))}
        </div>

        {/* Right slot */}
        {rightSlot && (
          <div className="flex items-center gap-1">{rightSlot}</div>
        )}
      </div>
    </header>
  );
}