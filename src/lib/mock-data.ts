import type {
  Kategori,
  JenisSeragam,
  StockItem,
  Transaksi,
  TransactionItem,
  StokGrouped,
} from "@/types";

// ============================================
// MOCK DATA — hanya untuk development
// Timestamp dibuat FIXED supaya tidak hydration mismatch
// ============================================

// FIXED timestamps — sengaja hardcoded supaya SSR & CSR sama
// Nanti pas integrasi PocketBase, timestamp dari server (jadi konsisten)
const BASE_TIME = "2025-01-15T10:00:00.000Z";
const baseDate = new Date(BASE_TIME);

const nowStr = baseDate.toISOString();
const oneHourAgoStr = new Date(baseDate.getTime() - 60 * 60 * 1000).toISOString();
const twoHoursAgoStr = new Date(baseDate.getTime() - 2 * 60 * 60 * 1000).toISOString();
const threeHoursAgoStr = new Date(baseDate.getTime() - 3 * 60 * 60 * 1000).toISOString();
const yesterdayStr = new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString();
const twoDaysAgoStr = new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
const threeDaysAgoStr = new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
const oneWeekAgoStr = new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

const baseRecord = {
  collectionId: "mock",
  collectionName: "mock",
  created: nowStr,
  updated: nowStr,
};

export const mockKategoris: Kategori[] = [
  { ...baseRecord, id: "kat-1", nama: "Seragam Harian", urutan: 1 },
  { ...baseRecord, id: "kat-2", nama: "Seragam Olahraga", urutan: 2 },
  { ...baseRecord, id: "kat-3", nama: "Seragam Pramuka", urutan: 3 },
];

export const mockJenis: JenisSeragam[] = [
  {
    ...baseRecord,
    id: "jns-1",
    category: "kat-1",
    nama: "Baju Atasan",
    expand: { category: mockKategoris[0] },
  },
  {
    ...baseRecord,
    id: "jns-2",
    category: "kat-1",
    nama: "Celana Panjang",
    expand: { category: mockKategoris[0] },
  },
  {
    ...baseRecord,
    id: "jns-3",
    category: "kat-2",
    nama: "Kaos Olahraga",
    expand: { category: mockKategoris[1] },
  },
];

export const mockStockItems: StockItem[] = [
  {
    ...baseRecord,
    id: "stk-1",
    uniform_type: "jns-1",
    ukuran: "S",
    stok: 12,
    harga: 85000,
    expand: { uniform_type: mockJenis[0] },
  },
  {
    ...baseRecord,
    id: "stk-2",
    uniform_type: "jns-1",
    ukuran: "M",
    stok: 49,
    harga: 85000,
    expand: { uniform_type: mockJenis[0] },
  },
  {
    ...baseRecord,
    id: "stk-3",
    uniform_type: "jns-1",
    ukuran: "L",
    stok: 35,
    harga: 85000,
    expand: { uniform_type: mockJenis[0] },
  },
  {
    ...baseRecord,
    id: "stk-4",
    uniform_type: "jns-1",
    ukuran: "XL",
    stok: 3,
    harga: 85000,
    expand: { uniform_type: mockJenis[0] },
  },
  {
    ...baseRecord,
    id: "stk-5",
    uniform_type: "jns-1",
    ukuran: "XXL",
    stok: 0,
    harga: 85000,
    expand: { uniform_type: mockJenis[0] },
  },
  {
    ...baseRecord,
    id: "stk-6",
    uniform_type: "jns-2",
    ukuran: "32",
    stok: 29,
    harga: 95000,
    expand: { uniform_type: mockJenis[1] },
  },
  {
    ...baseRecord,
    id: "stk-7",
    uniform_type: "jns-2",
    ukuran: "36",
    stok: 1,
    harga: 95000,
    expand: { uniform_type: mockJenis[1] },
  },
  {
    ...baseRecord,
    id: "stk-8",
    uniform_type: "jns-3",
    ukuran: "L",
    stok: 2,
    harga: 75000,
    expand: { uniform_type: mockJenis[2] },
  },
];

