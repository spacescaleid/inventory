import Papa from "papaparse";
import type { Transaksi, TransactionItem } from "@/types";

interface ExportRow {
  No: number;
  Tanggal: string;
  Waktu: string;
  "Nama Siswa": string;
  Kelas: string;
  Kategori: string;
  Jenis: string;
  Ukuran: string;
  Jumlah: number;
}

/**
 * Convert data transaksi ke CSV dan trigger download
 */
export function exportTransaksiToCSV(
  transaksiList: (Transaksi & { items?: TransactionItem[] })[],
  filename?: string
): void {
  const rows: ExportRow[] = [];
  let no = 1;

  transaksiList.forEach((trx) => {
    const date = new Date(trx.created);
    const items = trx.items || trx.expand?.["transaction_items(transaction)"] || [];

    items.forEach((item) => {
      const stockItem = item.expand?.stock_item;
      const jenis = stockItem?.expand?.uniform_type;
      const kategori = jenis?.expand?.category;

      rows.push({
        No: no++,
        Tanggal: date.toLocaleDateString("id-ID"),
        Waktu: date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        "Nama Siswa": trx.nama_siswa,
        Kelas: trx.kelas,
        Kategori: kategori?.nama || "-",
        Jenis: jenis?.nama || "-",
        Ukuran: stockItem?.ukuran || "-",
        Jumlah: item.jumlah,
      });
    });
  });

  const csv = Papa.unparse(rows);
  downloadCSV(csv, filename);
}

/**
 * Trigger download file CSV
 */
function downloadCSV(csv: string, filename?: string): void {
  const timestamp = new Date().toISOString().split("T")[0];
  const finalFilename = filename || `riwayat-pengambilan-${timestamp}.csv`;

  const blob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", finalFilename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}