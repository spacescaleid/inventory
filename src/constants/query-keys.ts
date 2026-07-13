export const queryKeys = {
  all: ["inventory"] as const,

  auth: {
    all: () => [...queryKeys.all, "auth"] as const,
    user: () => [...queryKeys.auth.all(), "user"] as const,
  },

  users: {
    all: () => [...queryKeys.all, "users"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.all(), "list", filters] as const,
    detail: (id: string) => [...queryKeys.users.all(), "detail", id] as const,
  },

  categories: {
    all: () => [...queryKeys.all, "categories"] as const,
    list: () => [...queryKeys.categories.all(), "list"] as const,
    detail: (id: string) =>
      [...queryKeys.categories.all(), "detail", id] as const,
  },

  uniformTypes: {
    all: () => [...queryKeys.all, "uniformTypes"] as const,
    list: (categoryId?: string) =>
      [...queryKeys.uniformTypes.all(), "list", { categoryId }] as const,
    detail: (id: string) =>
      [...queryKeys.uniformTypes.all(), "detail", id] as const,
  },

  stockItems: {
    all: () => [...queryKeys.all, "stockItems"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.stockItems.all(), "list", filters] as const,
    detail: (id: string) =>
      [...queryKeys.stockItems.all(), "detail", id] as const,
    grouped: () => [...queryKeys.stockItems.all(), "grouped"] as const,
    menipis: (threshold?: number) =>
      [...queryKeys.stockItems.all(), "menipis", { threshold }] as const,
    byUniformType: (uniformTypeId: string) =>
      [...queryKeys.stockItems.all(), "byUniformType", uniformTypeId] as const,
  },

  classes: {
    all: () => [...queryKeys.all, "classes"] as const,
    list: () => [...queryKeys.classes.all(), "list"] as const,
  },

  students: {
    all: () => [...queryKeys.all, "students"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.students.all(), "list", filters] as const,
    detail: (id: string) =>
      [...queryKeys.students.all(), "detail", id] as const,
    byClass: (classId: string) =>
      [...queryKeys.students.all(), "byClass", classId] as const,
  },

  transactions: {
    all: () => [...queryKeys.all, "transactions"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.transactions.all(), "list", filters] as const,
    detail: (id: string) =>
      [...queryKeys.transactions.all(), "detail", id] as const,
    terakhir: (limit?: number) =>
      [...queryKeys.transactions.all(), "terakhir", { limit }] as const,
    stats: () => [...queryKeys.transactions.all(), "stats"] as const,
  },

  stockLogs: {
    all: () => [...queryKeys.all, "stockLogs"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.stockLogs.all(), "list", filters] as const,
    byStockItem: (stockItemId: string) =>
      [...queryKeys.stockLogs.all(), "byStockItem", stockItemId] as const,
  },

  dashboard: {
    all: () => [...queryKeys.all, "dashboard"] as const,
    adminStats: () => [...queryKeys.dashboard.all(), "adminStats"] as const,
    operatorStats: () =>
      [...queryKeys.dashboard.all(), "operatorStats"] as const,
  },
} as const;