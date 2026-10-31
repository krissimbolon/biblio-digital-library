"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";
import { catalogClient } from "@/lib/supabase/catalog";

async function record(user,aksi,target){
  await catalogClient().from("admin_log").insert({admin_id:user.id,admin_email:user.email,aksi,target:String(target||"").slice(0,200)});
}
export async function inviteAdmin(form) {
  const {user}=await requireAdmin();
  const email=String(form.get("email")||"").trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)redirect("/admin/admins?error=email");
  const db=catalogClient();
  const {data,error}=await db.auth.admin.inviteUserByEmail(email);
  if(error||!data.user?.id)redirect("/admin/admins?error=invite");
  const {error:rowError}=await db.from("biblio_admins").upsert({user_id:data.user.id,email,aktif:true});
  if(rowError)redirect("/admin/admins?error=save");
  await record(user,"Undang administrator",email);
  revalidatePath("/admin/admins");
  redirect("/admin/admins?status=diundang");
}
export async function toggleAdmin(form) {
  const {user}=await requireAdmin();
  const target=String(form.get("user_id")||"");
  if(!target||target===user.id)redirect("/admin/admins?error=self");
  const db=catalogClient();
  const {data:admin}=await db.from("biblio_admins").select("email,aktif").eq("user_id",target).maybeSingle();
  if(!admin)return;
  const {error}=await db.from("biblio_admins").update({aktif:!admin.aktif}).eq("user_id",target);
  if(error)redirect("/admin/admins?error=save");
  await record(user,admin.aktif?"Nonaktifkan administrator":"Aktifkan administrator",admin.email);
  revalidatePath("/admin/admins");
}
export async function deleteAdmin(form) {
  const {user}=await requireAdmin();
  const target=String(form.get("user_id")||"");
  if(!target||target===user.id)redirect("/admin/admins?error=self");
  const db=catalogClient();
  const {data:admin}=await db.from("biblio_admins").select("email").eq("user_id",target).maybeSingle();
  if(!admin)return;
  const {error}=await db.auth.admin.deleteUser(target);
  if(error)redirect("/admin/admins?error=delete");
  await db.from("biblio_admins").delete().eq("user_id",target);
  await record(user,"Hapus administrator",admin.email);
  revalidatePath("/admin/admins");
}
