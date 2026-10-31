import {NextResponse} from "next/server";
import {catalogClient} from "@/lib/supabase/catalog";
export async function POST(request) {
  const origin=request.headers.get("origin");
  if (origin && new URL(origin).host!==request.headers.get("host")) return new NextResponse(null,{status:403});
  let payload;
  try {payload=await request.json()} catch {return new NextResponse(null,{status:400})}
  const id=Number(payload.id);
  if (!Number.isSafeInteger(id)||id<1) return new NextResponse(null,{status:400});
  try {
    const {error}=await catalogClient().from("wa_clicks").insert({produk_id:id});
    if(error) return new NextResponse(null,{status:503});
  } catch {return new NextResponse(null,{status:503})}
  return new NextResponse(null,{status:204});
}
