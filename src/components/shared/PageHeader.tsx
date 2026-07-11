import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Section header dengan title, description, dan optional action.
 * Digunakan di dalam halaman, BUKAN untuk top app bar.
 */
export function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-semibold text-[var(--color-neutral-800)]">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs text-[var(--color-neutral-500)]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}