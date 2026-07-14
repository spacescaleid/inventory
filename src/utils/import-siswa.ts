import * as XLSX from "xlsx";
import { normalizeNama, normalizeKelas } from "@/utils/format";

export interface RawStudentRow {
  rowNumber: number;
  nama: string;
  kelas: string;
  nis?: string;
  catatan?: string;
}

export interface ParsedStudentRow extends RawStudentRow {
  isValid: boolean;
  errors: string[];
  status: "valid" | "duplicate" | "error";
  classId?: string; // Diisi setelah cek ke master classes
}

/**
 * Parse Excel/CSV file ke array of student rows.
 * Auto-detect kolom berdasarkan header (case-insensitive).
 */
export async function parseFileToStudents(
  file: File
): Promise<RawStudentRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  // Ambil sheet pertama
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  // Convert ke JSON dengan header
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });

  if (rawRows.length === 0) {
    throw new Error("File kosong atau tidak ada data");
  }

  // Detect column mapping (case-insensitive)
  const firstRow = rawRows[0];
  const columnMap = detectColumns(Object.keys(firstRow));

  if (!columnMap.nama || !columnMap.kelas) {
    throw new Error(
      "File harus punya kolom 'Nama' dan 'Kelas'. " +
        "Cek template atau nama header di file kamu."
    );
  }

  // Parse setiap baris
  return rawRows.map((row, idx) => ({
    rowNumber: idx + 2, // +2 karena row 1 adalah header, index 0 = row 2
    nama: String(row[columnMap.nama!] || "").trim(),
    kelas: String(row[columnMap.kelas!] || "").trim(),
    nis: columnMap.nis
      ? String(row[columnMap.nis] || "").trim()
      : undefined,
    catatan: columnMap.catatan
      ? String(row[columnMap.catatan] || "").trim()
      : undefined,
  }));
}

/**
 * Auto-detect nama kolom (case-insensitive + fuzzy match)
 */
function detectColumns(headers: string[]): {
  nama?: string;
  kelas?: string;
  nis?: string;
  catatan?: string;
} {
  const result: {
    nama?: string;
    kelas?: string;
    nis?: string;
    catatan?: string;
  } = {};

  for (const header of headers) {
    const lower = header.toLowerCase().trim();

    // Nama
    if (
      !result.nama &&
      (lower === "nama" ||
        lower === "name" ||
        lower === "nama siswa" ||
        lower === "nama_siswa" ||
        lower === "student name")
    ) {
      result.nama = header;
    }

    // Kelas
    if (
      !result.kelas &&
      (lower === "kelas" || lower === "class" || lower === "grade")
    ) {
      result.kelas = header;
    }

    // NIS
    if (
      !result.nis &&
      (lower === "nis" ||
        lower === "no induk" ||
        lower === "nomor induk" ||
        lower === "student id" ||
        lower === "id")
    ) {
      result.nis = header;
    }

    // Catatan
    if (
      !result.catatan &&
      (lower === "catatan" ||
        lower === "note" ||
        lower === "notes" ||
        lower === "keterangan")
    ) {
      result.catatan = header;
    }
  }

  return result;
}

/**
 * Validasi & normalize rows.
 * Butuh master data: classes (untuk validasi kelas) & existing students (untuk cek duplicate)
 */
export function validateAndNormalizeRows(
  rows: RawStudentRow[],
  classes: { id: string; nama: string }[],
  existingStudents: { nama: string; classId: string }[]
): ParsedStudentRow[] {
  // Build lookup map
  const classMap = new Map<string, string>();
  classes.forEach((c) => {
    classMap.set(c.nama.toLowerCase(), c.id);
    classMap.set(normalizeKelas(c.nama).toLowerCase(), c.id);
  });

  const existingSet = new Set<string>();
  existingStudents.forEach((s) => {
    existingSet.add(`${s.nama.toLowerCase()}|${s.classId}`);
  });

  return rows.map((row) => {
    const errors: string[] = [];
    const namaNormalized = normalizeNama(row.nama);
    const kelasNormalized = normalizeKelas(row.kelas);

    // Validasi nama
    if (!namaNormalized) {
      errors.push("Nama kosong");
    } else if (namaNormalized.length > 100) {
      errors.push("Nama terlalu panjang (max 100)");
    }

    // Validasi kelas — harus ada di master
    let classId: string | undefined;
    if (!kelasNormalized) {
      errors.push("Kelas kosong");
    } else {
      classId = classMap.get(kelasNormalized.toLowerCase());
      if (!classId) {
        errors.push(`Kelas "${row.kelas}" tidak ada di master`);
      }
    }

    // NIS length check
    if (row.nis && row.nis.length > 20) {
      errors.push("NIS terlalu panjang (max 20)");
    }

    // Cek duplicate
    let status: "valid" | "duplicate" | "error" = "valid";
    if (errors.length > 0) {
      status = "error";
    } else if (
      classId &&
      existingSet.has(`${namaNormalized.toLowerCase()}|${classId}`)
    ) {
      status = "duplicate";
    }

    return {
      ...row,
      nama: namaNormalized,
      kelas: kelasNormalized,
      classId,
      isValid: errors.length === 0,
      errors,
      status,
    };
  });
}

/**
 * Generate template Excel untuk download.
 */
export function generateStudentTemplate(): void {
  const data = [
    {
      Nama: "Budi Santoso",
      Kelas: "VII-A",
      NIS: "12345",
      Catatan: "",
    },
    {
      Nama: "Siti Aminah",
      Kelas: "VII-A",
      NIS: "12346",
      Catatan: "Alergi kacang",
    },
    {
      Nama: "Andi Wijaya",
      Kelas: "VIII-B",
      NIS: "",
      Catatan: "",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 25 }, // Nama
    { wch: 12 }, // Kelas
    { wch: 15 }, // NIS
    { wch: 30 }, // Catatan
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa");

  // Download
  XLSX.writeFile(workbook, "template-siswa.xlsx");
}