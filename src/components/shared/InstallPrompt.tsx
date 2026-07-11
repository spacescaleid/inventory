"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "pwa-install-dismissed";
const DISMISSED_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 hari

/**
 * Prompt install PWA yang muncul di bottom.
 * Auto-hide setelah user dismiss selama 7 hari.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Cek apakah sudah dismissed
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < DISMISSED_DURATION) return;
    }

    // Cek apakah sudah installed (standalone mode)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Delay 3 detik supaya tidak langsung muncul
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("[PWA] User accepted install");
      }

      setDeferredPrompt(null);
      setIsVisible(false);
    } catch (error) {
      console.error("[PWA] Install failed:", error);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setIsVisible(false);
  };

  if (!isVisible || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4 animate-in slide-in-from-bottom duration-300">
      <div className="mx-auto max-w-md rounded-xl border border-[var(--color-primary-200)] bg-white p-3 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-100)]">
            <Download className="h-5 w-5 text-[var(--color-primary-600)]" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--color-neutral-800)]">
              Install ke HP kamu
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-neutral-500)]">
              Akses lebih cepat, tanpa buka browser
            </p>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Tutup"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-[var(--color-neutral-400)] transition-colors hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-600)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="flex-1"
          >
            Nanti
          </Button>
          <Button size="sm" onClick={handleInstall} className="flex-1">
            <Download className="h-4 w-4" />
            Install
          </Button>
        </div>
      </div>
    </div>
  );
}