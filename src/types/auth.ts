import type { PocketBaseRecord } from "./index";

export type UserRole = "admin" | "operator";

export interface User extends PocketBaseRecord {
  email: string;
  name: string;
  username: string;
  avatar?: string;
  role: UserRole;
  is_active: boolean;
  last_login?: string;
}

export interface LoginInput {
  identity: string; // email atau username
  password: string;
}

export interface CreateUserInput {
  email: string;
  username: string;
  name: string;
  password: string;
  role: UserRole;
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