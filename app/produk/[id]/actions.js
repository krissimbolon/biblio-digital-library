"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createHmac } from "node:crypto";
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
    const h=await headers();
    const ip=h.get("x-real-ip")||h.get("x-forwarded-for")?.split(",")[0]||"unknown";
    const source=createHmac("sha256",process.env.SUPABASE_SECRET_KEY).update(String(ip)).digest("hex");
    const since=new Date(Date.now()-10*60*1000).toISOString();
    const {data:recent,error:errRate}=await db.from("batas_kiriman").select("id").eq("jenis","ulasan").eq("sumber",source).gte("created_at",since).limit(1);
    if(errRate||recent?.length) redirect(base+"?ulasan=batas");
    const {error:errLimit}=await db.from("batas_kiriman").insert({jenis:"ulasan",sumber:source});
    if(errLimit) redirect(base+"?ulasan=batas");
    const {error}=await db.from("ulasan").insert({produk_id:id,nama,rating,komentar,tampil:true});
    if(error) redirect(base+"?ulasan=gagal");
  } catch(error) {
    if(error?.digest?.startsWith("NEXT_REDIRECT"))throw error;
    redirect(base+"?ulasan=gagal");
  }
  revalidatePath(base);
  redirect(base+"?ulasan=terkirim");
}
