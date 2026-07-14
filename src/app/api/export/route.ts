import { NextResponse } from "next/server";

/**
 * API route untuk export data.
 * Belum diimplementasikan — export dilakukan client-side pakai Papa Parse.
 */
export async function GET() {
  return NextResponse.json(
    { message: "Not implemented. Use client-side export." },
    { status: 501 }
  );
}