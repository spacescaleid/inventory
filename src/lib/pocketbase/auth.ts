import pb from "./client";
import { COLLECTIONS } from "./collections";
import type { User, LoginInput } from "@/types";

/**
 * Login dengan email/username + password
 */
export async function login(input: LoginInput): Promise<User> {
  const authData = await pb
    .collection(COLLECTIONS.USERS)
    .authWithPassword(input.identity, input.password);

  return authData.record as unknown as User;
}

/**
 * Logout — clear auth store
 */
export function logout(): void {
  pb.authStore.clear();
}

/**
 * Cek apakah user sudah login
 */
export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  if (!pb.authStore.isValid || !pb.authStore.record) return null;
  return pb.authStore.record as unknown as User;
}

/**
 * Refresh auth token (dipanggil saat app load)
 */
export async function refreshAuth(): Promise<User | null> {
  if (!pb.authStore.isValid) return null;

  try {
    const authData = await pb.collection(COLLECTIONS.USERS).authRefresh();
    return authData.record as unknown as User;
  } catch {
    pb.authStore.clear();
    return null;
  }
}

/**
 * Update password sendiri
 */
export async function changeMyPassword(input: {
  oldPassword: string;
  newPassword: string;
  passwordConfirm: string;
}): Promise<void> {
  const user = getCurrentUser();
  if (!user) throw new Error("User tidak terauthentikasi");

  await pb.collection(COLLECTIONS.USERS).update(user.id, {
    oldPassword: input.oldPassword,
    password: input.newPassword,
    passwordConfirm: input.passwordConfirm,
  });
}