"use client";

import {
  GraduationCap,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Kelas } from "@/types";

interface KelasListProps {
  kelasList: Kelas[];
  onEdit?: (kelas: Kelas) => void;
  onDelete?: (kelas: Kelas) => void;
  onAdd?: () => void;
}

export function KelasList({
  kelasList,
  onEdit,
  onDelete,
  onAdd,
}: KelasListProps) {
  if (kelasList.length === 0) {
    return (
      <div className="rounded-xl bg-white shadow-sm">
        <EmptyState
          icon={GraduationCap}
          title="Belum ada kelas"
          description="Tambahkan daftar kelas untuk mempermudah input data siswa"
          action={
            onAdd && (
              <Button size="mobile" onClick={onAdd}>
                Tambah Kelas
              </Button>
            )
          }
        />
      </div>
    );
  }

  // Group by tahun ajaran
  const grouped = kelasList.reduce<Record<string, Kelas[]>>((acc, kelas) => {
    const key = kelas.tahun_ajaran;
    if (!acc[key]) acc[key] = [];
    acc[key].push(kelas);
    return acc;
  }, {});

  const sortedTahun = Object.keys(grouped).sort().reverse();

  return (
    <div className="space-y-4">
      {sortedTahun.map((tahun) => (
        <section key={tahun}>
          <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
            Tahun Ajaran {tahun}
          </h3>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            {grouped[tahun]
              .sort((a, b) => a.nama.localeCompare(b.nama))
              .map((kelas, idx, arr) => (
                <div
                  key={kelas.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    idx !== arr.length - 1
                      ? "border-b border-[var(--color-neutral-100)]"
                      : ""
                  }`}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-success-100)]">
                    <GraduationCap className="h-5 w-5 text-[var(--color-success-600)]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-semibold text-[var(--color-neutral-800)]">
                      {kelas.nama}
                    </p>
                  </div>

                  {(onEdit || onDelete) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-neutral-400)] transition-colors hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-600)]"
                            aria-label={`Menu untuk ${kelas.nama}`}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-40">
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(kelas)}>
                            <Pencil className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => onDelete(kelas)}
                            className="text-[var(--color-danger-600)] focus:text-[var(--color-danger-700)]"
                          >
                            <Trash2 className="h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}