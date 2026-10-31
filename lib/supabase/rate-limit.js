import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { catalogClient } from "@/lib/supabase/catalog";

export async function biblioFingerprint(source) {
  const h = source || await headers();
  const address = h.get("x-vercel-forwarded-for") || h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "unknown";
  return createHmac("sha256", process.env.SUPABASE_SECRET_KEY).update(address.trim()).digest("hex");
}

export async function consumeLimit(kind, source, seconds, maximum) {
  try {
    const { data, error } = await catalogClient().rpc("biblio_consume_limit", {
      p_kind: kind,
      p_source: source,
      p_window_seconds: seconds,
      p_max: maximum,
    });
    return !error && data === true;
  } catch {
    return false;
  }
}
