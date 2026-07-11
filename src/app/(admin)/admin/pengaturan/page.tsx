"use client";

import { toast } from "sonner";
import { PengaturanForm } from "@/components/features/lainnya/PengaturanForm";
import { TopAppBar } from "@/components/layout/TopAppBar";

export default function AdminPengaturanPage() {
  const handleSaved = () => {
    toast.success("✓ Pengaturan berhasil disimpan");
  };

  return (
    <>
      <TopAppBar title="Pengaturan" showBack />

      <div className="px-4 py-4">
        <PengaturanForm onSaved={handleSaved} />
      </div>
    </>
  );
}