"use client";

import { Layers, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Kategori } from "@/types";

interface KategoriListProps {
  kategoris: Kategori[];
  onEdit?: (kategori: Kategori) => void;
  onDelete?: (kategori: Kategori) => void;
  onAdd?: () => void;
}

export function KategoriList({
  kategoris,
  onEdit,
  onDelete,
  onAdd,
}: KategoriListProps) {
  if (kategoris.length === 0) {
    return (
      <div className="rounded-xl bg-white shadow-sm">
        <EmptyState
          icon={Layers}
          title="Belum ada kategori"
          description="Tambahkan kategori seragam pertama untuk mulai mengorganisir stok"
          action={
            onAdd && (
              <Button size="mobile" onClick={onAdd}>
                Tambah Kategori
              </Button>
            )
          }
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      {kategoris.map((kategori, idx) => (
        <div
          key={kategori.id}
          className={`flex items-center gap-3 px-4 py-3 ${
            idx !== kategoris.length - 1
              ? "border-b border-[var(--color-neutral-100)]"
              : ""
          }`}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-100)]">
            <Layers className="h-5 w-5 text-[var(--color-primary-600)]" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--color-neutral-800)]">
              {kategori.nama}
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-neutral-500)]">
              Urutan: {kategori.urutan}
            </p>
          </div>

          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-neutral-400)] transition-colors hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-600)]"
                    aria-label={`Menu untuk ${kategori.nama}`}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-40">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(kategori)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(kategori)}
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
  );
}