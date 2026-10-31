import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

function policy(nonce) {
  const development = process.env.NODE_ENV !== "production";
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "frame-src 'none'",
    "connect-src 'self'",
    "img-src 'self' https: data: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "script-src 'self' 'nonce-" + nonce + "' 'strict-dynamic'" + (development ? " 'unsafe-eval'" : ""),
    "upgrade-insecure-requests",
  ].join("; ");
}

export async function proxy(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = policy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  let response = NextResponse.next({request:{headers:requestHeaders}});
  const path = request.nextUrl.pathname;
  const isAdmin = path === "/admin" || (path.startsWith("/admin/") && path !== "/admin/login");

  if (isAdmin) {
    const supabase = createServerClient(process.env.SUPABASE_URL,process.env.SUPABASE_PUBLISHABLE_KEY,{
      cookies:{
        getAll(){return request.cookies.getAll();},
        setAll(changes){
          changes.forEach(({name,value})=>request.cookies.set(name,value));
          requestHeaders.set("cookie",request.cookies.toString());
          response=NextResponse.next({request:{headers:requestHeaders}});
          changes.forEach(({name,value,options})=>response.cookies.set(name,value,options));
        },
      },
    });
    const {data:{user},error}=await supabase.auth.getUser();
    if (error || !user) return NextResponse.redirect(new URL("/admin/login",request.url));
    let allowed=false;
    try {
      const admin=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SECRET_KEY,{
        auth:{persistSession:false,autoRefreshToken:false},
      });
      const {data,error:roleError}=await admin.from("biblio_admins").select("aktif").eq("user_id",user.id).maybeSingle();
      allowed=!roleError && (data ? data.aktif===true : user.id===process.env.BIBLIO_ADMIN_UID);
    } catch {allowed=false;}
    if (!allowed) return NextResponse.redirect(new URL("/admin/login",request.url));
    response.headers.set("X-Robots-Tag","noindex, nofollow, noarchive");
  }

  response.headers.set("Content-Security-Policy",csp);
  return response;
}

export const config={
  matcher:["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};
