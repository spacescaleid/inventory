"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CustomSelect, type SelectOption } from "@/components/shared/CustomSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { User, UserRole } from "@/types";

// ============================================
// Schemas
// ============================================

const createUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Nama wajib diisi")
      .max(100, "Maksimal 100 karakter"),
    username: z
      .string()
      .trim()
      .min(3, "Username minimal 3 karakter")
      .max(30, "Maksimal 30 karakter")
      .regex(/^[a-zA-Z0-9_.]+$/, "Hanya huruf, angka, titik, underscore"),
    email: z.string().trim().email("Format email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(72, "Password maksimal 72 karakter"),
    passwordConfirm: z.string().min(1, "Konfirmasi password wajib diisi"),
    role: z.enum(["admin", "operator"]),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password dan konfirmasi tidak sama",
    path: ["passwordConfirm"],
  });

const editUserSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(100),
  email: z.string().trim().email("Format email tidak valid"),
  role: z.enum(["admin", "operator"]),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type EditUserFormValues = z.infer<typeof editUserSchema>;

// ============================================
// Main Component (Router)
// ============================================

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onCreateSubmit: (values: CreateUserFormValues) => Promise<void> | void;
  onEditSubmit: (values: EditUserFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export function UserForm({
  open,
  onOpenChange,
  user,
  onCreateSubmit,
  onEditSubmit,
  isLoading,
}: UserFormProps) {
  const isEdit = !!user;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-2xl px-4 pb-6 pt-0 sm:max-w-lg sm:mx-auto"
      >
        <div className="mx-auto mt-3 mb-4 h-1 w-8 rounded-full bg-[var(--color-neutral-300)]" />

        <SheetHeader className="text-left">
          <SheetTitle className="text-lg">
            {isEdit ? "Edit User" : "Tambah User Baru"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? `Ubah informasi ${user.name}`
              : "Buat akun baru untuk staf atau operator"}
          </SheetDescription>
        </SheetHeader>

        {isEdit ? (
          <EditForm
            key={`edit-${user.id}`}
            user={user}
            onSubmit={onEditSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        ) : (
          <CreateForm
            key={open ? "create-open" : "create-closed"}
            onSubmit={onCreateSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

// ============================================
// Create Form
// ============================================
function CreateForm({
  onSubmit,
  onCancel,
  isLoading,
}: {
  onSubmit: (values: CreateUserFormValues) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      role: "operator",
    },
  });

  const role = form.watch("role");

  const roleOptions: SelectOption[] = [
    { value: "operator", label: "Operator" },
    { value: "admin", label: "Admin" },
  ];

  const handleFormSubmit = async (values: CreateUserFormValues) => {
    console.log("[UserForm] Submit create with values:", {
      ...values,
      password: "***",
      passwordConfirm: "***",
    });
    await onSubmit(values);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className="mt-6 space-y-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="name">
          Nama Lengkap <span className="text-[var(--color-danger-500)]">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Contoh: Bu Rina"
          {...form.register("name")}
          aria-invalid={!!form.formState.errors.name}
        />
        {form.formState.errors.name && (
          <p className="text-xs text-[var(--color-danger-600)]">
            ⚠ {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="username">
            Username <span className="text-[var(--color-danger-500)]">*</span>
          </Label>
          <Input
            id="username"
            placeholder="burina"
            autoComplete="off"
            {...form.register("username")}
            aria-invalid={!!form.formState.errors.username}
          />
          {form.formState.errors.username && (
            <p className="text-xs text-[var(--color-danger-600)]">
              ⚠ {form.formState.errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role">
            Peran <span className="text-[var(--color-danger-500)]">*</span>
          </Label>
          <CustomSelect
            id="role"
            value={role}
            onChange={(v) => form.setValue("role", v as UserRole)}
            options={roleOptions}
            placeholder="Pilih peran"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">
          Email <span className="text-[var(--color-danger-500)]">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="user@sekolah.local"
          {...form.register("email")}
          aria-invalid={!!form.formState.errors.email}
        />
        {form.formState.errors.email && (
          <p className="text-xs text-[var(--color-danger-600)]">
            ⚠ {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">
          Password <span className="text-[var(--color-danger-500)]">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            className="pr-11"
            {...form.register("password")}
            aria-invalid={!!form.formState.errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label="Toggle password"
            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--color-neutral-400)] transition-colors hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-600)]"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-xs text-[var(--color-danger-600)]">
            ⚠ {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="passwordConfirm">
          Konfirmasi Password{" "}
          <span className="text-[var(--color-danger-500)]">*</span>
        </Label>
        <Input
          id="passwordConfirm"
          type={showPassword ? "text" : "password"}
          placeholder="Ulangi password yang sama"
          autoComplete="new-password"
          {...form.register("passwordConfirm")}
          aria-invalid={!!form.formState.errors.passwordConfirm}
        />
        {form.formState.errors.passwordConfirm && (
          <p className="text-xs text-[var(--color-danger-600)]">
            ⚠ {form.formState.errors.passwordConfirm.message}
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="mobile"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Batal
        </Button>
        <Button
          type="submit"
          size="mobile"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Tambah User"
          )}
        </Button>
      </div>
    </form>
  );
}

// ============================================
// Edit Form
// ============================================
function EditForm({
  user,
  onSubmit,
  onCancel,
  isLoading,
}: {
  user: User;
  onSubmit: (values: EditUserFormValues) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    mode: "onBlur",
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }, [user, form]);

  const role = form.watch("role");

  const roleOptions: SelectOption[] = [
    { value: "operator", label: "Operator" },
    { value: "admin", label: "Admin" },
  ];

  const handleFormSubmit = async (values: EditUserFormValues) => {
    console.log("[UserForm] Submit edit with values:", values);
    await onSubmit(values);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className="mt-6 space-y-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="edit-name">
          Nama Lengkap <span className="text-[var(--color-danger-500)]">*</span>
        </Label>
        <Input
          id="edit-name"
          {...form.register("name")}
          aria-invalid={!!form.formState.errors.name}
        />
        {form.formState.errors.name && (
          <p className="text-xs text-[var(--color-danger-600)]">
            ⚠ {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="edit-email">
          Email <span className="text-[var(--color-danger-500)]">*</span>
        </Label>
        <Input
          id="edit-email"
          type="email"
          {...form.register("email")}
          aria-invalid={!!form.formState.errors.email}
        />
        {form.formState.errors.email && (
          <p className="text-xs text-[var(--color-danger-600)]">
            ⚠ {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="edit-role">Peran</Label>
        <CustomSelect
          id="edit-role"
          value={role}
          onChange={(v) => form.setValue("role", v as UserRole)}
          options={roleOptions}
          placeholder="Pilih peran"
        />
        <p className="text-xs text-[var(--color-neutral-500)]">
          Admin dapat kelola user & data master. Operator hanya mencatat
          pengambilan.
        </p>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="mobile"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Batal
        </Button>
        <Button
          type="submit"
          size="mobile"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </div>
    </form>
  );
}