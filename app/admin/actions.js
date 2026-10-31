"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sessionClient, requireAdmin } from "@/lib/supabase/server";

export async function login(data) {
  const email=String(data.get("email")||"").trim();
  const password=String(data.get("password")||"");
  const client=await sessionClient();
  if (!email || !password) redirect("/admin/login?error=1");
  const {data:result,error}=await client.auth.signInWithPassword({email,password});
  if (error?.status===429) redirect("/admin/login?error=rate");
  if (error || !result.user || result.user.id!==process.env.BIBLIO_ADMIN_UID) {
    await client.auth.signOut();
    redirect("/admin/login?error=1");
  }
  redirect("/admin");
}

export async function logout() {
  const client=await sessionClient();
  await client.auth.signOut();
  redirect("/admin/login");
}

export async function changePassword(data) {
  const {supabase}=await requireAdmin();
  const password=String(data.get("password_baru")||"");
  const confirm=String(data.get("konfirmasi_password")||"");
  if (password.length<8) redirect("/admin/password?error=length");
  if (password!==confirm) redirect("/admin/password?error=mismatch");
  const {error}=await supabase.auth.updateUser({password});
  if (error?.code==="same_password") redirect("/admin/password?error=same");
  if (error) redirect("/admin/password?error=save");
  redirect("/admin/password?status=success");
}

function parseProduct(form) {
  const nama=String(form.get("nama")||"").trim().slice(0,160);
  const harga=Number(form.get("harga"));
  const kategori=String(form.get("kategori")||"").trim().slice(0,80);
  const deskripsi=String(form.get("deskripsi")||"").trim().slice(0,4000);
  const foto_url=String(form.get("foto_url")||"").trim().slice(0,1024);
  if (!nama || !Number.isSafeInteger(harga) || harga<0 || harga>2000000000) return null;
  if (foto_url && !foto_url.startsWith("/") && !foto_url.startsWith("https://")) return null;
  return {nama,harga,kategori,deskripsi,foto_url:foto_url||null};
}

export async function addProduct(form) {
  const {supabase}=await requireAdmin();
  const values=parseProduct(form);
  if (!values) redirect("/admin/produk/baru?error=invalid");
  const {error}=await supabase.from("produk").insert(values);
  if (error) redirect("/admin/produk/baru?error=save");
  revalidatePath("/");
  redirect("/admin");
}

export async function editProduct(id,form) {
  const {supabase}=await requireAdmin();
  const values=parseProduct(form);
  if (!values) redirect("/admin/produk/"+id+"/ubah?error=invalid");
  const {error}=await supabase.from("produk").update(values).eq("id",id);
  if (error) redirect("/admin/produk/"+id+"/ubah?error=save");
  revalidatePath("/");
  revalidatePath("/produk/"+id);
  redirect("/admin");
}

export async function deleteProduct(form) {
  const {supabase}=await requireAdmin();
  const id=Number(form.get("id"));
  if (!Number.isSafeInteger(id)||id<1) throw new Error("Buku tidak valid");
  const {error}=await supabase.from("produk").delete().eq("id",id);
  if (error) throw new Error("Buku gagal dihapus");
  revalidatePath("/");
  revalidatePath("/admin");
}
