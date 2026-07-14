"use client";

import {
  ChevronRight,
  GraduationCap,
  KeyRound,
  Layers,
  Loader2,
  LogOut,
  Mail,
  Shield,
  Shirt,
  User as UserIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
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
import { changeMyPassword } from "@/lib/pocketbase/auth";
import { parsePocketBaseError } from "@/lib/pocketbase/api";
import { useAuthStore } from "@/stores/authStore";
import { formatRelatif } from "@/utils/date";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";

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
      await changeMyPassword(values);
      toast.success("✓ Password berhasil diganti", {
        description: "Silakan login ulang dengan password baru",
      });
      setPasswordFormOpen(false);

      setTimeout(() => {
        logout();
        router.replace(ROUTES.LOGIN);
      }, 1500);
    } catch (err) {
      toast.error("Gagal ganti password", {
        description: parsePocketBaseError(err),
      });
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
        {/* Avatar & info */}
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

        {/* Info Akun */}
        <section>
          <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
            Informasi Akun
          </h3>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <InfoRow icon={UserIcon} label="Nama Lengkap" value={user.name} />
            <InfoRow icon={Mail} label="Email" value={user.email} divider />
            <InfoRow
              icon={Shield}
              label="Peran"
              value={user.role === "admin" ? "Administrator" : "Operator"}
              divider
            />
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

        {/* Kelola Data Master */}
        <section>
          <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-500)]">
            Kelola Data Master
          </h3>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <MenuLinkRow
              icon={Layers}
              label="Kategori Seragam"
              description="Harian, Olahraga, Pramuka"
              href={ROUTES.KELOLA_KATEGORI}
              iconBg="bg-[var(--color-primary-100)]"
              iconColor="text-[var(--color-primary-600)]"
            />
            <MenuLinkRow
              icon={Shirt}
              label="Jenis Seragam"
              description="Baju, Celana, Rok, Topi"
              href={ROUTES.KELOLA_JENIS}
              iconBg="bg-[var(--color-info-100)]"
              iconColor="text-[var(--color-info-600)]"
              divider
            />
            <MenuLinkRow
              icon={GraduationCap}
              label="Kelas"
              description="Daftar kelas di sekolah"
              href={ROUTES.KELOLA_KELAS}
              iconBg="bg-[var(--color-success-100)]"
              iconColor="text-[var(--color-success-600)]"
              divider
            />
            <MenuLinkRow
              icon={Users}
              label="Siswa"
              description="Daftar siswa per kelas"
              href={ROUTES.KELOLA_SISWA}
              iconBg="bg-[var(--color-warning-100)]"
              iconColor="text-[var(--color-warning-600)]"
              divider
            />
          </div>
        </section>

        {/* Keamanan */}
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
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-[var(--color-neutral-300)]" />
            </button>
          </div>
        </section>

        {/* Logout */}
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

        <div className="pt-4 text-center">
          <p className="text-xs text-[var(--color-neutral-400)]">Versi 1.0.0</p>
        </div>
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
  icon: LucideIcon;
  label: string;
  value: string;
  divider?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3",
        divider && "border-t border-[var(--color-neutral-100)]"
      )}
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

function MenuLinkRow({
  icon: Icon,
  label,
  description,
  href,
  iconBg,
  iconColor,
  divider,
}: {
  icon: LucideIcon;
  label: string;
  description?: string;
  href: string;
  iconBg: string;
  iconColor: string;
  divider?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-neutral-50)]",
        divider && "border-t border-[var(--color-neutral-100)]"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
          iconBg
        )}
      >
        <Icon className={cn("h-5 w-5", iconColor)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--color-neutral-800)]">
          {label}
        </p>
        {description && (
          <p className="mt-0.5 truncate text-xs text-[var(--color-neutral-500)]">
            {description}
          </p>
        )}
      </div>
      <ChevronRight className="h-4 w-4 flex-shrink-0 text-[var(--color-neutral-300)]" />
    </Link>
  );
}