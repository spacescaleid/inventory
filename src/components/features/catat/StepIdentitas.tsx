"use client";

import { GraduationCap, Search, User, X } from "lucide-react";
import { useState } from "react";
import { SelectSiswaModal } from "@/components/features/catat/SelectSiswaModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { INPUT_LIMITS } from "@/constants/stok";
import { useCatatStore } from "@/stores/catatStore";
import { normalizeNama } from "@/utils/format";
import { cn } from "@/utils/cn";
import type { StudentSuggestion } from "@/hooks/useAutocomplete";

export function StepIdentitas() {
  const { namaSiswa, kelas, setIdentitas, setStep } = useCatatStore();
  const [errors, setErrors] = useState<{ nama?: string; kelas?: string }>({});
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelectSiswa = (student: StudentSuggestion) => {
    // Set nama & kelas dari master student
    setIdentitas(student.nama, student.kelas);
    setErrors({});
  };

  const handleClear = () => {
    setIdentitas("", "");
    setErrors({});
  };

  const handleNext = () => {
    const namaNormalized = normalizeNama(namaSiswa);
    const kelasNormalized = kelas.trim();

    const newErrors: typeof errors = {};

    if (!namaNormalized) {
      newErrors.nama = "Pilih siswa dulu";
    } else if (namaNormalized.length > INPUT_LIMITS.MAX_NAMA_SISWA_LENGTH) {
      newErrors.nama = `Maksimal ${INPUT_LIMITS.MAX_NAMA_SISWA_LENGTH} karakter`;
    }

    if (!kelasNormalized) {
      newErrors.kelas = "Kelas kosong";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIdentitas(namaNormalized, kelasNormalized);
    setStep("seragam");
  };

  const isValid = namaSiswa.trim() && kelas.trim();
  const hasSelection = namaSiswa.trim().length > 0;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-neutral-800)]">
            Pilih Siswa
          </h2>
          <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
            Siapa yang mengambil seragam?
          </p>
        </div>

        <div className="space-y-4">
          {/* Selected Siswa Card / Search Button */}
          {hasSelection ? (
            <div className="rounded-xl border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] text-lg font-bold text-white shadow">
                  {namaSiswa.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-[var(--color-neutral-800)]">
                    {namaSiswa}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[var(--color-neutral-600)]">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span className="font-mono">{kelas}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClear}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-[var(--color-neutral-400)] transition-colors hover:bg-white/50 hover:text-[var(--color-neutral-600)]"
                  aria-label="Ganti siswa"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-[var(--color-primary-200)] bg-white/60 px-3 py-2 text-xs font-medium text-[var(--color-primary-700)] transition-colors hover:bg-white"
              >
                <Search className="h-3.5 w-3.5" />
                Ganti Siswa
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-[var(--color-neutral-300)] bg-white px-4 py-6 text-left transition-all hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)]",
                errors.nama && "border-[var(--color-danger-500)]"
              )}
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-neutral-100)]">
                <User className="h-6 w-6 text-[var(--color-neutral-400)]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--color-neutral-800)]">
                  Cari & Pilih Siswa
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-neutral-500)]">
                  Tap untuk mencari nama atau NIS siswa
                </p>
              </div>

              <Search className="h-5 w-5 flex-shrink-0 text-[var(--color-neutral-400)]" />
            </button>
          )}

          {errors.nama && (
            <p className="text-xs text-[var(--color-danger-600)]">
              ⚠ {errors.nama}
            </p>
          )}

          {/* Info kelas (auto-fill dari siswa) */}
          {hasSelection && (
            <div className="rounded-lg bg-[var(--color-info-50)] p-3">
              <p className="flex items-start gap-2 text-xs text-[var(--color-info-700)]">
                <GraduationCap className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  Kelas otomatis terisi dari data siswa. Kalau salah, ganti
                  data siswa di menu Kelola Data.
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button
            size="mobile-lg"
            onClick={handleNext}
            disabled={!isValid}
            className="w-full"
          >
            Lanjut ke Pilih Seragam →
          </Button>
        </div>

        {!isValid && (
          <p className="text-center text-xs text-[var(--color-neutral-500)]">
            Pilih siswa dulu untuk melanjutkan
          </p>
        )}
      </div>

      <SelectSiswaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSelect={handleSelectSiswa}
      />
    </>
  );
}