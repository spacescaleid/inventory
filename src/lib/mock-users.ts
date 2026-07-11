import type { User } from "@/types";

// ============================================
// MOCK USERS — hanya untuk development
// ============================================

const BASE_TIME = "2025-01-15T10:00:00.000Z";

const baseRecord = {
  collectionId: "users",
  collectionName: "users",
  created: BASE_TIME,
  updated: BASE_TIME,
};

export const mockUsers: User[] = [
  {
    ...baseRecord,
    id: "usr-1",
    email: "admin@sekolah.id",
    username: "admin",
    name: "Administrator",
    role: "admin",
    is_active: true,
    last_login: BASE_TIME,
  },
  {
    ...baseRecord,
    id: "usr-2",
    email: "bu.rina@sekolah.id",
    username: "burina",
    name: "Bu Rina",
    role: "operator",
    is_active: true,
    last_login: BASE_TIME,
  },
  {
    ...baseRecord,
    id: "usr-3",
    email: "pak.dedi@sekolah.id",
    username: "pakdedi",
    name: "Pak Dedi",
    role: "operator",
    is_active: true,
    last_login: "2025-01-14T08:30:00.000Z",
  },
  {
    ...baseRecord,
    id: "usr-4",
    email: "bu.siti@sekolah.id",
    username: "busiti",
    name: "Bu Siti",
    role: "operator",
    is_active: false,
    last_login: "2024-12-20T14:15:00.000Z",
  },
];

// ============================================
// Mock credentials untuk login
// ============================================
// Password default: "password123"
export const MOCK_CREDENTIALS: Record<
  string,
  { userId: string; password: string }
> = {
  "admin@sekolah.id": { userId: "usr-1", password: "password123" },
  admin: { userId: "usr-1", password: "password123" },
  "bu.rina@sekolah.id": { userId: "usr-2", password: "password123" },
  burina: { userId: "usr-2", password: "password123" },
};

// ============================================
// Helper functions
// ============================================

export function getMockUserByCredentials(
  identity: string,
  password: string
): User | null {
  const cred = MOCK_CREDENTIALS[identity.toLowerCase()];
  if (!cred || cred.password !== password) return null;

  const user = mockUsers.find((u) => u.id === cred.userId);
  if (!user || !user.is_active) return null;

  return user;
}

export function getMockUserById(id: string): User | null {
  return mockUsers.find((u) => u.id === id) ?? null;
}

export function searchMockUsers(query: string, role?: string): User[] {
  let filtered = [...mockUsers];

  if (role && role !== "all") {
    filtered = filtered.filter((u) => u.role === role);
  }

  if (query.trim()) {
    const q = query.trim().toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
    );
  }

  return filtered;
}