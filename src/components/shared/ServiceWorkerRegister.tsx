"use client";

import { useEffect } from "react";

/**
 * Register Service Worker untuk PWA.
 * Hanya jalan di production karena SW di development bikin masalah cache.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log("[PWA] Service worker registered:", registration.scope);

        // Check for updates every 60 minutes
        setInterval(
          () => {
            registration.update().catch(console.error);
          },
          60 * 60 * 1000
        );

        // Listen for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Ada update tersedia — bisa show notification ke user
              console.log("[PWA] New version available");
            }
          });
        });
      } catch (error) {
        console.error("[PWA] Service worker registration failed:", error);
      }
    };

    // Register setelah page load supaya tidak mengganggu render awal
    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW);
      return () => window.removeEventListener("load", registerSW);
    }
  }, []);

  return null;
}