export const mockTransactions: (Transaksi & { items: TransactionItem[] })[] = [
  {
    ...baseRecord,
    id: "trx-1",
    nama_siswa: "Budi Santoso",
    kelas: "VII-A",
    catatan: "",
    is_cancelled: false,
    cancelled_at: null,
    created: oneHourAgoStr,
    items: [
      {
        ...baseRecord,
        id: "ti-1",
        transaction: "trx-1",
        stock_item: "stk-2",
        jumlah: 1,
        stok_sebelum: 50,
        stok_sesudah: 49,
        expand: { stock_item: mockStockItems[1] },
      },
      {
        ...baseRecord,
        id: "ti-2",
        transaction: "trx-1",
        stock_item: "stk-6",
        jumlah: 1,
        stok_sebelum: 30,
        stok_sesudah: 29,
        expand: { stock_item: mockStockItems[5] },
      },
    ],
  },
  {
    ...baseRecord,
    id: "trx-2",
    nama_siswa: "Siti Aminah",
    kelas: "VII-B",
    catatan: "",
    is_cancelled: false,
    cancelled_at: null,
    created: twoHoursAgoStr,
    items: [
      {
        ...baseRecord,
        id: "ti-3",
        transaction: "trx-2",
        stock_item: "stk-3",
        jumlah: 1,
        stok_sebelum: 36,
        stok_sesudah: 35,
        expand: { stock_item: mockStockItems[2] },
      },
    ],
  },
  {
    ...baseRecord,
    id: "trx-3",
    nama_siswa: "Andi Wijaya",
    kelas: "VIII-C",
    catatan: "Tukar ukuran karena kekecilan",
    is_cancelled: false,
    cancelled_at: null,
    created: threeHoursAgoStr,
    items: [
      {
        ...baseRecord,
        id: "ti-4",
        transaction: "trx-3",
        stock_item: "stk-2",
        jumlah: 1,
        stok_sebelum: 51,
        stok_sesudah: 50,
        expand: { stock_item: mockStockItems[1] },
      },
      {
        ...baseRecord,
        id: "ti-5",
        transaction: "trx-3",
        stock_item: "stk-6",
        jumlah: 1,
        stok_sebelum: 31,
        stok_sesudah: 30,
        expand: { stock_item: mockStockItems[5] },
      },
      {
        ...baseRecord,
        id: "ti-6",
        transaction: "trx-3",
        stock_item: "stk-8",
        jumlah: 1,
        stok_sebelum: 3,
        stok_sesudah: 2,
        expand: { stock_item: mockStockItems[7] },
      },
    ],
  },
  {
    ...baseRecord,
    id: "trx-4",
    nama_siswa: "Rina Kusuma",
    kelas: "VII-A",
    catatan: "",
    is_cancelled: false,
    cancelled_at: null,
    created: yesterdayStr,
    items: [
      {
        ...baseRecord,
        id: "ti-7",
        transaction: "trx-4",
        stock_item: "stk-1",
        jumlah: 1,
        stok_sebelum: 13,
        stok_sesudah: 12,
        expand: { stock_item: mockStockItems[0] },
      },
    ],
  },
  {
    ...baseRecord,
    id: "trx-5",
    nama_siswa: "Dedi Prasetyo",
    kelas: "VIII-A",
    catatan: "",
    is_cancelled: false,
    cancelled_at: null,
    created: yesterdayStr,
    items: [
      {
        ...baseRecord,
        id: "ti-8",
        transaction: "trx-5",
        stock_item: "stk-3",
        jumlah: 1,
        stok_sebelum: 37,
        stok_sesudah: 36,
        expand: { stock_item: mockStockItems[2] },
      },
      {
        ...baseRecord,
        id: "ti-9",
        transaction: "trx-5",
        stock_item: "stk-7",
        jumlah: 1,
        stok_sebelum: 2,
        stok_sesudah: 1,
        expand: { stock_item: mockStockItems[6] },
      },
    ],
  },
  {
    ...baseRecord,
    id: "trx-6",
    nama_siswa: "Nina Marlina",
    kelas: "IX-B",
    catatan: "",
    is_cancelled: true,
    cancelled_at: twoDaysAgoStr,
    created: twoDaysAgoStr,
    items: [
      {
        ...baseRecord,
        id: "ti-10",
        transaction: "trx-6",
        stock_item: "stk-4",
        jumlah: 1,
        stok_sebelum: 4,
        stok_sesudah: 3,
        expand: { stock_item: mockStockItems[3] },
      },
    ],
  },
  {
    ...baseRecord,
    id: "trx-7",
    nama_siswa: "Fajar Nugroho",
    kelas: "VII-C",
    catatan: "",
    is_cancelled: false,
    cancelled_at: null,
    created: threeDaysAgoStr,
    items: [
      {
        ...baseRecord,
        id: "ti-11",
        transaction: "trx-7",
        stock_item: "stk-2",
        jumlah: 2,
        stok_sebelum: 52,
        stok_sesudah: 50,
        expand: { stock_item: mockStockItems[1] },
      },
    ],
  },
  {
    ...baseRecord,
    id: "trx-8",
    nama_siswa: "Maya Sari",
    kelas: "X-IPA-1",
    catatan: "",
    is_cancelled: false,
    cancelled_at: null,
    created: oneWeekAgoStr,
    items: [
      {
        ...baseRecord,
        id: "ti-12",
        transaction: "trx-8",
        stock_item: "stk-1",
        jumlah: 1,
        stok_sebelum: 14,
        stok_sesudah: 13,
        expand: { stock_item: mockStockItems[0] },
      },
    ],
  },
];

