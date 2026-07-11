"use client";

import { MoreVertical, Pencil, Shirt, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/EmptyState";
import type { JenisSeragam, Kategori } from "@/types";

interface JenisListProps {
  jenisList: JenisSeragam[];
  kategoris: Kategori[];
  onEdit?: (jenis: JenisSeragam) => void;
  onDelete?: (jenis: JenisSeragam) => void;
  onAdd?: () => void;
}

export function JenisList({
  jenisList,
  kategoris,
  onEdit,
  onDelete,
  onAdd,
}: JenisListProps) {
  if (jenisList.length === 0) {
    return (
      <div className="rounded-xl bg-white shadow-sm">
        <EmptyState
          icon={Shirt}
          title="Belum ada jenis seragam"
          description="Tambahkan jenis seragam seperti baju, celana, atau topi"
          action={
            onAdd && (
              <Button size="mobile" onClick={onAdd}>
                Tambah Jenis
              </Button>
            )
          }
        />
      </div>
    );
  }

  // Group jenis by kategori
  const grouped = kategoris
    .map((kat) => ({
      kategori: kat,
      jenisList: jenisList.filter((j) => j.category === kat.id),
    }))
    .filter((g) => g.jenisList.length > 0);

  return (
    <div className="space-y-4">
      {grouped.map(({ kategori, jenisList }) => (
        <section key={kategori.id}>
          <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
            {kategori.nama}
          </h3>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            {jenisList.map((jenis, idx) => (
              <div
                key={jenis.id}
                className={`flex items-center gap-3 px-4 py-3 ${
                  idx !== jenisList.length - 1
                    ? "border-b border-[var(--color-neutral-100)]"
                    : ""
                }`}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-info-100)]">
                  <Shirt className="h-5 w-5 text-[var(--color-info-600)]" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-neutral-800)]">
                    {jenis.nama}
                  </p>
                </div>

                {(onEdit || onDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-neutral-400)] transition-colors hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-600)]"
                          aria-label={`Menu untuk ${jenis.nama}`}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-40">
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(jenis)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(jenis)}
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