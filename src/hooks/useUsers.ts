"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase/client";
import { COLLECTIONS } from "@/lib/pocketbase/collections";
import { queryKeys } from "@/constants/query-keys";
import type { User, CreateUserInput, UpdateUserInput } from "@/types";

interface UserFilterOptions {
  search?: string;
  role?: "admin" | "operator" | "all";
}

/**
 * List semua users (admin only)
 */
export function useUsers(options: UserFilterOptions = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(options),
    queryFn: async () => {
      const filters: string[] = [];

      if (options.role && options.role !== "all") {
        filters.push(`role = "${options.role}"`);
      }

      if (options.search?.trim()) {
        const q = options.search.trim();
        filters.push(
          `(name ~ "${q}" || email ~ "${q}" || username ~ "${q}")`
        );
      }

      return await pb.collection(COLLECTIONS.USERS).getFullList<User>({
        filter: filters.join(" && "),
        sort: "-created",
      });
    },
  });
}

/**
 * Get user by ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => {
      return await pb.collection(COLLECTIONS.USERS).getOne<User>(id);
    },
    enabled: !!id,
  });
}

/**
 * Create user baru (admin only)
 */
export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      return await pb.collection(COLLECTIONS.USERS).create<User>({
        username: input.username.trim(),
        email: input.email.trim(),
        name: input.name.trim(),
        password: input.password,
        passwordConfirm: input.passwordConfirm,
        role: input.role,
        is_active: input.is_active ?? true,
        emailVisibility: false,
        verified: true, // Auto-verify karena dibuat admin
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}

/**
 * Update user (nama, email, role, is_active)
 */
export function useUpdateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateUserInput;
    }) => {
      return await pb.collection(COLLECTIONS.USERS).update<User>(id, input);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
      qc.invalidateQueries({ queryKey: queryKeys.users.detail(data.id) });
    },
  });
}

/**
 * Reset password user (admin only)
 * PocketBase butuh oldPassword atau special API - kita pakai admin API
 */
export function useResetUserPassword() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newPassword,
      passwordConfirm,
    }: {
      userId: string;
      newPassword: string;
      passwordConfirm: string;
    }) => {
      // Untuk MVP: kita pakai update biasa (butuh admin token / superuser)
      // Note: Ini akan bekerja karena API Rules kita allow admin update anyone
      return await pb.collection(COLLECTIONS.USERS).update<User>(userId, {
        password: newPassword,
        passwordConfirm: passwordConfirm,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
    },
  });
}

/**
 * Toggle user active/inactive
 */
export function useToggleUserActive() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (user: User) => {
      return await pb.collection(COLLECTIONS.USERS).update<User>(user.id, {
        is_active: !user.is_active,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
    },
  });
}

/**
 * Delete user (admin only, tidak bisa hapus diri sendiri)
 */
export function useDeleteUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await pb.collection(COLLECTIONS.USERS).delete(id);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}