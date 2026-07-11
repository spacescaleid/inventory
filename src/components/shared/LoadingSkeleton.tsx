import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton loading dengan shimmer effect.
 * Gunakan untuk placeholder konten yang sedang dimuat.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-[var(--color-neutral-200)]",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_1.5s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        className
      )}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton untuk summary card (2-column grid di dashboard)
 */
export function SummaryCardSkeleton() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <Skeleton className="h-6 w-6 rounded-full" />
      <Skeleton className="mt-3 h-3 w-20" />
      <Skeleton className="mt-2 h-8 w-16" />
      <Skeleton className="mt-1 h-3 w-24" />
    </div>
  );
}

/**
 * Skeleton untuk list item
 */
export function ListItemSkeleton() {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-2 h-3 w-48" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}