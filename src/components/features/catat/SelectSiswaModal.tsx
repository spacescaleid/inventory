"use client";

import { Loader2, Plus, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiswaForm } from "@/components/features/siswa/SiswaForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useSearchStudents,
  type StudentSuggestion,
} from "@/hooks/useAutocomplete";
import { useCreateStudent } from "@/hooks/useSiswa";
import { parsePocketBaseError } from "@/lib/pocketbase/api";
import { normalizeNama } from "@/utils/format";
import { cn } from "@/utils/cn";
import type { StudentInput } from "@/types";

interface SelectSiswaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (student: StudentSuggestion) => void;
}

export function SelectSiswaModal({
  open,
  onOpenChange,
  onSelect,
}: SelectSiswaModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StudentSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [siswaFormOpen, setSiswaFormOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 200);
  const searchStudents = useSearchStudents();
  const createStudent = useCreateStudent();

  // Reset state saat modal ditutup
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setQuery("");
        setResults([]);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Search saat query berubah
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const doSearch = async () => {
      setIsSearching(true);
      try {
        const items = await searchStudents(debouncedQuery);
        if (!cancelled) {
          setResults(items);
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    };

    doSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, open, searchStudents]);

  const handleSelect = (student: StudentSuggestion) => {
    onSelect(student);
    onOpenChange(false);
  };

  const handleCreateNew = () => {
    setSiswaFormOpen(true);
  };

  const handleCreateSubmit = async (values: StudentInput) => {
    try {
      const created = await createStudent.mutateAsync(values);

      toast.success("✓ Siswa baru berhasil ditambahkan", {
        description: `${created.nama} tersimpan ke master`,
      });

      // Auto-select siswa yang baru dibuat
      // Fetch ulang untuk dapat class nama
      const searchResult = await searchStudents(created.nama);
      const found = searchResult.find((s) => s.id === created.id);

      if (found) {
        onSelect(found);
      }

      setSiswaFormOpen(false);
      onOpenChange(false);
    } catch (err) {
      toast.error("Gagal menambah siswa", {
        description: parsePocketBaseError(err),
      });
    }
  };

  // Cek apakah query tidak match dengan hasil manapun
  const showAddNew =
    query.trim().length >= 2 &&
    !isSearching &&
    !results.some(
      (r) => r.nama.toLowerCase() === query.trim().toLowerCase()
    );

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex max-h-[90vh] flex-col rounded-t-2xl px-0 pb-0 pt-0 sm:max-w-lg sm:mx-auto"
        >
          {/* Handle */}
          <div className="mx-auto mt-3 mb-4 h-1 w-8 flex-shrink-0 rounded-full bg-[var(--color-neutral-300)]" />

          {/* Header */}
          <SheetHeader className="flex-shrink-0 px-4 text-left">
            <div className="flex items-start justify-between gap-3">
              <div>
                <SheetTitle className="text-lg">Pilih Siswa</SheetTitle>
                <SheetDescription className="mt-1">
                  Cari nama atau NIS siswa
                </SheetDescription>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-neutral-400)] hover:bg-[var(--color-neutral-100)]"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </SheetHeader>

          {/* Search Input */}
          <div className="flex-shrink-0 border-b border-[var(--color-neutral-100)] px-4 pb-3 pt-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-neutral-400)]" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ketik nama atau NIS..."
                className="h-11 w-full rounded-md border border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] pl-10 pr-3 text-sm text-[var(--color-neutral-800)] placeholder:text-[var(--color-neutral-400)] focus:border-[var(--color-primary-500)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto pb-safe">
            {isSearching ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--color-primary-500)]" />
              </div>
            ) : results.length === 0 && query.trim().length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[var(--color-neutral-500)]">
                Mulai ketik untuk mencari siswa...
              </div>
            ) : results.length === 0 && query.trim().length > 0 ? (
              <div className="px-4 py-8 text-center">
                <User className="mx-auto h-8 w-8 text-[var(--color-neutral-300)]" />
                <p className="mt-2 text-sm text-[var(--color-neutral-600)]">
                  Tidak ada siswa bernama{" "}
                  <strong>&ldquo;{query}&rdquo;</strong>
                </p>
                <p className="mt-1 text-xs text-[var(--color-neutral-500)]">
                  Kamu bisa tambah siswa baru di bawah
                </p>
              </div>
            ) : (
              <>
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
                  Hasil ({results.length})
                </div>
                {results.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onSelect={handleSelect}
                  />
                ))}
              </>
            )}

            {showAddNew && (
              <div className="border-t border-[var(--color-neutral-100)] p-4">
                <Button
                  variant="outline"
                  size="mobile"
                  onClick={handleCreateNew}
                  className="w-full"
                >
                  <Plus className="h-4 w-4" />
                  Tambah &ldquo;{normalizeNama(query)}&rdquo; sebagai siswa baru
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Nested modal untuk tambah siswa baru */}
      <SiswaForm
        open={siswaFormOpen}
        onOpenChange={setSiswaFormOpen}
        siswa={null}
        defaultNama={normalizeNama(query)}
        onSubmit={handleCreateSubmit}
        isLoading={createStudent.isPending}
      />
    </>
  );
}

function StudentRow({
  student,
  onSelect,
}: {
  student: StudentSuggestion;
  onSelect: (s: StudentSuggestion) => void;
}) {
  const initial = student.nama.charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onSelect(student)}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-neutral-50)] active:bg-[var(--color-neutral-100)]"
      )}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)] text-sm font-semibold text-white">
        {initial}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--color-neutral-800)]">
          {student.nama}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--color-neutral-500)]">
          {student.kelas && (
            <span className="font-mono">{student.kelas}</span>
          )}
          {student.nis && (
            <>
              {student.kelas && <span>·</span>}
              <span className="font-mono">NIS: {student.nis}</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}