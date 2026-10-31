"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { biblioFingerprint, consumeLimit } from "@/lib/supabase/rate-limit";
import { catalogClient } from "@/lib/supabase/catalog";

export async function kirimUlasan(form) {
  const id=Number(form.get("produk_id"));
  if(!Number.isSafeInteger(id)||id<1) redirect("/");
  const base="/produk/"+id;
  if(String(form.get("situs")||"")) redirect(base);
  const nama=String(form.get("nama")||"").trim();
  const komentar=String(form.get("komentar")||"").trim();
  const rating=Number(form.get("rating"));
  if(!nama||nama.length>60||komentar.length<3||komentar.length>1000||!Number.isInteger(rating)||rating<1||rating>5) redirect(base+"?ulasan=invalid");
  try {
    const db=catalogClient();
    const {data:book}=await db.from("produk").select("id").eq("id",id).eq("aktif",true).maybeSingle();
    if(!book) redirect("/");
    const permitted = await consumeLimit("ulasan", await biblioFingerprint(), 10 * 60, 1);
    if (!permitted) redirect(base + "?ulasan=batas");
    const {error}=await db.from("ulasan").insert({produk_id:id,nama,rating,komentar,tampil:true});
    if(error) redirect(base+"?ulasan=gagal");
  } catch(error) {
    if(error?.digest?.startsWith("NEXT_REDIRECT"))throw error;
    redirect(base+"?ulasan=gagal");
  }
  revalidatePath(base);
  redirect(base+"?ulasan=terkirim");
}
