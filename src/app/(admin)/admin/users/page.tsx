"use client";

import { Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ResetPasswordForm } from "@/components/features/users/ResetPasswordForm";
import { UserForm } from "@/components/features/users/UserForm";
import { UserList } from "@/components/features/users/UserList";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterChips } from "@/components/shared/FilterChips";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateUser,
  useDeleteUser,
  useResetUserPassword,
  useToggleUserActive,
  useUpdateUser,
  useUsers,
} from "@/hooks/useUsers";
import { parsePocketBaseError } from "@/lib/pocketbase/api";
import type { CreateUserInput, UpdateUserInput, User } from "@/types";

type RoleFilter = "all" | "admin" | "operator";

// Type guard untuk cek input adalah CreateUserInput
function isCreateInput(
  input: CreateUserInput | UpdateUserInput
): input is CreateUserInput {
  return "password" in input && "username" in input;
}

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

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useUsers({
    search,
    role: roleFilter,
  });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const resetPasswordMutation = useResetUserPassword();
  const toggleActiveMutation = useToggleUserActive();

  const isSubmitting = useMemo(
    () =>
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      resetPasswordMutation.isPending ||
      toggleActiveMutation.isPending,
    [
      createMutation.isPending,
      updateMutation.isPending,
      deleteMutation.isPending,
      resetPasswordMutation.isPending,
      toggleActiveMutation.isPending,
    ]
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

  const handleUserSubmit = async (
    values: CreateUserInput | UpdateUserInput
  ) => {
    try {
      if (selectedUser) {
        // Update mode
        await updateMutation.mutateAsync({
          id: selectedUser.id,
          input: values as UpdateUserInput,
        });
        toast.success("✓ User berhasil diperbarui");
      } else if (isCreateInput(values)) {
        // Create mode — pakai type guard supaya TypeScript tahu ini CreateUserInput
        await createMutation.mutateAsync({
          username: values.username,
          email: values.email,
          name: values.name,
          password: values.password,
          passwordConfirm: values.passwordConfirm || values.password,
          role: values.role,
          is_active: values.is_active,
        });
        toast.success("✓ User baru berhasil ditambahkan", {
          description: `${values.name} (${values.username}) dapat login sekarang`,
        });
      } else {
        throw new Error("Invalid form data");
      }
      setUserFormOpen(false);
    } catch (err) {
      toast.error("Gagal menyimpan user", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const handleResetPasswordSubmit = async (values: {
    newPassword: string;
    passwordConfirm: string;
  }) => {
    if (!selectedUser) return;
    try {
      await resetPasswordMutation.mutateAsync({
        userId: selectedUser.id,
        newPassword: values.newPassword,
        passwordConfirm: values.passwordConfirm,
      });
      toast.success("✓ Password berhasil direset", {
        description: `Sampaikan password baru ke ${selectedUser.name}`,
      });
      setResetPasswordOpen(false);
    } catch (err) {
      toast.error("Gagal reset password", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteMutation.mutateAsync(selectedUser.id);
      toast.success("✓ User berhasil dihapus");
      setDeleteConfirmOpen(false);
    } catch (err) {
      toast.error("Gagal menghapus user", {
        description: parsePocketBaseError(err),
      });
    }
  };

  const handleConfirmToggle = async () => {
    if (!selectedUser) return;
    try {
      await toggleActiveMutation.mutateAsync(selectedUser);
      toast.success(
        selectedUser.is_active
          ? `✓ Akun ${selectedUser.name} dinonaktifkan`
          : `✓ Akun ${selectedUser.name} diaktifkan`
      );
      setToggleConfirmOpen(false);
    } catch (err) {
      toast.error("Gagal mengubah status", {
        description: parsePocketBaseError(err),
      });
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
            {users?.length ?? 0}
          </strong>{" "}
          user
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary-500)]" />
          </div>
        ) : error ? (
          <ErrorState
            description={parsePocketBaseError(error)}
            onRetry={() => refetch()}
          />
        ) : (
          <UserList
            users={users ?? []}
            currentUserId={currentUser.id}
            onEdit={handleEdit}
            onResetPassword={handleResetPassword}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        )}
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
        isLoading={resetPasswordMutation.isPending}
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
        isLoading={deleteMutation.isPending}
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
        confirmLabel={
          selectedUser?.is_active ? "Ya, Nonaktifkan" : "Ya, Aktifkan"
        }
        onConfirm={handleConfirmToggle}
        isLoading={toggleActiveMutation.isPending}
        variant={selectedUser?.is_active ? "danger" : "default"}
      />
    </>
  );
}