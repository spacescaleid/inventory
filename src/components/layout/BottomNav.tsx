"use client";

import {
  BarChart3,
  ClipboardPen,
  Database,
  History,
  Home,
  LayoutDashboard,
  Package,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { ADMIN_NAV, OPERATOR_NAV } from "@/constants/routes";
import { cn } from "@/utils/cn";

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  Package,
  ClipboardPen,
  History,
  User,
  LayoutDashboard,
  Users,
  Database,
  BarChart3,
};

interface NavItemData {
  label: string;
  href: string;
  icon: string;
  primary?: boolean;
}

export function BottomNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  // Pilih nav items berdasarkan role
  const navItems: readonly NavItemData[] =
    user?.role === "admin" ? ADMIN_NAV : OPERATOR_NAV;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-neutral-200)] bg-white"
      aria-label="Navigasi utama"
    >
      <div className="flex h-16 items-stretch justify-around px-2">
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.icon] || Home;
          // Aktif jika path exact match ATAU sub-route dari nav item
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href + "/")) ||
            (item.href === "/admin" && pathname === "/admin");

          if (item.primary) {
            return (
              <PrimaryNavItem
                key={item.href}
                item={item}
                icon={Icon}
                isActive={isActive}
              />
            );
          }

          return (
            <RegularNavItem
              key={item.href}
              item={item}
              icon={Icon}
              isActive={isActive}
            />
          );
        })}
      </div>
      <div className="safe-bottom" />
    </nav>
  );
}

function RegularNavItem({
  item,
  icon: Icon,
  isActive,
}: {
  item: NavItemData;
  icon: LucideIcon;
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors",
        isActive
          ? "text-[var(--color-primary-600)]"
          : "text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)]"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <span
          className="absolute top-0 h-0.5 w-8 rounded-full bg-[var(--color-primary-500)]"
          aria-hidden="true"
        />
      )}
      <Icon className="h-6 w-6" strokeWidth={isActive ? 2.25 : 1.75} />
      <span
        className={cn(
          "text-[10px] leading-none",
          isActive ? "font-semibold" : "font-medium"
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

function PrimaryNavItem({
  item,
  icon: Icon,
  isActive,
}: {
  item: NavItemData;
  icon: LucideIcon;
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className="relative flex flex-1 flex-col items-center justify-center"
      aria-current={isActive ? "page" : undefined}
    >
      <div
        className={cn(
          "flex h-14 w-14 -translate-y-3 items-center justify-center rounded-full shadow-lg transition-all",
          "bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)]",
          isActive && "ring-4 ring-[var(--color-primary-100)]"
        )}
      >
        <Icon className="h-6 w-6 text-white" strokeWidth={2} />
      </div>
      <span
        className={cn(
          "-mt-1 text-[10px] leading-none",
          isActive
            ? "font-semibold text-[var(--color-primary-600)]"
            : "font-medium text-[var(--color-neutral-500)]"
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}