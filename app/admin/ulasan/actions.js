"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";
import { catalogClient } from "@/lib/supabase/catalog";

async function log(user,aksi,target){
  await catalogClient().from("admin_log").insert({admin_id:user.id,admin_email:user.email,aksi,target:String(target)});
}
export async function toggleReview(form) {
  const {user}=await requireAdmin();
  const id=Number(form.get("id"));
  if(!Number.isSafeInteger(id)||id<1)return;
  const db=catalogClient();
  const {data:item}=await db.from("ulasan").select("produk_id,nama,tampil").eq("id",id).maybeSingle();
  if(!item)return;
  const {error}=await db.from("ulasan").update({tampil:!item.tampil}).eq("id",id);
  if(error)throw new Error("Ulasan gagal diubah");
  await log(user,item.tampil?"Sembunyikan ulasan":"Tampilkan ulasan",item.nama);
  revalidatePath("/produk/"+item.produk_id);
  revalidatePath("/admin/ulasan");
}
export async function deleteReview(form) {
  const {user}=await requireAdmin();
  const id=Number(form.get("id"));
  if(!Number.isSafeInteger(id)||id<1)return;
  const db=catalogClient();
  const {data:item}=await db.from("ulasan").select("produk_id,nama").eq("id",id).maybeSingle();
  if(!item)return;
  const {error}=await db.from("ulasan").delete().eq("id",id);
  if(error)throw new Error("Ulasan gagal dihapus");
  await log(user,"Hapus ulasan",item.nama);
  revalidatePath("/produk/"+item.produk_id);
  revalidatePath("/admin/ulasan");
}
