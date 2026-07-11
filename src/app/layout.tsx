import type { Metadata, Viewport } from "next";
import { InstallPrompt } from "@/components/shared/InstallPrompt";
import { NetworkStatus } from "@/components/shared/NetworkStatus";
import { ServiceWorkerRegister } from "@/components/shared/ServiceWorkerRegister";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/lib/providers";
import { fontMono, fontSans } from "@/styles/fonts";
import { cn } from "@/utils/cn";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Inventory Seragam",
    template: "%s · Inventory Seragam",
  },
  description: "Aplikasi manajemen inventory seragam sekolah",
  applicationName: "Inventory Seragam",
  manifest: "/manifest.json",
  keywords: [
    "inventory",
    "seragam",
    "sekolah",
    "stok",
    "manajemen",
    "koperasi",
  ],
  authors: [{ name: "Inventory Team" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Inventory Seragam",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "Inventory Seragam",
    description: "Aplikasi manajemen inventory seragam sekolah",
    siteName: "Inventory Seragam",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366F1" },
    { media: "(prefers-color-scheme: dark)", color: "#4338CA" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          "antialiased min-h-screen bg-background text-foreground"
        )}
      >
        <Providers>
          <NetworkStatus />

          {children}

          <ServiceWorkerRegister />
          <InstallPrompt />

          <Toaster
            position="bottom-center"
            offset={80}
            toastOptions={{
              classNames: {
                toast: "font-sans",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
} 