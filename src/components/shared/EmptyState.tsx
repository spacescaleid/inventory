import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

/**
 * Empty state — untuk kondisi tidak ada data.
 * Selalu ada icon, title, dan optional description + action.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8" : "py-12",
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            "mb-4 flex items-center justify-center rounded-full bg-[var(--color-neutral-100)]",
            compact ? "h-12 w-12" : "h-16 w-16"
          )}
        >
          <Icon
            className={cn(
              "text-[var(--color-neutral-400)]",
              compact ? "h-6 w-6" : "h-8 w-8"
            )}
          />
        </div>
      )}

      <h3
        className={cn(
          "font-semibold text-[var(--color-neutral-800)]",
          compact ? "text-sm" : "text-base"
        )}
      >
        {title}
      </h3>

      {description && (
        <p className="mt-1 max-w-xs text-sm text-[var(--color-neutral-500)]">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}