"use client";

import { Check, ChevronDown, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/utils/cn";

export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface CustomSelectProps<T extends string = string> {
  value: T | "";
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  emptyMessage?: string;
  id?: string;
  "aria-invalid"?: boolean;
  renderOption?: (option: SelectOption<T>) => ReactNode;
}

/**
 * Custom Select yang reliable, mobile-friendly.
 * - Dropdown di desktop
 * - Full-screen sheet di mobile
 */
export function CustomSelect<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Pilih...",
  disabled = false,
  className,
  triggerClassName,
  emptyMessage = "Tidak ada pilihan",
  id,
  renderOption,
  ...props
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, isMobile]);

  // Lock body scroll saat sheet buka di mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, isMobile]);

  const handleSelect = (opt: SelectOption<T>) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setIsOpen((v) => !v)}
        aria-invalid={props["aria-invalid"]}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] px-3 text-left text-sm text-[var(--color-neutral-800)] transition-colors",
          "focus:border-[var(--color-primary-500)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-[var(--color-danger-500)] aria-invalid:ring-2 aria-invalid:ring-[var(--color-danger-100)]",
          triggerClassName
        )}
      >
        {selectedOption ? (
          <span className="truncate">{selectedOption.label}</span>
        ) : (
          <span className="truncate text-[var(--color-neutral-400)]">
            {placeholder}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 flex-shrink-0 text-[var(--color-neutral-400)] transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Desktop dropdown */}
      {isOpen && !isMobile && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-md border border-[var(--color-neutral-200)] bg-white shadow-lg"
          role="listbox"
        >
          {options.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-[var(--color-neutral-400)]">
              {emptyMessage}
            </div>
          ) : (
            options.map((opt) => (
              <OptionButton
                key={opt.value}
                opt={opt}
                isSelected={opt.value === value}
                onSelect={handleSelect}
                renderOption={renderOption}
              />
            ))
          )}
        </div>
      )}

      {/* Mobile bottom sheet */}
      {isOpen && isMobile && (
        <div className="fixed inset-0 z-[100]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Handle */}
            <div className="mx-auto mt-3 h-1 w-8 rounded-full bg-[var(--color-neutral-300)]" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <h3 className="text-sm font-semibold text-[var(--color-neutral-800)]">
                {placeholder}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-neutral-400)] hover:bg-[var(--color-neutral-100)]"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Options */}
            <div className="max-h-[60vh] overflow-y-auto pb-safe">
              {options.length === 0 ? (
                <div className="px-3 py-8 text-center text-sm text-[var(--color-neutral-400)]">
                  {emptyMessage}
                </div>
              ) : (
                options.map((opt) => (
                  <OptionButton
                    key={opt.value}
                    opt={opt}
                    isSelected={opt.value === value}
                    onSelect={handleSelect}
                    renderOption={renderOption}
                    isMobile
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OptionButton<T extends string>({
  opt,
  isSelected,
  onSelect,
  renderOption,
  isMobile,
}: {
  opt: SelectOption<T>;
  isSelected: boolean;
  onSelect: (opt: SelectOption<T>) => void;
  renderOption?: (opt: SelectOption<T>) => ReactNode;
  isMobile?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(opt)}
      disabled={opt.disabled}
      role="option"
      aria-selected={isSelected}
      className={cn(
        "flex w-full items-center justify-between gap-2 px-3 text-left transition-colors",
        isMobile ? "py-3.5 text-sm" : "py-2.5 text-sm",
        opt.disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer hover:bg-[var(--color-neutral-50)]",
        isSelected &&
          "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
      )}
    >
      <div className="min-w-0 flex-1">
        {renderOption ? (
          renderOption(opt)
        ) : (
          <>
            <div className="truncate">{opt.label}</div>
            {opt.description && (
              <div className="mt-0.5 truncate text-xs text-[var(--color-neutral-500)]">
                {opt.description}
              </div>
            )}
          </>
        )}
      </div>

      {isSelected && (
        <Check className="h-4 w-4 flex-shrink-0 text-[var(--color-primary-500)]" />
      )}
    </button>
  );
}