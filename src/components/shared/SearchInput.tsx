"use client";

import { Search, X } from "lucide-react";
import { forwardRef, useState } from "react";
import { cn } from "@/utils/cn";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

/**
 * Search input dengan icon, clear button, dan mobile-friendly styling.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, placeholder = "Cari...", ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(value ?? "");
    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = String(currentValue).length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue("");
      onClear?.();
    };

    return (
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-neutral-400)]"
          aria-hidden="true"
        />

        <input
          ref={ref}
          type="search"
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "h-11 w-full rounded-md border border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] pl-10 pr-10 text-sm text-[var(--color-neutral-800)] placeholder:text-[var(--color-neutral-400)]",
            "transition-colors focus:border-[var(--color-primary-500)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]",
            className
          )}
          {...props}
        />

        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Hapus pencarian"
            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--color-neutral-400)] transition-colors hover:bg-[var(--color-neutral-200)] hover:text-[var(--color-neutral-600)]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";