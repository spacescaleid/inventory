import PocketBase from "pocketbase";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://localhost:8090";

/**
 * Global PocketBase client instance.
 *
 * Untuk MVP: single instance sudah cukup.
 * Nanti jika perlu SSR proper, bisa buat instance per request.
 */
export const pb = new PocketBase(PB_URL);

// Disable auto-cancellation untuk multi request paralel
// (default PocketBase auto-cancel request yang belum selesai)
pb.autoCancellation(false);

export default pb;