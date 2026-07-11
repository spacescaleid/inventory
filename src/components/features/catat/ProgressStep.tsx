"use client";

import { Check } from "lucide-react";
import type { CatatStep } from "@/stores/catatStore";
import { cn } from "@/utils/cn";

interface ProgressStepProps {
  currentStep: CatatStep;
}

const STEPS: {
  key: Exclude<CatatStep, "sukses">;
  label: string;
  number: number;
}[] = [
  { key: "identitas", label: "Identitas", number: 1 },
  { key: "seragam", label: "Seragam", number: 2 },
  { key: "konfirmasi", label: "Konfirmasi", number: 3 },
];

const stepIndex = (step: CatatStep): number => {
  switch (step) {
    case "identitas":
      return 0;
    case "seragam":
      return 1;
    case "konfirmasi":
      return 2;
    case "sukses":
      return 3;
  }
};

export function ProgressStep({ currentStep }: ProgressStepProps) {
  const currentIdx = stepIndex(currentStep);

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {STEPS.map((step, idx) => {
          const isCompleted = currentIdx > idx;
          const isCurrent = currentIdx === idx;
          const isLast = idx === STEPS.length - 1;

          return (
            <li
              key={step.key}
              className={cn("flex items-center", !isLast && "flex-1")}
            >
              {/* Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-semibold transition-all",
                    isCompleted && "bg-[var(--color-primary-500)] text-white",
                    isCurrent &&
                      "bg-[var(--color-primary-500)] text-white ring-4 ring-[var(--color-primary-100)]",
                    !isCompleted &&
                      !isCurrent &&
                      "bg-[var(--color-neutral-200)] text-[var(--color-neutral-500)]"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-[10px] font-medium",
                    isCompleted || isCurrent
                      ? "text-[var(--color-primary-700)]"
                      : "text-[var(--color-neutral-500)]"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="mx-2 -mt-4 h-0.5 flex-1 overflow-hidden rounded-full bg-[var(--color-neutral-200)]">
                  <div
                    className={cn(
                      "h-full bg-[var(--color-primary-500)] transition-all duration-300",
                      currentIdx > idx ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}