"use client";

import {
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ChangeMyPasswordForm } from "@/components/features/users/ChangeMyPasswordForm";
import {
  ActiveBadge,
  RoleBadge,
} from "@/components/features/users/UserBadge";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { formatRelatif } from "@/utils/date";

export default function ProfilPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth({ required: true });
  const logout = useAuthStore((s) => s.logout);

  const [passwordFormOpen, setPasswordFormOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading || !user) {
    return (
      <>
        <TopAppBar title="Profil" />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary-500)]" />
        </div>
      </>
    );
  }

  const handleChangePassword = async (values: {
    oldPassword: string;
    newPassword: string;
    passwordConfirm: string;
  }) => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success("✓ Password berhasil diganti");
      setPasswordFormOpen(false);
    } catch {
      toast.error("Gagal ganti password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("✓ Berhasil keluar");
    router.replace(ROUTES.LOGIN);
  };

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <>
      <TopAppBar title="Profil" />

      <div className="space-y-6 px-4 py-4">
        <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)] text-3xl font-bold text-white shadow-lg">
            {initial}
          </div>

          <h2 className="mt-4 text-lg font-semibold text-[var(--color-neutral-800)]">
            {user.name}
          </h2>

          <p className="mt-0.5 font-mono text-xs text-[var(--color-neutral-500)]">
            @{user.username}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <RoleBadge role={user.role} />
            <ActiveBadge isActive={user.is_active} />
          </div>
        </div>

        <section>
          <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
            Informasi Akun
          </h3>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <InfoRow icon={UserIcon} label="Nama Lengkap" value={user.name} />
            <InfoRow icon={Mail} label="Email" value={user.email} divider />
            <InfoRow icon={Shield} label="Peran" value="Operator" divider />
            {user.last_login && (
              <InfoRow
                icon={UserIcon}
                label="Login Terakhir"
                value={formatRelatif(user.last_login)}
                divider
              />
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
            Keamanan
          </h3>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setPasswordFormOpen(true)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-neutral-50)]"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-warning-100)]">
                <KeyRound className="h-5 w-5 text-[var(--color-warning-600)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-neutral-800)]">
                  Ganti Password
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-neutral-500)]">
                  Perbarui password akun kamu
                </p>
              </div>
            </button>
          </div>
        </section>

        <section>
          <Button
            variant="destructive"
            size="mobile-lg"
            onClick={() => setLogoutConfirmOpen(true)}
            className="w-full"
          >
            <LogOut className="h-4 w-4" />
            Keluar dari Akun
          </Button>
        </section>
      </div>

      <ChangeMyPasswordForm
        open={passwordFormOpen}
        onOpenChange={setPasswordFormOpen}
        onSubmit={handleChangePassword}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={logoutConfirmOpen}
        onOpenChange={setLogoutConfirmOpen}
        title="Keluar dari akun?"
        description="Kamu perlu login lagi untuk mengakses aplikasi."
        confirmLabel="Ya, Keluar"
        onConfirm={handleLogout}
        variant="danger"
      />
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  divider,
}: {
  icon: typeof UserIcon;
  label: string;
  value: string;
  divider?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${
        divider ? "border-t border-[var(--color-neutral-100)]" : ""
      }`}
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-neutral-100)]">
        <Icon className="h-4 w-4 text-[var(--color-neutral-500)]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--color-neutral-500)]">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-[var(--color-neutral-800)]">
          {value}
        </p>
      </div>
    </div>
  );
}