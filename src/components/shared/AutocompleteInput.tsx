"use client";

import { Check } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { AUTOCOMPLETE } from "@/constants/stok";
import { cn } from "@/utils/cn";

interface AutocompleteInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  getSuggestions?: (query: string) => string[] | Promise<string[]>;
  allowNew?: boolean;
  parseSelected?: (selected: string) => string; // e.g. "Budi (VII-A)" → "Budi"
}

/**
 * Text input dengan autocomplete dropdown.
 *
 * Behavior:
 * - Dropdown muncul setelah user ketik minimal 1 karakter
 * - Debounced (150ms)
 * - Max 5 saran
 * - Bisa keyboard navigation (arrow up/down, enter, escape)
 * - Klik outside untuk close
 */
export const AutocompleteInput = forwardRef<
  HTMLInputElement,
  AutocompleteInputProps
>(
  (
    {
      value,
      onChange,
      suggestions: staticSuggestions,
      getSuggestions,
      allowNew = true,
      parseSelected,
      className,
      onFocus,
      onBlur,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const debouncedValue = useDebounce(value, AUTOCOMPLETE.DEBOUNCE_MS);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch suggestions
    useEffect(() => {
      const fetchSuggestions = async () => {
        if (debouncedValue.length < AUTOCOMPLETE.MIN_CHARS) {
          setSuggestions([]);
          return;
        }

        if (getSuggestions) {
          const result = await getSuggestions(debouncedValue);
          setSuggestions(result.slice(0, AUTOCOMPLETE.MAX_SUGGESTIONS));
        } else if (staticSuggestions) {
          const q = debouncedValue.toLowerCase();
          setSuggestions(
            staticSuggestions
              .filter((s) => s.toLowerCase().includes(q))
              .slice(0, AUTOCOMPLETE.MAX_SUGGESTIONS)
          );
        }
      };

      fetchSuggestions();
    }, [debouncedValue, getSuggestions, staticSuggestions]);

    // Close dropdown ketika klik di luar
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
      setIsOpen(true);
      setHighlightedIndex(-1);
    };

    const handleSelect = (suggestion: string) => {
      const finalValue = parseSelected ? parseSelected(suggestion) : suggestion;
      onChange(finalValue);
      setIsOpen(false);
      setHighlightedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;

        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;

        case "Enter":
          if (highlightedIndex >= 0) {
            e.preventDefault();
            handleSelect(suggestions[highlightedIndex]);
          }
          break;

        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    };

    const showDropdown = isOpen && suggestions.length > 0;

    return (
      <div ref={containerRef} className="relative">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={(e) => {
            setIsOpen(true);
            onFocus?.(e);
          }}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "h-11 w-full rounded-md border border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] px-3 text-sm text-[var(--color-neutral-800)] placeholder:text-[var(--color-neutral-400)]",
            "transition-colors focus:border-[var(--color-primary-500)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]",
            className
          )}
          {...props}
        />

        {showDropdown && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-[var(--color-neutral-200)] bg-white shadow-lg">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion}-${index}`}
                type="button"
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors",
                  highlightedIndex === index
                    ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                    : "text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
                )}
              >
                <span className="truncate">{suggestion}</span>
                {highlightedIndex === index && (
                  <Check className="h-4 w-4 flex-shrink-0 text-[var(--color-primary-500)]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

AutocompleteInput.displayName = "AutocompleteInput";