"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ProgressStep } from "@/components/features/catat/ProgressStep";
import { StepIdentitas } from "@/components/features/catat/StepIdentitas";
import { StepKonfirmasi } from "@/components/features/catat/StepKonfirmasi";
import { StepPilihSeragam } from "@/components/features/catat/StepPilihSeragam";
import { StepSukses } from "@/components/features/catat/StepSukses";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useCatatStore } from "@/stores/catatStore";

export default function CatatPage() {
  const {
    step,
    namaSiswa,
    kelas,
    items,
    catatan,
    setStep,
    reset,
  } = useCatatStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Simpan snapshot untuk step sukses (sebelum reset)
  const [suksesData, setSuksesData] = useState<{
    namaSiswa: string;
    kelas: string;
    totalItems: number;
  } | null>(null);

  const handleConfirmSimpan = async () => {
    setIsSubmitting(true);

    try {
      // TODO: integrasi dengan PocketBase
      console.log("Simpan transaksi:", { namaSiswa, kelas, items, catatan });

      // Simulasi API delay
      await new Promise((r) => setTimeout(r, 800));

      // Snapshot data untuk step sukses
      const totalItems = items.reduce((sum, item) => sum + item.jumlah, 0);
      setSuksesData({ namaSiswa, kelas, totalItems });

      // Pindah ke step sukses
      setStep("sukses");

      // Toast sukses
      toast.success("✓ Pengambilan berhasil dicatat", {
        description: `${namaSiswa} — ${kelas}`,
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back button — cek apakah ada data yang belum tersimpan
  const handleBack = () => {
    const hasData =
      namaSiswa.trim() ||
      kelas.trim() ||
      items.some((i) => i.stockItemId !== null);

    if (hasData && step !== "sukses") {
      setShowExitConfirm(true);
    } else {
      reset();
      window.history.back();
    }
  };

  const handleConfirmExit = () => {
    reset();
    setShowExitConfirm(false);
    window.history.back();
  };

  const stepTitle: Record<typeof step, string> = {
    identitas: "Catat Pengambilan",
    seragam: "Catat Pengambilan",
    konfirmasi: "Catat Pengambilan",
    sukses: "Berhasil",
  };

  return (
    <>
      <TopAppBar
        title={stepTitle[step]}
        showBack={step !== "sukses"}
        onBack={handleBack}
      />

      <div className="px-4 py-4">
        {/* Progress indicator — tidak muncul di step sukses */}
        {step !== "sukses" && (
          <div className="mb-6">
            <ProgressStep currentStep={step} />
          </div>
        )}

        {/* Step content */}
        <div>
          {step === "identitas" && <StepIdentitas />}
          {step === "seragam" && <StepPilihSeragam />}
          {step === "konfirmasi" && (
            <StepKonfirmasi
              onConfirm={handleConfirmSimpan}
              isSubmitting={isSubmitting}
            />
          )}
          {step === "sukses" && suksesData && (
            <StepSukses
              namaSiswa={suksesData.namaSiswa}
              kelas={suksesData.kelas}
              totalItems={suksesData.totalItems}
            />
          )}
        </div>
      </div>

      {/* Confirm exit dialog */}
      <ConfirmDialog
        open={showExitConfirm}
        onOpenChange={setShowExitConfirm}
        title="Keluar dari halaman ini?"
        description="Data yang belum tersimpan akan hilang."
        confirmLabel="Ya, Keluar"
        cancelLabel="Lanjut Isi"
        onConfirm={handleConfirmExit}
        variant="danger"
      />
    </>
  );
}