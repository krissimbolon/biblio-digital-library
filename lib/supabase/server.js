import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function sessionClient() {
  const store = await cookies();
  return createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() { return store.getAll(); },
      setAll(changes) {
        try { changes.forEach(({ name, value, options }) => store.set(name, value, options)); }
        catch { /* Cookie disegarkan melalui proxy atau Server Action. */ }
      },
    },
  });
}

export async function requireAdmin() {
  const supabase = await sessionClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !process.env.BIBLIO_ADMIN_UID || user.id !== process.env.BIBLIO_ADMIN_UID) {
    throw new Error("Akses administrator ditolak.");
  }
  return { supabase, user };
}
