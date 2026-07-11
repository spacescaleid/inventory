"use client";

import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

/**
 * Halaman /lainnya sudah tidak dipakai lagi.
 * Redirect ke /profil untuk operator.
 */
export default function LainnyaRedirect() {
  redirect(ROUTES.PROFIL);
}