import "server-only";
import { createClient } from "@supabase/supabase-js";

export function catalogClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Konfigurasi database belum lengkap.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

const SORTS = {
  urutan: ["urutan", true],
  terbaru: ["created_at", false],
  termurah: ["harga", true],
  termahal: ["harga", false],
};

export async function productsPage({ q = "", category = "", sort = "urutan", page = 1, size = 12, includeInactive = false } = {}) {
  let query = catalogClient().from("produk").select("*", { count: "exact" });
  if (!includeInactive) query = query.eq("aktif", true);
  const term = String(q).trim().slice(0, 80).replace(/[%_,]/g, "");
  if (term) query = query.ilike("nama", "%" + term + "%");
  if (category) query = query.eq("kategori", String(category).slice(0, 80));
  const [field, ascending] = SORTS[sort] || SORTS.urutan;
  query = query.order(field, { ascending }).order("id", { ascending: true });
  const offset = (Math.max(1, Number(page) || 1) - 1) * size;
  const { data, error, count } = await query.range(offset, offset + size - 1);
  if (error) throw new Error("Gagal mengambil daftar buku.");
  return { products: data || [], count: count || 0, pages: Math.max(1, Math.ceil((count || 0) / size)) };
}

export async function productById(id, { includeInactive = false } = {}) {
  if (!/^\d+$/.test(String(id))) return null;
  const { data, error } = await catalogClient().from("produk").select("*").eq("id", Number(id)).maybeSingle();
  if (error) throw new Error("Gagal mengambil detail buku.");
  if (data && !includeInactive && !data.aktif) return null;
  return data;
}

export async function categories() {
  const { data, error } = await catalogClient().from("kategori").select("id,nama,slug").order("nama");
  if (error) throw new Error("Gagal mengambil kategori.");
  return data || [];
}

export async function categoryBySlug(slug) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(slug))) return null;
  const { data, error } = await catalogClient().from("kategori").select("id,nama,slug").eq("slug", slug).maybeSingle();
  if (error) throw new Error("Gagal mengambil kategori.");
  return data;
}

export async function bestSellerIds(limit = 3) {
  try {
    const { data, error } = await catalogClient().from("wa_clicks").select("produk_id").limit(10000);
    if (error || !data?.length) return new Set();
    const counts = data.reduce((acc, row) => { acc[row.produk_id] = (acc[row.produk_id] || 0) + 1; return acc; }, {});
    return new Set(Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([id]) => Number(id)));
  } catch {
    return new Set();
  }
}
