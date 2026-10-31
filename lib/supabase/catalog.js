import "server-only";
import { createClient } from "@supabase/supabase-js";

export function catalogClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Konfigurasi database belum lengkap.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function productsPage({ q = "", category = "", sort = "terbaru", page = 1, size = 12 } = {}) {
  let query = catalogClient().from("produk").select("*", { count: "exact" });
  const term = String(q).trim().slice(0, 80).replace(/[%_,]/g, "");
  if (term) query = query.ilike("nama", "%" + term + "%");
  if (category) query = query.eq("kategori", String(category).slice(0, 80));
  const sortMap = { termurah: ["harga", true], termahal: ["harga", false], terbaru: ["created_at", false] };
  const [field, ascending] = sortMap[sort] || sortMap.terbaru;
  query = query.order(field, { ascending }).order("id", { ascending: true });
  const offset = (Math.max(1, Number(page) || 1) - 1) * size;
  const { data, error, count } = await query.range(offset, offset + size - 1);
  if (error) throw new Error("Gagal mengambil daftar buku.");
  return { products: data || [], count: count || 0, pages: Math.max(1, Math.ceil((count || 0) / size)) };
}

export async function productById(id) {
  if (!/^\d+$/.test(String(id))) return null;
  const { data, error } = await catalogClient().from("produk").select("*").eq("id", Number(id)).maybeSingle();
  if (error) throw new Error("Gagal mengambil detail buku.");
  return data;
}
