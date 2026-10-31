"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";
import { catalogClient } from "@/lib/supabase/catalog";

export async function saveSettings(form) {
  const {user}=await requireAdmin();
  const nama=String(form.get("nama")||"").trim();
  const nomor_whatsapp=String(form.get("nomor_whatsapp")||"").trim();
  const jam_buka=String(form.get("jam_buka")||"").trim();
  const alamat=String(form.get("alamat")||"").trim();
  if(!nama||nama.length>80||!/^62[0-9]{8,13}$/.test(nomor_whatsapp)||!jam_buka||jam_buka.length>120||!alamat||alamat.length>200)
    redirect("/admin/toko?error=invalid");
  const db=catalogClient();
  const {error}=await db.from("pengaturan_toko").upsert({id:1,nama,nomor_whatsapp,jam_buka,alamat,updated_at:new Date().toISOString()});
  if(error)redirect("/admin/toko?error=save");
  await db.from("admin_log").insert({admin_id:user.id,admin_email:user.email,aksi:"Ubah pengaturan toko",target:nama});
  revalidatePath("/", "layout");
  revalidatePath("/tentang");
  redirect("/admin/toko?status=tersimpan");
}
