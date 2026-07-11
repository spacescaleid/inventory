"use client";

import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Detect online/offline status dan tampilkan toast notification.
 */
export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("✓ Kembali online", {
        icon: <Wifi className="h-4 w-4" />,
        duration: 2000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Tidak ada koneksi internet", {
        icon: <WifiOff className="h-4 w-4" />,
        description: "Beberapa fitur mungkin terbatas",
        duration: 4000,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sticky banner saat offline
  if (!isOnline) {
    return (
      <div className="fixed left-0 right-0 top-0 z-[60] bg-[var(--color-warning-500)] text-white shadow-md">
        <div className="safe-top" />
        <div className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium">
          <WifiOff className="h-3.5 w-3.5" />
          <span>Mode offline — perubahan akan tersimpan lokal</span>
        </div>
      </div>
    );
  }

  return null;
}