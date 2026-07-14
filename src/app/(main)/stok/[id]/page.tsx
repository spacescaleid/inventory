import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

/**
 * Halaman detail stok per ID — belum dipakai.
 * Redirect ke halaman stok utama.
 * TODO: Implementasikan halaman detail dengan riwayat stok item.
 */
export default function StokDetailPage() {
  redirect(ROUTES.STOK);
}