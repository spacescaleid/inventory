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

export interface CreateUserPayload {
  username: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
}

const PB_URL =
  process.env.NEXT_PUBLIC_PB_URL || "https://inventory.spacescale.online";

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
// Mutations (via Raw Fetch — bypass SDK issues)
// ============================================

/**
 * Create user baru via raw fetch.
 * TIDAK set field `verified` (dilarang di client-side PocketBase v0.23+).
 */
export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserPayload) => {
      const payload = {
        username: input.username.trim().toLowerCase(),
        email: input.email.trim().toLowerCase(),
        name: input.name.trim(),
        password: input.password,
        passwordConfirm: input.password,
        role: input.role,
        is_active: true,
        emailVisibility: false,
      };

      console.log("[useCreateUser] Sending payload:", {
        ...payload,
        password: "***",
        passwordConfirm: "***",
      });

      const response = await fetch(
        `${PB_URL}/api/collections/users/records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: pb.authStore.token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[useCreateUser] Error response:", errorData);
        throw {
          status: response.status,
          data: errorData,
          message: errorData.message || "Failed to create user",
          response: errorData,
        };
      }

      const data = await response.json();
      return data as User;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}

/**
 * Update user via raw fetch — hanya field yang boleh diubah.
 * TIDAK PERNAH kirim password / passwordConfirm.
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
      const payload: Record<string, string | boolean> = {};

      if (typeof input.name === "string" && input.name.trim() !== "") {
        payload.name = input.name.trim();
      }
      if (typeof input.email === "string" && input.email.trim() !== "") {
        payload.email = input.email.trim().toLowerCase();
      }
      if (input.role === "admin" || input.role === "operator") {
        payload.role = input.role;
      }
      if (typeof input.is_active === "boolean") {
        payload.is_active = input.is_active;
      }

      console.log("[useUpdateUser] Sending payload:", payload);

      const response = await fetch(
        `${PB_URL}/api/collections/users/records/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: pb.authStore.token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[useUpdateUser] Error response:", errorData);
        throw {
          status: response.status,
          data: errorData,
          message: errorData.message || "Failed to update user",
          response: errorData,
        };
      }

      const data = await response.json();
      return data as User;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
      qc.invalidateQueries({ queryKey: queryKeys.users.detail(data.id) });
    },
  });
}

/**
 * Reset password user via raw fetch.
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
        passwordConfirm: newPassword,
      };

      console.log("[useResetUserPassword] Resetting for:", userId);

      const response = await fetch(
        `${PB_URL}/api/collections/users/records/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: pb.authStore.token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          status: response.status,
          data: errorData,
          message: errorData.message || "Failed to reset password",
          response: errorData,
        };
      }

      return await response.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
    },
  });
}

/**
 * Toggle user active/inactive.
 */
export function useToggleUserActive() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (user: User) => {
      const response = await fetch(
        `${PB_URL}/api/collections/users/records/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: pb.authStore.token,
          },
          body: JSON.stringify({
            is_active: !user.is_active,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          status: response.status,
          data: errorData,
          message: errorData.message || "Failed to toggle active",
          response: errorData,
        };
      }

      return await response.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
    },
  });
}

/**
 * Delete user.
 */
export function useDeleteUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `${PB_URL}/api/collections/users/records/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: pb.authStore.token,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          status: response.status,
          data: errorData,
          message: errorData.message || "Failed to delete user",
          response: errorData,
        };
      }

      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}