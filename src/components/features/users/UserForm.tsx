"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { User, UserRole } from "@/types";

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
    password: z.string().min(8, "Password minimal 8 karakter").max(72),
    passwordConfirm: z.string(),
    role: z.enum(["admin", "operator"]),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password tidak sama",
    path: ["passwordConfirm"],
  });

const editUserSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(100),
  email: z.string().trim().email("Format email tidak valid"),
  role: z.enum(["admin", "operator"]),
});

type CreateUserValues = z.infer<typeof createUserSchema>;
type EditUserValues = z.infer<typeof editUserSchema>;

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSubmit: (values: CreateUserValues | EditUserValues) => Promise<void> | void;
  isLoading?: boolean;
}

export function UserForm({
  open,
  onOpenChange,
  user,
  onSubmit,
  isLoading,
}: UserFormProps) {
  const isEdit = !!user;
  const [showPassword, setShowPassword] = useState(false);

  const createForm = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      role: "operator",
    },
  });

  const editForm = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "operator",
    },
  });

  useEffect(() => {
    if (open) {
      if (user) {
        editForm.reset({
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } else {
        createForm.reset();
      }
    }
  }, [open, user, createForm, editForm]);

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
            form={editForm}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        ) : (
          <CreateForm
            form={createForm}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((v) => !v)}
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
  form,
  onSubmit,
  onCancel,
  isLoading,
  showPassword,
  onTogglePassword,
}: {
  form: ReturnType<typeof useForm<CreateUserValues>>;
  onSubmit: (values: CreateUserValues) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
}) {
  const role = form.watch("role");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
          <Select
            value={role}
            onValueChange={(v) => form.setValue("role", v as UserRole)}
          >
            <SelectTrigger id="role" className="h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operator">Operator</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">
          Email <span className="text-[var(--color-danger-500)]">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="user@sekolah.id"
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
            onClick={onTogglePassword}
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
          placeholder="Ulangi password"
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
  form,
  onSubmit,
  onCancel,
  isLoading,
}: {
  form: ReturnType<typeof useForm<EditUserValues>>;
  onSubmit: (values: EditUserValues) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  const role = form.watch("role");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
        <Select
          value={role}
          onValueChange={(v) => form.setValue("role", v as UserRole)}
        >
          <SelectTrigger id="edit-role" className="h-11 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operator">Operator</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
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