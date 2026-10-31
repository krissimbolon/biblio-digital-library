import { catalogClient } from "@/lib/supabase/catalog";

const BASE = "https://biblio-digital-library.vercel.app";

export default async function sitemap() {
  const halaman = [{ url: BASE, lastModified: new Date() }, { url: BASE + "/tentang", lastModified: new Date() }];
  try {
    const client = catalogClient();
    const [{ data: produk, error: e1 }, { data: kategori, error: e2 }] = await Promise.all([
      client.from("produk").select("id,created_at").eq("aktif", true).order("id").limit(5000),
      client.from("kategori").select("slug,created_at").order("slug"),
    ]);
    if (e1 || e2) throw new Error("query");
    return [
      ...halaman,
      ...(kategori || []).map((k) => ({ url: BASE + "/kategori/" + k.slug, lastModified: new Date(k.created_at || Date.now()) })),
      ...(produk || []).map((p) => ({ url: BASE + "/produk/" + p.id, lastModified: new Date(p.created_at || Date.now()) })),
    ];
  } catch {
    return halaman;
  }
}
