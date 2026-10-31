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

export async function reviewSummary(productId) {
  let count = 0;
  let total = 0;
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await catalogClient().from("ulasan")
      .select("rating").eq("produk_id", productId).eq("tampil", true)
      .order("id").range(offset, offset + pageSize - 1);
    if (error) throw new Error("Ringkasan ulasan belum tersedia.");
    count += (data || []).length;
    total += (data || []).reduce((sum, item) => sum + Number(item.rating), 0);
    if (!data || data.length < pageSize) break;
  }
  return { count, average: count ? (total / count).toFixed(1) : null };
}

export async function allProducts({includeInactive=false}={}) {
  const first=await productsPage({page:1,size:1000,includeInactive});
  const items=[...first.products];
  for(let page=2;page<=first.pages;page++){
    const result=await productsPage({page,size:1000,includeInactive});
    items.push(...result.products);
  }
  return items;
}

export async function bestSellerIds(limit = 3) {
  try {
    const { data, error } = await catalogClient().from("biblio_click_totals")
      .select("produk_id,total").order("total",{ascending:false}).limit(limit);
    if (error) return new Set();
    return new Set((data || []).map(item => Number(item.produk_id)));
  } catch {
    return new Set();
  }
}
