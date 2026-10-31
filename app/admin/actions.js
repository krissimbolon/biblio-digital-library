"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sessionClient, requireAdmin } from "@/lib/supabase/server";
import { catalogClient } from "@/lib/supabase/catalog";
import { slugify } from "@/lib/format";
import { randomUUID } from "node:crypto";
import { isAdminAllowed } from "@/lib/supabase/admin-access";
import { biblioFingerprint, consumeLimit } from "@/lib/supabase/rate-limit";

export async function login(data) {
  const email=String(data.get("email")||"").trim();
  const password=String(data.get("password")||"");
  const client=await sessionClient();
  if (!email || !password) redirect("/admin/login?error=1");
  if (!(await consumeLimit("masuk", await biblioFingerprint(), 15 * 60, 8))) redirect("/admin/login?error=rate");
  const {data:result,error}=await client.auth.signInWithPassword({email,password});
  if (error?.status===429) redirect("/admin/login?error=rate");
  if (error || !result.user || !(await isAdminAllowed(result.user.id))) {
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

function angka(form, nama) {
  const nilai = String(form.get(nama) ?? "").trim();
  return nilai === "" ? null : Number(nilai);
}

function parseProduct(form) {
  const raw = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string"));
  raw.aktif = form.get("aktif") === "on";
  const errors = {};
  const nama = String(raw.nama || "").trim();
  const harga = angka(form, "harga");
  const harga_diskon = angka(form, "harga_diskon");
  const stok = angka(form, "stok");
  const kategori = String(raw.kategori || "").trim();
  const deskripsi = String(raw.deskripsi || "").trim();
  const foto_url = String(raw.foto_url || "").trim();
  if (!nama || nama.length > 160) errors.nama = "Isi judul buku (maksimal 160 karakter).";
  if (!Number.isSafeInteger(harga) || harga <= 0 || harga > 2000000000)
    errors.harga = "Harga harus bilangan bulat positif, maksimal Rp2.000.000.000.";
  if (harga_diskon !== null && (!Number.isSafeInteger(harga_diskon) || harga_diskon < 0 || harga_diskon >= harga))
    errors.harga_diskon = "Harga diskon harus lebih kecil daripada harga normal.";
  if (!Number.isSafeInteger(stok) || stok < 0 || stok > 100000)
    errors.stok = "Stok harus bilangan bulat dari 0 sampai 100.000.";
  if (kategori.length > 80) errors.kategori = "Kategori maksimal 80 karakter.";
  if (deskripsi.length > 4000) errors.deskripsi = "Deskripsi maksimal 4.000 karakter.";
  if (foto_url.length > 1024 || (foto_url && !(foto_url.startsWith("https://") || (foto_url.startsWith("/") && !foto_url.startsWith("//")))))
    errors.foto_url = "Gunakan URL HTTPS atau path situs yang valid.";
  return { errors, raw, values: { nama, harga, harga_diskon, stok, kategori: kategori || null, deskripsi, foto_url: foto_url || null, aktif: raw.aktif } };
}

function formError(previous, parsed, key, message) {
  return { values: parsed.raw, errors: { ...parsed.errors, [key]: message }, attempt: (previous?.attempt || 0) + 1 };
}

const BATAS_FOTO = 2 * 1024 * 1024;
const TIPE_FOTO = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

function fotoValid(bytes, tipe) {
  if (tipe === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (tipe === "image/png") return bytes.length >= 8 && [137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v);
  if (tipe === "image/webp") return bytes.length >= 12 && Buffer.from(bytes).toString("ascii",0,4)==="RIFF" && Buffer.from(bytes).toString("ascii",8,12)==="WEBP";
  return false;
}

async function simpanFoto(file) {
  if (!file || typeof file.arrayBuffer !== "function" || !file.size) return { url: null };
  if (file.size > BATAS_FOTO || !TIPE_FOTO[file.type]) return { error: "file" };
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!fotoValid(bytes, file.type)) return { error: "file" };
  const path = randomUUID() + "." + TIPE_FOTO[file.type];
  const storage = catalogClient().storage.from("sampul");
  const { error } = await storage.upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) return { error: "upload" };
  return { url: storage.getPublicUrl(path).data.publicUrl };
}

async function gambarProduk(form, values) {
  const foto = await simpanFoto(form.get("sampul_file"));
  if (foto.error) return { error: foto.error };
  const files = form.getAll("galeri_files").filter(f => f && typeof f.arrayBuffer==="function" && f.size > 0);
  if (files.length > 5) return { error: "file" };
  const links = String(form.get("galeri_urls") || "").split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  if (links.length + files.length > 6 || links.some(x=>x.length>1024 || !(x.startsWith("https://") || (x.startsWith("/") && !x.startsWith("//"))))) return { error: "galeri" };
  const galeri = [...links];
  for (const file of files) {
    const uploaded = await simpanFoto(file);
    if (uploaded.error) return { error: uploaded.error };
    if (uploaded.url) galeri.push(uploaded.url);
  }
  return { values: { ...values, foto_url: foto.url || values.foto_url, galeri } };
}

async function catatLog(user, aksi, target) {
  try {
    await catalogClient().from("admin_log").insert({ admin_id: user.id, admin_email: user.email, aksi, target: String(target || "").slice(0, 200) });
  } catch {}
}

function segarkan(id) {
  revalidatePath("/");
  revalidatePath("/admin");
  if (id) revalidatePath("/produk/" + id);
}

export async function addProduct(previous, form) {
  const { supabase, user } = await requireAdmin();
  const parsed = parseProduct(form);
  if (Object.keys(parsed.errors).length) return { errors: parsed.errors, values: parsed.raw, attempt: (previous?.attempt || 0) + 1 };
  const prepared = await gambarProduk(form, parsed.values);
  if (prepared.error) return formError(previous, parsed, prepared.error === "file" ? "sampul_file" : prepared.error === "galeri" ? "galeri_urls" : "form",
    prepared.error === "file" ? "Unggah JPG, PNG, atau WebP maksimal 2 MB per foto dan lima berkas galeri." : prepared.error === "galeri" ? "Periksa alamat gambar galeri (maksimal enam)." : "Foto gagal diunggah.");
  const { data: akhir } = await supabase.from("produk").select("urutan").order("urutan", { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await supabase.from("produk").insert({ ...prepared.values, urutan: (akhir?.urutan || 0) + 1 }).select("id").single();
  if (error) return formError(previous, parsed, "form", "Buku gagal disimpan. Periksa data dan coba kembali.");
  await catatLog(user, "Tambah buku", parsed.values.nama + " (#" + data.id + ")");
  segarkan();
  redirect("/admin");
}

export async function editProduct(id, previous, form) {
  const { supabase, user } = await requireAdmin();
  if (!Number.isSafeInteger(Number(id)) || Number(id) < 1) redirect("/admin");
  const parsed = parseProduct(form);
  if (Object.keys(parsed.errors).length) return { errors: parsed.errors, values: parsed.raw, attempt: (previous?.attempt || 0) + 1 };
  const prepared = await gambarProduk(form, parsed.values);
  if (prepared.error) return formError(previous, parsed, prepared.error === "file" ? "sampul_file" : prepared.error === "galeri" ? "galeri_urls" : "form",
    prepared.error === "file" ? "Unggah JPG, PNG, atau WebP maksimal 2 MB per foto dan lima berkas galeri." : prepared.error === "galeri" ? "Periksa alamat gambar galeri (maksimal enam)." : "Foto gagal diunggah.");
  const { error } = await supabase.from("produk").update(prepared.values).eq("id", id);
  if (error) return formError(previous, parsed, "form", "Perubahan buku gagal disimpan.");
  await catatLog(user, "Ubah buku", parsed.values.nama + " (#" + id + ")");
  segarkan(id);
  redirect("/admin");
}

export async function deleteProduct(form) {
  const { supabase, user } = await requireAdmin();
  const id = Number(form.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("Buku tidak valid");
  const { data: buku } = await supabase.from("produk").select("nama").eq("id", id).maybeSingle();
  const { error } = await supabase.from("produk").delete().eq("id", id);
  if (error) throw new Error("Buku gagal dihapus");
  await catatLog(user, "Hapus buku", (buku?.nama || "Buku") + " (#" + id + ")");
  segarkan(id);
}

export async function toggleProduct(form) {
  const { supabase, user } = await requireAdmin();
  const id = Number(form.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) return;
  const { data: buku } = await supabase.from("produk").select("nama,aktif").eq("id", id).maybeSingle();
  if (!buku) return;
  await supabase.from("produk").update({ aktif: !buku.aktif }).eq("id", id);
  await catatLog(user, buku.aktif ? "Nonaktifkan buku" : "Aktifkan buku", buku.nama + " (#" + id + ")");
  segarkan(id);
}

export async function moveProduct(form) {
  const { supabase, user } = await requireAdmin();
  const id = Number(form.get("id"));
  const arah = form.get("arah") === "naik" ? "naik" : "turun";
  if (!Number.isSafeInteger(id) || id < 1) return;
  const { data: buku } = await supabase.from("produk").select("id,nama,urutan").eq("id", id).maybeSingle();
  if (!buku) return;
  let query = supabase.from("produk").select("id,urutan");
  query = arah === "naik"
    ? query.lt("urutan", buku.urutan).order("urutan", { ascending: false })
    : query.gt("urutan", buku.urutan).order("urutan", { ascending: true });
  const { data: tetangga } = await query.limit(1).maybeSingle();
  if (!tetangga) return;
  await supabase.from("produk").update({ urutan: tetangga.urutan }).eq("id", buku.id);
  await supabase.from("produk").update({ urutan: buku.urutan }).eq("id", tetangga.id);
  await catatLog(user, "Ubah urutan buku", buku.nama + " (" + arah + ")");
  segarkan();
}

export async function addCategory(form) {
  const { user } = await requireAdmin();
  const nama = String(form.get("nama") || "").trim().slice(0, 80);
  const slug = slugify(nama);
  if (!nama || !slug) redirect("/admin/kategori?error=nama");
  const { error } = await catalogClient().from("kategori").insert({ nama, slug });
  if (error) redirect("/admin/kategori?error=duplikat");
  await catatLog(user, "Tambah kategori", nama);
  segarkan();
  redirect("/admin/kategori?status=tambah");
}

export async function renameCategory(form) {
  const { user } = await requireAdmin();
  const id = Number(form.get("id"));
  const nama = String(form.get("nama") || "").trim().slice(0, 80);
  const slug = slugify(nama);
  if (!Number.isSafeInteger(id) || !nama || !slug) redirect("/admin/kategori?error=nama");
  const client = catalogClient();
  const { data: lama } = await client.from("kategori").select("nama").eq("id", id).maybeSingle();
  if (!lama) redirect("/admin/kategori?error=nama");
  const { error } = await client.from("kategori").update({ nama, slug }).eq("id", id);
  if (error) redirect("/admin/kategori?error=duplikat");
  await client.from("produk").update({ kategori: nama }).eq("kategori", lama.nama);
  await catatLog(user, "Ubah kategori", lama.nama + " → " + nama);
  segarkan();
  redirect("/admin/kategori?status=ubah");
}

export async function deleteCategory(form) {
  const { user } = await requireAdmin();
  const id = Number(form.get("id"));
  if (!Number.isSafeInteger(id)) redirect("/admin/kategori?error=nama");
  const client = catalogClient();
  const { data: kategori } = await client.from("kategori").select("nama").eq("id", id).maybeSingle();
  if (!kategori) redirect("/admin/kategori?error=nama");
  const { count } = await client.from("produk").select("id", { count: "exact", head: true }).eq("kategori", kategori.nama);
  if (count > 0) redirect("/admin/kategori?error=dipakai&jumlah=" + count);
  await client.from("kategori").delete().eq("id", id);
  await catatLog(user, "Hapus kategori", kategori.nama);
  segarkan();
  redirect("/admin/kategori?status=hapus");
}

function validId(raw) {
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function addVariant(form) {
  const { user } = await requireAdmin();
  const id = validId(form.get("produk_id"));
  const nama = String(form.get("nama") || "").trim();
  const harga = angka(form, "harga");
  if (!id || !nama || nama.length > 60 || !Number.isSafeInteger(harga) || harga < 0 || harga > 2000000000)
    redirect("/admin/produk/" + id + "/varian?error=invalid");
  const client = catalogClient();
  const { data: produk } = await client.from("produk").select("nama").eq("id",id).maybeSingle();
  if (!produk) redirect("/admin");
  const { count } = await client.from("produk_varian").select("id",{count:"exact",head:true}).eq("produk_id",id);
  if (count >= 20) redirect("/admin/produk/" + id + "/varian?error=limit");
  const { error } = await client.from("produk_varian").insert({ produk_id:id, nama, harga, urutan:count || 0 });
  if (error) redirect("/admin/produk/" + id + "/varian?error=save");
  await catatLog(user,"Tambah varian",produk.nama+" / "+nama);
  revalidatePath("/produk/"+id);
  revalidatePath("/admin/produk/"+id+"/varian");
  redirect("/admin/produk/"+id+"/varian?status=tambah");
}

export async function updateVariant(form) {
  const { user } = await requireAdmin();
  const id = validId(form.get("produk_id"));
  const variantId = validId(form.get("varian_id"));
  const nama = String(form.get("nama") || "").trim();
  const harga = angka(form, "harga");
  if (!id || !variantId || !nama || nama.length > 60 || !Number.isSafeInteger(harga) || harga < 0 || harga > 2000000000)
    redirect("/admin/produk/" + (id || "") + "/varian?error=invalid");
  const db = catalogClient();
  const { data: original } = await db.from("produk_varian").select("id").eq("id", variantId).eq("produk_id", id).maybeSingle();
  if (!original) redirect("/admin/produk/" + id + "/varian?error=invalid");
  const { error } = await db.from("produk_varian").update({ nama, harga }).eq("id", variantId).eq("produk_id", id);
  if (error) redirect("/admin/produk/" + id + "/varian?error=save");
  await catatLog(user, "Ubah varian", nama + " (#" + id + ")");
  revalidatePath("/produk/" + id);
  revalidatePath("/admin/produk/" + id + "/varian");
  redirect("/admin/produk/" + id + "/varian?status=ubah");
}

export async function deleteVariant(form) {
  const { user } = await requireAdmin();
  const id = validId(form.get("produk_id"));
  const varianId = validId(form.get("varian_id"));
  if (!id || !varianId) return;
  const client = catalogClient();
  const { data: variant } = await client.from("produk_varian").select("nama").eq("id",varianId).eq("produk_id",id).maybeSingle();
  if (!variant) return;
  const { error } = await client.from("produk_varian").delete().eq("id",varianId).eq("produk_id",id);
  if (error) throw new Error("Varian gagal dihapus");
  await catatLog(user,"Hapus varian",variant.nama+" (#"+id+")");
  revalidatePath("/produk/"+id);
  revalidatePath("/admin/produk/"+id+"/varian");
}
