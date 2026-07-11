import type { StokStatus } from "@/types";
import { getStokStatusLabel } from "@/utils/stok";
import { cn } from "@/utils/cn";

interface StatusBadgeProps {
  status: StokStatus;
  count?: number;
  showLabel?: boolean;
  className?: string;
}

const STATUS_STYLES: Record<StokStatus, string> = {
  aman: "bg-[var(--color-success-100)] text-[var(--color-success-700)]",
  tipis: "bg-[var(--color-warning-100)] text-[var(--color-warning-700)]",
  kritis: "bg-[var(--color-danger-100)] text-[var(--color-danger-600)]",
  habis: "bg-[var(--color-danger-100)] text-[var(--color-danger-700)]",
  defisit: "bg-[var(--color-danger-50)] text-[var(--color-danger-700)]",
};

const STATUS_ICONS: Record<StokStatus, string> = {
  aman: "●",
  tipis: "⚠",
  kritis: "⚠",
  habis: "✗",
  defisit: "!",
};

export function StatusBadge({
  status,
  count,
  showLabel = true,
  className,
}: StatusBadgeProps) {
  const label = getStokStatusLabel(status);
  const icon = STATUS_ICONS[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
      role="status"
      aria-label={`Status stok: ${label}${count !== undefined ? `, ${count} unit` : ""}`}
    >
      <span aria-hidden="true">{icon}</span>
      {count !== undefined && <span className="font-mono">{count}</span>}
      {showLabel && count === undefined && <span>{label}</span>}
    </span>
  );
}