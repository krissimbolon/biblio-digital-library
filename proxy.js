import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(changes) {
        changes.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        changes.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !process.env.BIBLIO_ADMIN_UID || user.id !== process.env.BIBLIO_ADMIN_UID) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
