"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface FilterChipOption<T = string> {
  value: T;
  label: string;
  count?: number;
  icon?: ReactNode;
}

interface FilterChipsProps<T = string> {
  options: FilterChipOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  allowClear?: boolean;
  allLabel?: string;
  className?: string;
}

/**
 * Horizontal scrollable filter chips.
 * Selalu ada opsi "Semua" di paling depan (jika allowClear).
 */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  allowClear = true,
  allLabel = "Semua",
  className,
}: FilterChipsProps<T>) {
  return (
    <div
      className={cn(
        "-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1",
        "scrollbar-hide", // custom class kalau mau hide scrollbar
        className
      )}
      style={{ scrollbarWidth: "none" }}
    >
      {allowClear && (
        <FilterChip
          label={allLabel}
          isActive={value === null}
          onClick={() => onChange(null)}
        />
      )}

      {options.map((option) => (
        <FilterChip
          key={String(option.value)}
          label={option.label}
          count={option.count}
          icon={option.icon}
          isActive={value === option.value}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  count?: number;
  icon?: ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function FilterChip({ label, count, icon, isActive, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        "flex h-9 flex-shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all",
        isActive
          ? "border-[var(--color-primary-200)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)]"
          : "border-[var(--color-neutral-200)] bg-white text-[var(--color-neutral-600)] hover:border-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-50)]"
      )}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span className="whitespace-nowrap">{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "font-mono text-[10px] font-semibold",
            isActive
              ? "text-[var(--color-primary-600)]"
              : "text-[var(--color-neutral-400)]"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}