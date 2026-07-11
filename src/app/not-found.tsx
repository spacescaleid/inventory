import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-neutral-50)] px-4">
      <div className="max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-neutral-100)]">
            <FileQuestion className="h-8 w-8 text-[var(--color-neutral-500)]" />
          </div>
        </div>

        <h1 className="mb-2 text-xl font-semibold text-[var(--color-neutral-800)]">
          Halaman tidak ditemukan
        </h1>

        <p className="mb-6 text-sm text-[var(--color-neutral-500)]">
          Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
        </p>

        <Button size="mobile" render={<Link href={ROUTES.BERANDA} />}>
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}