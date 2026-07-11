import PocketBase from "pocketbase";
import type { User } from "@/types";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "https://inventory.spacescale.online";

/**
 * Global PocketBase client instance.
 * Singleton — dibuat sekali, dipakai di seluruh app.
 */
export const pb = new PocketBase(PB_URL);

// Disable auto-cancellation supaya multiple requests bisa parallel
// (default: PocketBase auto-cancel request dengan key yang sama)
pb.autoCancellation(false);

/**
 * Type-safe helper untuk get current user
 */
export function getCurrentUser(): User | null {
  if (!pb.authStore.isValid || !pb.authStore.record) return null;
  return pb.authStore.record as unknown as User;
}

/**
 * Check apakah user terauth
 */
export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

/**
 * Get auth token
 */
export function getAuthToken(): string {
  return pb.authStore.token;
}

export default pb;