// ============================================
// Helper functions untuk mock queries
// ============================================

export function getMockStokMenipis(threshold: number = 5) {
  return mockStockItems
    .filter((item) => item.stok > 0 && item.stok <= threshold)
    .sort((a, b) => a.stok - b.stok);
}

export function getMockTransaksiTerakhir(limit: number = 5) {
  return mockTransactions
    .filter((t) => !t.is_cancelled)
    .slice(0, limit);
}

export function getMockStats() {
  const totalItems = mockStockItems.reduce((sum, item) => sum + item.stok, 0);

  // Untuk mock: hardcode berdasarkan BASE_TIME
  const trxToday = mockTransactions.filter(
    (trx) =>
      new Date(trx.created).toDateString() === baseDate.toDateString() &&
      !trx.is_cancelled
  );

  return {
    totalItems,
    totalSiswaHariIni: new Set(trxToday.map((t) => t.nama_siswa)).size,
    totalTransaksiHariIni: trxToday.length,
  };
}

// ============================================
// Helper: Grouped view untuk halaman stok
// ============================================

export function getMockStokGrouped(): StokGrouped[] {
  const result: StokGrouped[] = [];

  for (const kategori of mockKategoris) {
    const jenisInKategori = mockJenis.filter(
      (j) => j.category === kategori.id
    );

    const jenisList = jenisInKategori.map((jenis) => ({
      jenis,
      items: mockStockItems
        .filter((item) => item.uniform_type === jenis.id)
        .sort((a, b) => {
          const aNum = parseFloat(a.ukuran);
          const bNum = parseFloat(b.ukuran);
          if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
          return a.ukuran.localeCompare(b.ukuran);
        }),
    }));

    if (jenisList.some((j) => j.items.length > 0)) {
      result.push({ kategori, jenisList });
    }
  }

  return result;
}

export function filterMockStokGrouped(
  search: string,
  kategoriId: string | null
): StokGrouped[] {
  let grouped = getMockStokGrouped();

  if (kategoriId) {
    grouped = grouped.filter((g) => g.kategori.id === kategoriId);
  }

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    grouped = grouped
      .map((g) => ({
        ...g,
        jenisList: g.jenisList
          .map((j) => ({
            ...j,
            items: j.items.filter(
              (item) =>
                j.jenis.nama.toLowerCase().includes(q) ||
                item.ukuran.toLowerCase().includes(q) ||
                g.kategori.nama.toLowerCase().includes(q)
            ),
          }))
          .filter((j) => j.items.length > 0),
      }))
      .filter((g) => g.jenisList.length > 0);
  }

  return grouped;
}

// ============================================
// Helper: Autocomplete data
// ============================================

