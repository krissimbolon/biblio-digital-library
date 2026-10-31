"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";
import { catalogClient } from "@/lib/supabase/catalog";

function urlValid(v) {return !v || (v.startsWith("https://") || (v.startsWith("/")&&!v.startsWith("//")));}

export async function saveBanner(form) {
  const {user}=await requireAdmin();
  const id=Number(form.get("id"));
  const judul=String(form.get("judul")||"").trim();
  const teks=String(form.get("teks")||"").trim();
  const gambar_url=String(form.get("gambar_url")||"").trim();
  const tautan=String(form.get("tautan")||"").trim();
  const urutan=Number(form.get("urutan")||0);
  if(!judul||judul.length>120||teks.length>300||gambar_url.length>1024||tautan.length>1024||!urlValid(gambar_url)||!urlValid(tautan)||!Number.isSafeInteger(urutan)||Math.abs(urutan)>100000)
    redirect("/admin/banner?error=invalid");
  const values={judul,teks:teks||null,gambar_url:gambar_url||null,tautan:tautan||null,urutan,aktif:form.get("aktif")==="on",updated_at:new Date().toISOString()};
  const db=catalogClient();
  const {error}=Number.isSafeInteger(id)&&id>0
    ?await db.from("banner").update(values).eq("id",id)
    :await db.from("banner").insert(values);
  if(error)redirect("/admin/banner?error=save");
  await db.from("admin_log").insert({admin_id:user.id,admin_email:user.email,aksi:"Simpan banner",target:judul});
  revalidatePath("/");
  revalidatePath("/admin/banner");
  redirect("/admin/banner?status=tersimpan");
}
export async function toggleBanner(form) {
  const {user}=await requireAdmin();
  const id=Number(form.get("id"));
  if(!Number.isSafeInteger(id)||id<1)return;
  const db=catalogClient();
  const {data}=await db.from("banner").select("judul,aktif").eq("id",id).maybeSingle();
  if(!data)return;
  const {error}=await db.from("banner").update({aktif:!data.aktif,updated_at:new Date().toISOString()}).eq("id",id);
  if(error)throw new Error("Status banner gagal disimpan");
  await db.from("admin_log").insert({admin_id:user.id,admin_email:user.email,aksi:data.aktif?"Nonaktifkan banner":"Aktifkan banner",target:data.judul});
  revalidatePath("/");
  revalidatePath("/admin/banner");
}
