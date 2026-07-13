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
import { useCreateTransaction } from "@/hooks/useTransaksi";
import { parsePocketBaseError } from "@/lib/pocketbase/api";
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

  const createMutation = useCreateTransaction();

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [suksesData, setSuksesData] = useState<{
    namaSiswa: string;
    kelas: string;
    totalItems: number;
  } | null>(null);

  const handleConfirmSimpan = async () => {
    try {
      const validItems = items.filter(
        (i) => i.stockItemId !== null && i.jumlah > 0
      );

      if (validItems.length === 0) {
        toast.error("Tidak ada item yang dipilih");
        return;
      }

      await createMutation.mutateAsync({
        nama_siswa: namaSiswa,
        kelas,
        catatan,
        items: validItems.map((item) => ({
          stock_item_id: item.stockItemId!,
          jumlah: item.jumlah,
        })),
      });

      const totalItems = validItems.reduce((sum, item) => sum + item.jumlah, 0);
      setSuksesData({ namaSiswa, kelas, totalItems });

      setStep("sukses");

      toast.success("✓ Pengambilan berhasil dicatat", {
        description: `${namaSiswa} — ${kelas}`,
        duration: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan", {
        description: parsePocketBaseError(err),
      });
    }
  };

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
        {step !== "sukses" && (
          <div className="mb-6">
            <ProgressStep currentStep={step} />
          </div>
        )}

        <div>
          {step === "identitas" && <StepIdentitas />}
          {step === "seragam" && <StepPilihSeragam />}
          {step === "konfirmasi" && (
            <StepKonfirmasi
              onConfirm={handleConfirmSimpan}
              isSubmitting={createMutation.isPending}
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