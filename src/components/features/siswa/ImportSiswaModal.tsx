"use client";

import {
  AlertTriangle,
  CheckCircle,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useClasses } from "@/hooks/useKelas";
import { useCreateStudent, useStudents } from "@/hooks/useSiswa";
import { parsePocketBaseError } from "@/lib/pocketbase/api";
import {
  generateStudentTemplate,
  parseFileToStudents,
  validateAndNormalizeRows,
  type ParsedStudentRow,
} from "@/utils/import-siswa";
import { cn } from "@/utils/cn";

interface ImportSiswaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ImportStep = "upload" | "preview" | "importing" | "done";

interface ImportResult {
  success: number;
  skipped: number;
  errors: number;
  errorMessages: string[];
}

export function ImportSiswaModal({
  open,
  onOpenChange,
}: ImportSiswaModalProps) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);

  const { data: classes } = useClasses();
  const { data: existingStudents } = useStudents();
  const createStudent = useCreateStudent();

  const validRows = parsedRows.filter((r) => r.status === "valid");
  const duplicateRows = parsedRows.filter((r) => r.status === "duplicate");
  const errorRows = parsedRows.filter((r) => r.status === "error");

  const resetState = () => {
    setStep("upload");
    setFile(null);
    setParsedRows([]);
    setResult(null);
    setProgress(0);
  };

  const handleClose = () => {
    if (step === "importing") return;
    resetState();
    onOpenChange(false);
  };

  const handleDownloadTemplate = () => {
    try {
      generateStudentTemplate();
      toast.success("✓ Template berhasil di-download", {
        description: "Buka file dengan Excel atau Google Sheets",
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal generate template");
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    e.target.value = "";

    const isExcel =
      selectedFile.name.endsWith(".xlsx") ||
      selectedFile.name.endsWith(".xls");
    const isCsv = selectedFile.name.endsWith(".csv");

    if (!isExcel && !isCsv) {
      toast.error("Format file tidak didukung", {
        description: "Gunakan .xlsx, .xls, atau .csv",
      });
      return;
    }

    setFile(selectedFile);
    setIsParsing(true);

    try {
      const rawRows = await parseFileToStudents(selectedFile);

      if (rawRows.length === 0) {
        toast.error("File kosong");
        setFile(null);
        return;
      }

      if (rawRows.length > 1000) {
        toast.error("Maksimal 1000 baris per import", {
          description: "Pecah file kamu jadi beberapa bagian",
        });
        setFile(null);
        return;
      }

      const validated = validateAndNormalizeRows(
        rawRows,
        (classes ?? []).map((c) => ({ id: c.id, nama: c.nama })),
        (existingStudents ?? []).map((s) => ({
          nama: s.nama,
          classId: s.class,
        }))
      );

      setParsedRows(validated);
      setStep("preview");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal parse file";
      toast.error("Gagal membaca file", {
        description: message,
      });
      setFile(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    if (validRows.length === 0) {
      toast.error("Tidak ada data valid untuk di-import");
      return;
    }

    setStep("importing");
    setProgress(0);

    let successCount = 0;
    const errorMessages: string[] = [];

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];

      try {
        await createStudent.mutateAsync({
          nama: row.nama,
          class: row.classId!,
          nis: row.nis || undefined,
          catatan: row.catatan || undefined,
        });
        successCount++;
      } catch (err) {
        errorMessages.push(
          `Baris ${row.rowNumber} (${row.nama}): ${parsePocketBaseError(err)}`
        );
      }

      setProgress(Math.round(((i + 1) / validRows.length) * 100));
    }

    setResult({
      success: successCount,
      skipped: duplicateRows.length,
      errors: errorRows.length + errorMessages.length,
      errorMessages,
    });

    setStep("done");

    if (successCount > 0) {
      toast.success(`✓ ${successCount} siswa berhasil di-import`);
    }
  };

  const handleDone = () => {
    resetState();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="flex max-h-[92vh] flex-col rounded-t-2xl px-0 pb-0 pt-0 sm:max-w-2xl sm:mx-auto"
      >
        <div className="mx-auto mt-3 mb-4 h-1 w-8 flex-shrink-0 rounded-full bg-[var(--color-neutral-300)]" />

        <SheetHeader className="flex-shrink-0 px-4 text-left">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-lg">Import Data Siswa</SheetTitle>
              <SheetDescription className="mt-1">
                Upload file Excel atau CSV untuk import banyak siswa sekaligus
              </SheetDescription>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={step === "importing"}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-neutral-400)] hover:bg-[var(--color-neutral-100)] disabled:opacity-40"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 pb-safe">
          {step === "upload" && (
            <UploadStep
              isParsing={isParsing}
              onFileChange={handleFileChange}
              onDownloadTemplate={handleDownloadTemplate}
            />
          )}

          {step === "preview" && (
            <PreviewStep
              file={file}
              parsedRows={parsedRows}
              validRows={validRows}
              duplicateRows={duplicateRows}
              errorRows={errorRows}
            />
          )}

          {step === "importing" && (
            <ImportingStep
              progress={progress}
              total={validRows.length}
              current={Math.round((progress / 100) * validRows.length)}
            />
          )}

          {step === "done" && result && <DoneStep result={result} />}
        </div>

        {(step === "preview" || step === "done") && (
          <div className="flex-shrink-0 border-t border-[var(--color-neutral-100)] bg-white p-4">
            {step === "preview" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="mobile"
                  onClick={resetState}
                  className="flex-1"
                >
                  Ganti File
                </Button>
                <Button
                  size="mobile"
                  onClick={handleImport}
                  disabled={validRows.length === 0}
                  className="flex-1"
                >
                  Import {validRows.length} Siswa
                </Button>
              </div>
            )}

            {step === "done" && (
              <Button size="mobile" onClick={handleDone} className="w-full">
                Selesai
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ============================================
// Sub Components
// ============================================

interface UploadStepProps {
  isParsing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
}

function UploadStep({
  isParsing,
  onFileChange,
  onDownloadTemplate,
}: UploadStepProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--color-info-200)] bg-[var(--color-info-50)] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white">
            <FileSpreadsheet className="h-5 w-5 text-[var(--color-info-600)]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--color-info-700)]">
              Belum punya file?
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-info-600)]">
              Download template Excel dengan format yang benar
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadTemplate}
              className="mt-3 gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Download Template
            </Button>
          </div>
        </div>
      </div>

      <label
        htmlFor="import-file"
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[var(--color-neutral-300)] bg-white px-4 py-12 text-center transition-all hover:border-[var(--color-primary-400)] hover:bg-[var(--color-primary-50)]",
          isParsing && "cursor-not-allowed opacity-60"
        )}
      >
        {isParsing ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary-500)]" />
            <p className="text-sm font-medium text-[var(--color-neutral-700)]">
              Membaca file...
            </p>
          </>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-neutral-100)]">
              <Upload className="h-6 w-6 text-[var(--color-neutral-500)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-neutral-800)]">
                Klik untuk pilih file
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-neutral-500)]">
                Excel (.xlsx, .xls) atau CSV
              </p>
            </div>
          </>
        )}

        <input
          id="import-file"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={onFileChange}
          disabled={isParsing}
          className="sr-only"
        />
      </label>

      <div className="rounded-lg bg-[var(--color-neutral-50)] p-3">
        <p className="text-xs font-semibold text-[var(--color-neutral-700)]">
          📋 Tips import:
        </p>
        <ul className="mt-2 space-y-1 text-xs text-[var(--color-neutral-600)]">
          <li>
            • Kolom wajib: <strong>Nama</strong> dan <strong>Kelas</strong>
          </li>
          <li>
            • Kolom opsional: <strong>NIS</strong>, <strong>Catatan</strong>
          </li>
          <li>• Kelas harus sudah ada di master (buat dulu di menu Kelas)</li>
          <li>• Max 1000 baris per import</li>
          <li>• Nama akan otomatis di-format Title Case</li>
          <li>
            • Google Sheets: File → Download → CSV, lalu upload di sini
          </li>
        </ul>
      </div>
    </div>
  );
}

