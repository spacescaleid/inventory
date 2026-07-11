"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";

interface StepperInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Input angka dengan tombol +/- di kiri dan kanan.
 * Bisa juga ketik langsung di tengah.
 * Touch target 44×44px sesuai design system.
 */
export function StepperInput({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  disabled = false,
  className,
}: StepperInputProps) {
  const [inputValue, setInputValue] = useState(String(value));

  // Sync internal input dengan value dari luar
  if (inputValue !== String(value) && document.activeElement?.tagName !== "INPUT") {
    setInputValue(String(value));
  }

  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && value < max;

  const decrement = () => {
    if (canDecrement) {
      const newValue = Math.max(min, value - step);
      onChange(newValue);
      setInputValue(String(newValue));
    }
  };

  const increment = () => {
    if (canIncrement) {
      const newValue = Math.min(max, value + step);
      onChange(newValue);
      setInputValue(String(newValue));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setInputValue(raw);

    if (raw === "") return;

    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      const clamped = Math.max(min, Math.min(max, num));
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    if (inputValue === "" || isNaN(parseInt(inputValue, 10))) {
      setInputValue(String(value));
    } else {
      const num = parseInt(inputValue, 10);
      const clamped = Math.max(min, Math.min(max, num));
      onChange(clamped);
      setInputValue(String(clamped));
    }
  };

  return (
    <div
      className={cn(
        "flex items-center overflow-hidden rounded-md border border-[var(--color-neutral-200)] bg-white",
        disabled && "opacity-50",
        className
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={!canDecrement}
        aria-label="Kurangi"
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center text-[var(--color-neutral-600)] transition-colors hover:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed disabled:opacity-40 active:bg-[var(--color-neutral-200)]"
      >
        <Minus className="h-4 w-4" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        aria-label="Jumlah"
        className="h-11 min-w-[56px] flex-1 border-x border-[var(--color-neutral-200)] bg-white text-center font-mono text-base font-semibold text-[var(--color-neutral-800)] focus:outline-none focus:ring-0 disabled:cursor-not-allowed"
      />

      <button
        type="button"
        onClick={increment}
        disabled={!canIncrement}
        aria-label="Tambah"
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center text-[var(--color-neutral-600)] transition-colors hover:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed disabled:opacity-40 active:bg-[var(--color-neutral-200)]"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}