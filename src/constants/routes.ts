export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",

  // ── OPERATOR ROUTES ──
  BERANDA: "/beranda",
  STOK: "/stok",
  STOK_DETAIL: (id: string) => `/stok/${id}`,
  CATAT: "/catat",
  RIWAYAT: "/riwayat",
  RIWAYAT_DETAIL: (id: string) => `/riwayat/${id}`,
  PROFIL: "/profil",

  // Operator: kelola data master (kategori, jenis, kelas)
  KELOLA_DATA: "/kelola-data",
  KELOLA_KATEGORI: "/kelola-data/kategori",
  KELOLA_JENIS: "/kelola-data/jenis",
  KELOLA_KELAS: "/kelola-data/kelas",

  // ── ADMIN ROUTES ──
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_KATEGORI: "/admin/kategori",
  ADMIN_JENIS: "/admin/jenis",
  ADMIN_KELAS: "/admin/kelas",
  ADMIN_LAPORAN: "/admin/laporan",
  ADMIN_PENGATURAN: "/admin/pengaturan",
  ADMIN_PROFIL: "/admin/profil",
} as const;

// Bottom nav untuk OPERATOR
export const OPERATOR_NAV = [
  { label: "Beranda", href: ROUTES.BERANDA, icon: "Home" },
  { label: "Stok", href: ROUTES.STOK, icon: "Package" },
  {
    label: "Ambil",
    href: ROUTES.CATAT,
    icon: "ClipboardPen",
    primary: true,
  },
  { label: "Riwayat", href: ROUTES.RIWAYAT, icon: "History" },
  { label: "Profil", href: ROUTES.PROFIL, icon: "User" },
] as const;

// Bottom nav untuk ADMIN
export const ADMIN_NAV = [
  { label: "Dashboard", href: ROUTES.ADMIN, icon: "LayoutDashboard" },
  { label: "User", href: ROUTES.ADMIN_USERS, icon: "Users" },
  { label: "Data", href: ROUTES.ADMIN_KATEGORI, icon: "Database" },
  { label: "Laporan", href: ROUTES.ADMIN_LAPORAN, icon: "BarChart3" },
  { label: "Profil", href: ROUTES.ADMIN_PROFIL, icon: "User" },
] as const;