import type { Transaksi, TransactionItem } from "@/types";

/**
 * Group transaksi by tanggal.
 * Returns: array of { date, items } sorted newest first.
 */
export function groupTransactionsByDate(
  transactions: (Transaksi & { items: TransactionItem[] })[]
): { date: string; items: (Transaksi & { items: TransactionItem[] })[] }[] {
  const groups = new Map<
    string,
    (Transaksi & { items: TransactionItem[] })[]
  >();

  transactions.forEach((trx) => {
    // Group by YYYY-MM-DD
    const dateKey = new Date(trx.created).toISOString().split("T")[0];
    const existing = groups.get(dateKey) || [];
    groups.set(dateKey, [...existing, trx]);
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a)) // newest first
    .map(([date, items]) => ({ date, items }));
}