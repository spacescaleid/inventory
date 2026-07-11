"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ResetPasswordForm } from "@/components/features/users/ResetPasswordForm";
import { UserForm } from "@/components/features/users/UserForm";
import { UserList } from "@/components/features/users/UserList";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { FilterChips } from "@/components/shared/FilterChips";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { searchMockUsers } from "@/lib/mock-users";
import type { User } from "@/types";

type RoleFilter = "all" | "admin" | "operator";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth({
    required: true,
    requireAdmin: true,
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const [userFormOpen, setUserFormOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toggleConfirmOpen, setToggleConfirmOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const users = useMemo(
    () => searchMockUsers(search, roleFilter),
    [search, roleFilter]
  );

  if (!currentUser) return null;

  const handleAdd = () => {
    setSelectedUser(null);
    setUserFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setUserFormOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setResetPasswordOpen(true);
  };

  const handleToggleActive = (user: User) => {
    setSelectedUser(user);
    setToggleConfirmOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteConfirmOpen(true);
  };

  const handleUserSubmit = async (values: unknown) => {
    setIsSubmitting(true);
    try {
      console.log(selectedUser ? "Update user:" : "Create user:", values);
      await new Promise((r) => setTimeout(r, 600));
      toast.success(
        selectedUser
          ? "✓ User berhasil diperbarui"
          : "✓ User baru berhasil ditambahkan"
      );
      setUserFormOpen(false);
    } catch {
      toast.error("Gagal menyimpan user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (values: {
    newPassword: string;
    passwordConfirm: string;
  }) => {
    setIsSubmitting(true);
    try {
      console.log("Reset password:", selectedUser?.id, values);
      await new Promise((r) => setTimeout(r, 600));
      toast.success("✓ Password berhasil direset", {
        description: `Sampaikan password baru ke ${selectedUser?.name}`,
      });
      setResetPasswordOpen(false);
    } catch {
      toast.error("Gagal reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      console.log("Delete:", selectedUser.id);
      await new Promise((r) => setTimeout(r, 500));
      toast.success("✓ User berhasil dihapus");
      setDeleteConfirmOpen(false);
    } catch {
      toast.error("Gagal menghapus user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmToggle = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      toast.success(
        selectedUser.is_active
          ? `✓ Akun ${selectedUser.name} dinonaktifkan`
          : `✓ Akun ${selectedUser.name} diaktifkan`
      );
      setToggleConfirmOpen(false);
    } catch {
      toast.error("Gagal mengubah status");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TopAppBar
        title="Kelola User"
        showBack
        rightSlot={
          <Button size="sm" onClick={handleAdd} className="gap-1">
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        }
      />

      <div className="space-y-4 px-4 py-4">
        <p className="px-1 text-xs text-[var(--color-neutral-500)]">
          Kelola akun user aplikasi. Admin dapat kelola sistem, operator hanya
          untuk pencatatan.
        </p>

        <div className="space-y-3">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Cari nama, username, email..."
          />

          <FilterChips
            options={[
              { value: "admin", label: "Admin" },
              { value: "operator", label: "Operator" },
            ]}
            value={roleFilter === "all" ? null : roleFilter}
            onChange={(v) => setRoleFilter((v as RoleFilter) || "all")}
            allLabel="Semua"
          />
        </div>

        <div className="px-1 text-xs text-[var(--color-neutral-500)]">
          Total{" "}
          <strong className="text-[var(--color-neutral-700)]">
            {users.length}
          </strong>{" "}
          user
        </div>

        <UserList
          users={users}
          currentUserId={currentUser.id}
          onEdit={handleEdit}
          onResetPassword={handleResetPassword}
          onToggleActive={handleToggleActive}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </div>

      <UserForm
        open={userFormOpen}
        onOpenChange={setUserFormOpen}
        user={selectedUser}
        onSubmit={handleUserSubmit}
        isLoading={isSubmitting}
      />

      <ResetPasswordForm
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
        user={selectedUser}
        onSubmit={handleResetPasswordSubmit}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Hapus user ini?"
        description={
          <>
            User <strong>{selectedUser?.name}</strong> ({selectedUser?.username})
            akan dihapus permanen.
          </>
        }
        confirmLabel="Ya, Hapus"
        onConfirm={handleConfirmDelete}
        isLoading={isSubmitting}
        variant="danger"
      />

      <ConfirmDialog
        open={toggleConfirmOpen}
        onOpenChange={setToggleConfirmOpen}
        title={
          selectedUser?.is_active ? "Nonaktifkan akun?" : "Aktifkan akun?"
        }
        description={
          selectedUser?.is_active
            ? `Akun ${selectedUser?.name} tidak akan bisa login.`
            : `Akun ${selectedUser?.name} akan bisa login kembali.`
        }
        confirmLabel={selectedUser?.is_active ? "Ya, Nonaktifkan" : "Ya, Aktifkan"}
        onConfirm={handleConfirmToggle}
        isLoading={isSubmitting}
        variant={selectedUser?.is_active ? "danger" : "default"}
      />
    </>
  );
}