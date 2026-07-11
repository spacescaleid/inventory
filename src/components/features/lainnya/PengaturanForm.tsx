"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, School } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/stores/settingsStore";

const pengaturanSchema = z.object({
  namaSekolah: z
    .string()
    .trim()
    .min(1, "Nama sekolah wajib diisi")
    .max(100, "Maksimal 100 karakter"),
  tahunAjaran: z
    .string()
    .trim()
    .min(1, "Tahun ajaran wajib diisi")
    .max(20, "Maksimal 20 karakter"),
  thresholdMenipis: z
    .number({ message: "Threshold harus berupa angka" })
    .int("Threshold harus bilangan bulat")
    .min(1, "Minimal 1")
    .max(100, "Maksimal 100"),
});

type PengaturanFormValues = z.infer<typeof pengaturanSchema>;

interface PengaturanFormProps {
  onSaved?: () => void;
}

export function PengaturanForm({ onSaved }: PengaturanFormProps) {
  const {
    namaSekolah,
    tahunAjaran,
    thresholdMenipis,
    setNamaSekolah,
    setTahunAjaran,
    setThresholdMenipis,
  } = useSettingsStore();

  const form = useForm<PengaturanFormValues>({
    resolver: zodResolver(pengaturanSchema),
    defaultValues: {
      namaSekolah,
      tahunAjaran,
      thresholdMenipis,
    },
  });

  useEffect(() => {
    form.reset({ namaSekolah, tahunAjaran, thresholdMenipis });
  }, [namaSekolah, tahunAjaran, thresholdMenipis, form]);

  const handleSubmit = async (values: PengaturanFormValues) => {
    // Simpan ke Zustand (auto-persist ke localStorage)
    setNamaSekolah(values.namaSekolah);
    setTahunAjaran(values.tahunAjaran);
    setThresholdMenipis(values.thresholdMenipis);

    onSaved?.();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Section: Sekolah */}
      <section className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <School className="h-4 w-4 text-[var(--color-neutral-500)]" />
          <h2 className="text-sm font-semibold text-[var(--color-neutral-800)]">
            Informasi Sekolah
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nama-sekolah">
              Nama Sekolah{" "}
              <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <Input
              id="nama-sekolah"
              placeholder="Contoh: SMP Negeri 1 Jakarta"
              {...form.register("namaSekolah")}
              aria-invalid={!!form.formState.errors.namaSekolah}
            />
            {form.formState.errors.namaSekolah && (
              <p className="text-xs text-[var(--color-danger-600)]">
                ⚠ {form.formState.errors.namaSekolah.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tahun-ajaran">
              Tahun Ajaran{" "}
              <span className="text-[var(--color-danger-500)]">*</span>
            </Label>
            <Input
              id="tahun-ajaran"
              placeholder="Contoh: 2024/2025"
              {...form.register("tahunAjaran")}
              aria-invalid={!!form.formState.errors.tahunAjaran}
            />
            {form.formState.errors.tahunAjaran && (
              <p className="text-xs text-[var(--color-danger-600)]">
                ⚠ {form.formState.errors.tahunAjaran.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Section: Threshold */}
      <section className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-[var(--color-neutral-800)]">
            Peringatan Stok
          </h2>
          <p className="mt-0.5 text-xs text-[var(--color-neutral-500)]">
            Batas minimum sebelum stok dianggap menipis
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="threshold">
            Threshold Stok Menipis{" "}
            <span className="text-[var(--color-danger-500)]">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="threshold"
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              {...form.register("thresholdMenipis", { valueAsNumber: true })}
              aria-invalid={!!form.formState.errors.thresholdMenipis}
              className="w-24"
            />
            <span className="text-sm text-[var(--color-neutral-500)]">
              unit
            </span>
          </div>
          {form.formState.errors.thresholdMenipis ? (
            <p className="text-xs text-[var(--color-danger-600)]">
              ⚠ {form.formState.errors.thresholdMenipis.message}
            </p>
          ) : (
            <p className="text-xs text-[var(--color-neutral-500)]">
              Stok di bawah {form.watch("thresholdMenipis") || 5} unit akan
              ditandai sebagai <strong>menipis</strong>
            </p>
          )}
        </div>
      </section>

      {/* Submit */}
      <Button
        type="submit"
        size="mobile-lg"
        disabled={form.formState.isSubmitting || !form.formState.isDirty}
        className="w-full"
      >
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Simpan Pengaturan"
        )}
      </Button>

      {!form.formState.isDirty && (
        <p className="text-center text-xs text-[var(--color-neutral-400)]">
          Tidak ada perubahan
        </p>
      )}
    </form>
  );
}