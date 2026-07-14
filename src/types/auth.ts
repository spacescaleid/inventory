import type { PocketBaseRecord } from "./index";

export type UserRole = "admin" | "operator";

export interface User extends PocketBaseRecord {
  email: string;
  emailVisibility?: boolean;
  verified?: boolean;
  username: string;
  name: string;
  avatar?: string;
  role: UserRole;
  is_active: boolean;
  last_login?: string;
}

export interface LoginInput {
  identity: string;
  password: string;
}

// Legacy — untuk kompatibilitas import lain
export interface CreateUserInput {
  email: string;
  username: string;
  name: string;
  password: string;
  passwordConfirm: string;
  role: UserRole;
  is_active?: boolean;
  emailVisibility?: boolean;
  verified?: boolean;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
  passwordConfirm: string;
}

export interface ResetPasswordInput {
  userId: string;
  newPassword: string;
  passwordConfirm: string;
}