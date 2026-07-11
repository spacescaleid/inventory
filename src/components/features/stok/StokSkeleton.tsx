import { Skeleton } from "@/components/shared/LoadingSkeleton";

/**
 * Skeleton untuk halaman stok — 2 kategori × 2 card.
 */
export function StokSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((section) => (
        <section key={section}>
          {/* Section header */}
          <div className="mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-[var(--color-neutral-200)]" />
            <Skeleton className="h-3 w-32" />
            <div className="h-px flex-1 bg-[var(--color-neutral-200)]" />
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {[1, 2].map((card) => (
              <div key={card} className="rounded-xl bg-white shadow-sm">
                <div className="border-b border-[var(--color-neutral-100)] px-4 py-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-2 h-3 w-16" />
                </div>
                <div className="flex gap-2 px-4 py-3">
                  {[1, 2, 3, 4, 5].map((chip) => (
                    <Skeleton
                      key={chip}
                      className="h-14 min-w-[64px] rounded-lg"
                    />
                  ))}
                </div>
                <div className="border-t border-[var(--color-neutral-100)] px-4 py-3">
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}