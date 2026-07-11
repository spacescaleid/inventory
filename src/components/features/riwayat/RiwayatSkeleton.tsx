import { Skeleton } from "@/components/shared/LoadingSkeleton";

export function RiwayatSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((section) => (
        <section key={section}>
          <div className="mb-3 flex items-center gap-2 px-1">
            <Skeleton className="h-3 w-20" />
            <div className="h-px flex-1 bg-[var(--color-neutral-200)]" />
            <Skeleton className="h-3 w-16" />
          </div>

          <div className="space-y-2">
            {[1, 2, 3].map((card) => (
              <div key={card} className="rounded-xl bg-white p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-14 rounded-full" />
                    </div>
                    <Skeleton className="mt-2 h-3 w-48" />
                    <Skeleton className="mt-1.5 h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}