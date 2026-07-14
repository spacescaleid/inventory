"use client";

import {
  GraduationCap,
  MoreVertical,
  Pencil,
  Trash2,
  User,
  Users as UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Student } from "@/types";
import { cn } from "@/utils/cn";

interface SiswaListProps {
  siswaList: Student[];
  onEdit?: (siswa: Student) => void;
  onDelete?: (siswa: Student) => void;
  onAdd?: () => void;
  groupByClass?: boolean;
}

export function SiswaList({
  siswaList,
  onEdit,
  onDelete,
  onAdd,
  groupByClass = true,
}: SiswaListProps) {
  if (siswaList.length === 0) {
    return (
      <div className="rounded-xl bg-white shadow-sm">
        <EmptyState
          icon={UsersIcon}
          title="Belum ada siswa"
          description="Tambahkan siswa untuk memudahkan pencatatan pengambilan"
          action={
            onAdd && (
              <Button size="mobile" onClick={onAdd}>
                Tambah Siswa
              </Button>
            )
          }
        />
      </div>
    );
  }

  if (!groupByClass) {
    return (
      <div className="space-y-2">
        {siswaList.map((siswa) => (
          <SiswaCard
            key={siswa.id}
            siswa={siswa}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Group by class
  const grouped = siswaList.reduce<Record<string, Student[]>>((acc, siswa) => {
    const key = siswa.expand?.class?.nama || "Tanpa Kelas";
    if (!acc[key]) acc[key] = [];
    acc[key].push(siswa);
    return acc;
  }, {});

  const sortedClassNames = Object.keys(grouped).sort();

  return (
    <div className="space-y-4">
      {sortedClassNames.map((className) => (
        <section key={className}>
          <div className="mb-2 flex items-center justify-between px-1">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
              <GraduationCap className="h-3.5 w-3.5" />
              {className}
            </h3>
            <span className="font-mono text-xs text-[var(--color-neutral-400)]">
              {grouped[className].length} siswa
            </span>
          </div>

          <div className="space-y-2">
            {grouped[className].map((siswa) => (
              <SiswaCard
                key={siswa.id}
                siswa={siswa}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SiswaCard({
  siswa,
  onEdit,
  onDelete,
}: {
  siswa: Student;
  onEdit?: (siswa: Student) => void;
  onDelete?: (siswa: Student) => void;
}) {
  const initial = siswa.nama.charAt(0).toUpperCase();

  return (
    <div className="rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        {/* Avatar with initial */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)] text-sm font-semibold text-white">
          {initial}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[var(--color-neutral-800)]">
            {siswa.nama}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--color-neutral-500)]">
            {siswa.expand?.class && (
              <span className="font-mono">{siswa.expand.class.nama}</span>
            )}
            {siswa.nis && (
              <>
                {siswa.expand?.class && <span>·</span>}
                <span className="font-mono">NIS: {siswa.nis}</span>
              </>
            )}
          </div>
          {siswa.catatan && (
            <p className="mt-0.5 truncate text-xs italic text-[var(--color-neutral-400)]">
              &ldquo;{siswa.catatan}&rdquo;
            </p>
          )}
        </div>

        {/* Menu */}
        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-[var(--color-neutral-400)] transition-colors hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-600)]"
                  aria-label={`Menu untuk ${siswa.nama}`}
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-40">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(siswa)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(siswa)}
                    className="text-[var(--color-danger-600)] focus:text-[var(--color-danger-700)]"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}