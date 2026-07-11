"use client";

import {
  KeyRound,
  MoreVertical,
  Pencil,
  Power,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/EmptyState";
import type { User } from "@/types";
import { formatRelatif } from "@/utils/date";
import { cn } from "@/utils/cn";
import { ActiveBadge, RoleBadge } from "./UserBadge";

interface UserListProps {
  users: User[];
  currentUserId?: string;
  onEdit?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onToggleActive?: (user: User) => void;
  onDelete?: (user: User) => void;
  onAdd?: () => void;
}

export function UserList({
  users,
  currentUserId,
  onEdit,
  onResetPassword,
  onToggleActive,
  onDelete,
  onAdd,
}: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-xl bg-white shadow-sm">
        <EmptyState
          icon={UsersIcon}
          title="Belum ada user"
          description="Tambahkan user pertama untuk memulai"
          action={
            onAdd && (
              <Button size="mobile" onClick={onAdd}>
                Tambah User
              </Button>
            )
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isCurrentUser={user.id === currentUserId}
          onEdit={onEdit}
          onResetPassword={onResetPassword}
          onToggleActive={onToggleActive}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function UserCard({
  user,
  isCurrentUser,
  onEdit,
  onResetPassword,
  onToggleActive,
  onDelete,
}: {
  user: User;
  isCurrentUser: boolean;
  onEdit?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onToggleActive?: (user: User) => void;
  onDelete?: (user: User) => void;
}) {
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md",
        !user.is_active && "opacity-70"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)] text-lg font-semibold text-white shadow-sm">
          {initial}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-[var(--color-neutral-800)]">
              {user.name}
            </p>
            {isCurrentUser && (
              <span className="rounded-full bg-[var(--color-info-100)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--color-info-700)]">
                Kamu
              </span>
            )}
          </div>

          <p className="mt-0.5 truncate font-mono text-xs text-[var(--color-neutral-500)]">
            @{user.username} · {user.email}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <RoleBadge role={user.role} />
            <ActiveBadge isActive={user.is_active} />
            {user.last_login && (
              <span className="text-[10px] text-[var(--color-neutral-400)]">
                Login {formatRelatif(user.last_login)}
              </span>
            )}
          </div>
        </div>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-[var(--color-neutral-400)] transition-colors hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-600)]"
                aria-label={`Menu untuk ${user.name}`}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Pencil className="h-4 w-4" />
                Edit Informasi
              </DropdownMenuItem>
            )}

            {onResetPassword && (
              <DropdownMenuItem onClick={() => onResetPassword(user)}>
                <KeyRound className="h-4 w-4" />
                Reset Password
              </DropdownMenuItem>
            )}

            {onToggleActive && !isCurrentUser && (
              <DropdownMenuItem onClick={() => onToggleActive(user)}>
                <Power className="h-4 w-4" />
                {user.is_active ? "Nonaktifkan Akun" : "Aktifkan Akun"}
              </DropdownMenuItem>
            )}

            {onDelete && !isCurrentUser && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(user)}
                  className="text-[var(--color-danger-600)] focus:text-[var(--color-danger-700)]"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus User
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}