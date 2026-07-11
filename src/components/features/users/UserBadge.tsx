import { Shield, User as UserIcon } from "lucide-react";
import type { UserRole } from "@/types";
import { cn } from "@/utils/cn";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const isAdmin = role === "admin";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        isAdmin
          ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]"
          : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)]",
        className
      )}
    >
      {isAdmin ? (
        <Shield className="h-3 w-3" />
      ) : (
        <UserIcon className="h-3 w-3" />
      )}
      {isAdmin ? "Admin" : "Operator"}
    </span>
  );
}

interface StatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export function ActiveBadge({ isActive, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        isActive
          ? "bg-[var(--color-success-100)] text-[var(--color-success-700)]"
          : "bg-[var(--color-danger-100)] text-[var(--color-danger-700)]",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isActive
            ? "bg-[var(--color-success-500)]"
            : "bg-[var(--color-danger-500)]"
        )}
      />
      {isActive ? "Aktif" : "Nonaktif"}
    </span>
  );
}