interface PreviewStepProps {
  file: File | null;
  parsedRows: ParsedStudentRow[];
  validRows: ParsedStudentRow[];
  duplicateRows: ParsedStudentRow[];
  errorRows: ParsedStudentRow[];
}

function PreviewStep({
  file,
  parsedRows,
  validRows,
  duplicateRows,
  errorRows,
}: PreviewStepProps) {
  return (
    <div className="space-y-4">
      {file && (
        <div className="flex items-center gap-2 rounded-lg bg-[var(--color-neutral-100)] px-3 py-2 text-xs text-[var(--color-neutral-600)]">
          <FileSpreadsheet className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{file.name}</span>
          <span className="ml-auto flex-shrink-0 font-mono">
            {parsedRows.length} baris
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <StatBadge
          icon={CheckCircle}
          label="Valid"
          count={validRows.length}
          color="success"
        />
        <StatBadge
          icon={AlertTriangle}
          label="Duplicate"
          count={duplicateRows.length}
          color="warning"
        />
        <StatBadge
          icon={XCircle}
          label="Error"
          count={errorRows.length}
          color="danger"
        />
      </div>

      {validRows.length > 0 && (
        <details open className="rounded-xl bg-white shadow-sm">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[var(--color-success-700)]">
            ✓ Akan di-import ({validRows.length})
          </summary>
          <div className="max-h-60 divide-y divide-[var(--color-neutral-100)] overflow-y-auto border-t border-[var(--color-neutral-100)]">
            {validRows.slice(0, 20).map((row) => (
              <div
                key={row.rowNumber}
                className="flex items-center justify-between px-4 py-2 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[var(--color-neutral-800)]">
                    {row.nama}
                  </p>
                  <p className="mt-0.5 truncate text-[var(--color-neutral-500)]">
                    {row.kelas}
                    {row.nis && ` · NIS: ${row.nis}`}
                  </p>
                </div>
                <span className="ml-2 font-mono text-[10px] text-[var(--color-neutral-400)]">
                  #{row.rowNumber}
                </span>
              </div>
            ))}
            {validRows.length > 20 && (
              <div className="px-4 py-2 text-center text-xs text-[var(--color-neutral-500)]">
                + {validRows.length - 20} lainnya
              </div>
            )}
          </div>
        </details>
      )}

      {duplicateRows.length > 0 && (
        <details className="rounded-xl bg-white shadow-sm">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[var(--color-warning-700)]">
            ⚠ Sudah ada, akan di-skip ({duplicateRows.length})
          </summary>
          <div className="max-h-40 divide-y divide-[var(--color-neutral-100)] overflow-y-auto border-t border-[var(--color-neutral-100)]">
            {duplicateRows.slice(0, 20).map((row) => (
              <div key={row.rowNumber} className="px-4 py-2 text-xs">
                <p className="font-medium text-[var(--color-neutral-800)]">
                  {row.nama}{" "}
                  <span className="font-normal text-[var(--color-neutral-500)]">
                    ({row.kelas})
                  </span>
                </p>
              </div>
            ))}
          </div>
        </details>
      )}

      {errorRows.length > 0 && (
        <details open className="rounded-xl bg-white shadow-sm">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[var(--color-danger-600)]">
            ✗ Error ({errorRows.length})
          </summary>
          <div className="max-h-60 divide-y divide-[var(--color-neutral-100)] overflow-y-auto border-t border-[var(--color-neutral-100)]">
            {errorRows.slice(0, 20).map((row) => (
              <div key={row.rowNumber} className="px-4 py-2 text-xs">
                <p className="font-mono text-[10px] text-[var(--color-neutral-400)]">
                  Baris #{row.rowNumber}
                </p>
                <p className="mt-0.5 text-[var(--color-neutral-700)]">
                  {row.nama || <em>(kosong)</em>} ·{" "}
                  {row.kelas || <em>(kosong)</em>}
                </p>
                <p className="mt-1 text-[var(--color-danger-600)]">
                  ⚠ {row.errors.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

interface ImportingStepProps {
  progress: number;
  total: number;
  current: number;
}

function ImportingStep({ progress, total, current }: ImportingStepProps) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-[var(--color-primary-500)]" />

      <h3 className="mt-6 text-base font-semibold text-[var(--color-neutral-800)]">
        Mengimport data siswa...
      </h3>
      <p className="mt-2 text-sm text-[var(--color-neutral-500)]">
        {current} dari {total} siswa
      </p>

      <div className="mt-6 w-full max-w-xs">
        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-neutral-200)]">
          <div
            className="h-full bg-[var(--color-primary-500)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center font-mono text-xs text-[var(--color-neutral-500)]">
          {progress}%
        </p>
      </div>

      <p className="mt-4 text-xs text-[var(--color-neutral-400)]">
        Jangan tutup halaman ini
      </p>
    </div>
  );
}

interface DoneStepProps {
  result: ImportResult;
}

function DoneStep({ result }: DoneStepProps) {
  const isSuccess = result.success > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center py-6 text-center">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full",
            isSuccess
              ? "bg-[var(--color-success-100)]"
              : "bg-[var(--color-danger-100)]"
          )}
        >
          {isSuccess ? (
            <CheckCircle className="h-8 w-8 text-[var(--color-success-600)]" />
          ) : (
            <XCircle className="h-8 w-8 text-[var(--color-danger-600)]" />
          )}
        </div>

        <h3 className="mt-4 text-lg font-semibold text-[var(--color-neutral-800)]">
          {isSuccess ? "Import Selesai!" : "Import Gagal"}
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatBadge
          icon={CheckCircle}
          label="Berhasil"
          count={result.success}
          color="success"
        />
        <StatBadge
          icon={AlertTriangle}
          label="Skip"
          count={result.skipped}
          color="warning"
        />
        <StatBadge
          icon={XCircle}
          label="Error"
          count={result.errors}
          color="danger"
        />
      </div>

      {result.errorMessages.length > 0 && (
        <details className="rounded-xl bg-white shadow-sm">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[var(--color-danger-600)]">
            Detail Error ({result.errorMessages.length})
          </summary>
          <div className="max-h-40 divide-y divide-[var(--color-neutral-100)] overflow-y-auto border-t border-[var(--color-neutral-100)]">
            {result.errorMessages.map((msg, idx) => (
              <div
                key={idx}
                className="px-4 py-2 text-xs text-[var(--color-neutral-700)]"
              >
                {msg}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

interface StatBadgeProps {
  icon: typeof CheckCircle;
  label: string;
  count: number;
  color: "success" | "warning" | "danger";
}

function StatBadge({ icon: Icon, label, count, color }: StatBadgeProps) {
  const colorMap = {
    success: {
      bg: "bg-[var(--color-success-50)]",
      icon: "text-[var(--color-success-600)]",
      text: "text-[var(--color-success-700)]",
    },
    warning: {
      bg: "bg-[var(--color-warning-50)]",
      icon: "text-[var(--color-warning-600)]",
      text: "text-[var(--color-warning-700)]",
    },
    danger: {
      bg: "bg-[var(--color-danger-50)]",
      icon: "text-[var(--color-danger-600)]",
      text: "text-[var(--color-danger-700)]",
    },
  };

  return (
    <div className={cn("rounded-lg p-3 text-center", colorMap[color].bg)}>
      <Icon className={cn("mx-auto h-5 w-5", colorMap[color].icon)} />
      <p
        className={cn(
          "mt-1 font-mono text-lg font-bold",
          colorMap[color].text
        )}
      >
        {count}
      </p>
      <p className={cn("text-[10px] font-medium", colorMap[color].text)}>
        {label}
      </p>
    </div>
  );
}