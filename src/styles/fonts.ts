import { Geist, Geist_Mono } from "next/font/google";

/**
 * Font Geist Sans untuk body text
 * Font Geist Mono untuk angka, kode, ukuran seragam
 */
export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});