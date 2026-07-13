export const COLLECTIONS = {
  USERS: "users",
  CATEGORIES: "categories",
  UNIFORM_TYPES: "uniform_types",
  STOCK_ITEMS: "stock_items",
  TRANSACTIONS: "transactions",
  TRANSACTION_ITEMS: "transaction_items",
  STOCK_LOGS: "stock_logs",
  CLASSES: "classes",
  STUDENTS: "students",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];