"use client";

import { GraduationCap, User } from "lucide-react";
import { useMemo, useState } from "react";
import { AutocompleteInput } from "@/components/shared/AutocompleteInput";
import { CustomSelect, type SelectOption } from "@/components/shared/CustomSelect";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { INPUT_LIMITS } from "@/constants/stok";
import { useAutocompleteNamaSiswa } from "@/hooks/useAutocomplete";
import { useClasses } from "@/hooks/useKelas";
import { useCatatStore } from "@/stores/catatStore";
import { normalizeNama } from "@/utils/format";

function parseNamaSiswaWithKelas(selected: string): {
  nama: string;
  kelas: string | null;
} {
  const match = selected.match(/^(.+?)\s+\((.+?)\)$/);
  if (match) {
    return { nama: match[1], kelas: match[2] };
  }
  return { nama: selected, kelas: null };
}

export function StepIdentitas() {
  const { namaSiswa, kelas, setIdentitas, setStep } = useCatatStore();
  const [errors, setErrors] = useState<{ nama?: string; kelas?: string }>({});

  const getNamaSuggestions = useAutocompleteNamaSiswa();
  const { data: classes } = useClasses();

  // Options untuk dropdown kelas
  const kelasOptions = useMemo<SelectOption[]>(
    () =>
      (classes ?? []).map((k) => ({
        value: k.nama,
        label: k.nama,
        description: `Tahun Ajaran ${k.tahun_ajaran}`,
      })),
    [classes]
  );

  const handleNamaChange = (value: string) => {
    const parsed = parseNamaSiswaWithKelas(value);
    if (parsed.kelas && parsed.nama !== value) {
      setIdentitas(parsed.nama, kelas || parsed.kelas);
    } else {
      setIdentitas(value, kelas);
    }
    setErrors((prev) => ({ ...prev, nama: undefined }));
  };

  const handleKelasChange = (value: string) => {
    setIdentitas(namaSiswa, value);
    setErrors((prev) => ({ ...prev, kelas: undefined }));
  };

  const handleNext = () => {
    const namaNormalized = normalizeNama(namaSiswa);
    const kelasNormalized = kelas.trim();

    const newErrors: typeof errors = {};

    if (!namaNormalized) {
      newErrors.nama = "Nama siswa wajib diisi";
    } else if (namaNormalized.length > INPUT_LIMITS.MAX_NAMA_SISWA_LENGTH) {
      newErrors.nama = `Maksimal ${INPUT_LIMITS.MAX_NAMA_SISWA_LENGTH} karakter`;
    }

    if (!kelasNormalized) {
      newErrors.kelas = "Kelas wajib dipilih";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIdentitas(namaNormalized, kelasNormalized);
    setStep("seragam");
  };

  const isValid = namaSiswa.trim() && kelas.trim();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-neutral-800)]">
          Identitas Siswa
        </h2>
        <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
          Siapa yang mengambil seragam?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="nama-siswa" className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            Nama Siswa <span className="text-[var(--color-danger-500)]">*</span>
          </Label>
          <AutocompleteInput
            id="nama-siswa"
            value={namaSiswa}
            onChange={handleNamaChange}
            getSuggestions={getNamaSuggestions}
            placeholder="Contoh: Budi Santoso"
            aria-invalid={!!errors.nama}
            maxLength={INPUT_LIMITS.MAX_NAMA_SISWA_LENGTH}
          />
          {errors.nama ? (
            <p className="text-xs text-[var(--color-danger-600)]">
              ⚠ {errors.nama}
            </p>
          ) : (
            <p className="text-xs text-[var(--color-neutral-500)]">
              Klik saran untuk auto-fill kelas.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="kelas" className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" />
            Kelas <span className="text-[var(--color-danger-500)]">*</span>
          </Label>
          <CustomSelect
            id="kelas"
            value={kelas}
            onChange={handleKelasChange}
            options={kelasOptions}
            placeholder="Pilih kelas"
            aria-invalid={!!errors.kelas}
            emptyMessage="Belum ada kelas. Tambah di Kelola Data."
          />
          {errors.kelas && (
            <p className="text-xs text-[var(--color-danger-600)]">
              ⚠ {errors.kelas}
            </p>
          )}
        </div>
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
    </div>
  );
}