export function getMockNamaSiswaSuggestions(query: string): string[] {
  const freq = new Map<string, { count: number; kelas: string }>();

  mockTransactions.forEach((trx) => {
    const key = trx.nama_siswa;
    const existing = freq.get(key);
    freq.set(key, {
      count: (existing?.count ?? 0) + 1,
      kelas: trx.kelas,
    });
  });

  const q = query.trim().toLowerCase();
  const all = Array.from(freq.entries())
    .map(([nama, data]) => ({ nama, ...data }))
    .filter((item) => !q || item.nama.toLowerCase().includes(q))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return all.map((item) => `${item.nama} (${item.kelas})`);
}

export function getMockKelasSuggestions(query: string): string[] {
  const unique = new Set(mockTransactions.map((t) => t.kelas));
  const q = query.trim().toLowerCase();
  return Array.from(unique)
    .filter((k) => !q || k.toLowerCase().includes(q))
    .sort()
    .slice(0, 5);
}

export function getMockUkuranSuggestions(
  uniformTypeId: string,
  query: string
): string[] {
  const q = query.trim().toLowerCase();
  return mockStockItems
    .filter((item) => item.uniform_type === uniformTypeId)
    .map((item) => item.ukuran)
    .filter((ukuran, idx, arr) => arr.indexOf(ukuran) === idx)
    .filter((ukuran) => !q || ukuran.toLowerCase().includes(q))
    .sort();
}

export function getMockStockItemById(id: string): StockItem | null {
  return mockStockItems.find((item) => item.id === id) ?? null;
}

export function getMockJenisByKategori(kategoriId: string) {
  return mockJenis.filter((j) => j.category === kategoriId);
}

export function getMockStockByJenis(jenisId: string): StockItem[] {
  return mockStockItems
    .filter((item) => item.uniform_type === jenisId)
    .sort((a, b) => {
      const aNum = parseFloat(a.ukuran);
      const bNum = parseFloat(b.ukuran);
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      return a.ukuran.localeCompare(b.ukuran);
    });
}

// ============================================
// Helper: Riwayat / Transaksi
// ============================================

export type RiwayatPeriode =
  | "hari-ini"
  | "minggu-ini"
  | "bulan-ini"
  | "semua"
  | "custom";

interface RiwayatFilterOptions {
  search: string;
  periode: RiwayatPeriode;
  dateFrom: string | null;
  dateTo: string | null;
  includeCancelled?: boolean;
}

export function filterMockTransactions(
  options: RiwayatFilterOptions
): (Transaksi & { items: TransactionItem[] })[] {
  let filtered = [...mockTransactions];

  // Untuk mock: pakai BASE_TIME sebagai "now" supaya konsisten
  const now = baseDate;
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  if (options.periode === "hari-ini") {
    filtered = filtered.filter(
      (trx) => new Date(trx.created) >= startOfToday
    );
  } else if (options.periode === "minggu-ini") {
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
    filtered = filtered.filter((trx) => new Date(trx.created) >= startOfWeek);
  } else if (options.periode === "bulan-ini") {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    filtered = filtered.filter(
      (trx) => new Date(trx.created) >= startOfMonth
    );
  } else if (options.periode === "custom") {
    if (options.dateFrom) {
      const from = new Date(options.dateFrom);
      filtered = filtered.filter((trx) => new Date(trx.created) >= from);
    }
    if (options.dateTo) {
      const to = new Date(options.dateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((trx) => new Date(trx.created) <= to);
    }
  }

  if (options.search.trim()) {
    const q = options.search.trim().toLowerCase();
    filtered = filtered.filter(
      (trx) =>
        trx.nama_siswa.toLowerCase().includes(q) ||
        trx.kelas.toLowerCase().includes(q)
    );
  }

  filtered.sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );

  return filtered;
}

export function groupTransactionsByDate(
  transactions: (Transaksi & { items: TransactionItem[] })[]
): { date: string; items: (Transaksi & { items: TransactionItem[] })[] }[] {
  const groups = new Map<
    string,
    (Transaksi & { items: TransactionItem[] })[]
  >();

  transactions.forEach((trx) => {
    const dateKey = new Date(trx.created).toISOString().split("T")[0];
    const existing = groups.get(dateKey) || [];
    groups.set(dateKey, [...existing, trx]);
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({ date, items }));
}

export function getMockTransactionById(
  id: string
): (Transaksi & { items: TransactionItem[] }) | null {
  return mockTransactions.find((trx) => trx.id === id) ?? null;
}