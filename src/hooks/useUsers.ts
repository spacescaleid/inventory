"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase/client";
import { COLLECTIONS } from "@/lib/pocketbase/collections";
import { queryKeys } from "@/constants/query-keys";
import type { User, UserRole } from "@/types";

interface UserFilterOptions {
  search?: string;
  role?: "admin" | "operator" | "all";
}

/**
 * Payload untuk create user — explicit fields only
 */
export interface CreateUserPayload {
  username: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

/**
 * Payload untuk update user — TIDAK ADA password/passwordConfirm
 */
export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
}

// ============================================
// Queries
// ============================================

export function useUsers(options: UserFilterOptions = {}) {
  return useQuery({
    queryKey: queryKeys.users.list({
      search: options.search,
      role: options.role,
    }),
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

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => {
      return await pb.collection(COLLECTIONS.USERS).getOne<User>(id);
    },
    enabled: !!id,
  });
}

// ============================================
// Mutations
// ============================================

/**
 * Create user baru
 */
export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserPayload) => {
      // Build clean payload
      const payload = {
        username: input.username.trim().toLowerCase(),
        email: input.email.trim().toLowerCase(),
        name: input.name.trim(),
        password: input.password,
        passwordConfirm: input.password, // ALWAYS same
        role: input.role,
        is_active: true,
        emailVisibility: false,
        verified: true,
      };

      console.log("Creating user with payload:", {
        ...payload,
        password: "***",
        passwordConfirm: "***",
      });

      return await pb.collection(COLLECTIONS.USERS).create<User>(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}

/**
 * Update user — HANYA name, email, role, is_active
 * TIDAK PERNAH kirim password / passwordConfirm
 */
export function useUpdateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateUserPayload;
    }) => {
      // Build clean payload — filter undefined/empty
      const payload: Record<string, unknown> = {};

      if (input.name !== undefined && input.name.trim() !== "") {
        payload.name = input.name.trim();
      }
      if (input.email !== undefined && input.email.trim() !== "") {
        payload.email = input.email.trim().toLowerCase();
      }
      if (input.role !== undefined) {
        payload.role = input.role;
      }
      if (input.is_active !== undefined) {
        payload.is_active = input.is_active;
      }

      console.log("Updating user with payload:", payload);

      return await pb.collection(COLLECTIONS.USERS).update<User>(id, payload);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
      qc.invalidateQueries({ queryKey: queryKeys.users.detail(data.id) });
    },
  });
}

/**
 * Reset password user oleh admin
 */
export function useResetUserPassword() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newPassword,
    }: {
      userId: string;
      newPassword: string;
    }) => {
      const payload = {
        password: newPassword,
        passwordConfirm: newPassword, // ALWAYS same
      };

      console.log("Resetting password for user:", userId);

      return await pb.collection(COLLECTIONS.USERS).update<User>(userId, payload);
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
 * Delete user
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