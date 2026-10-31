import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import { addVariant, deleteVariant } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/supabase/server";
import { catalogClient, productById } from "@/lib/supabase/catalog";
import Link from "next/link";

export default async function HalamanVarian({ params, searchParams }) {
  await requireAdmin();
  const { id } = await params;
  const book = await productById(id, { includeInactive: true });
  if (!book) notFound();
  const { data: variants, error } = await catalogClient().from("produk_varian").select("id,nama,harga").eq("produk_id",book.id).order("urutan").order("id");
  if (error) throw new Error("Varian gagal dimuat");
  const query = await searchParams;
  return <section className="flex flex-col gap-6 py-10">
    <NavAdmin />
    <Link href={"/admin/produk/"+id+"/ubah"} className="text-sm text-utama underline">← Kembali ke buku</Link>
    <div><h1 className="font-serif text-3xl">Varian {book.nama}</h1><p className="mt-2 text-sm text-teks-lembut">Harga dasar buku tetap tersedia sebagai pilihan standar.</p></div>
    {query?.error && <p role="alert" className="text-sm text-bahaya">{query.error==="limit"?"Maksimal 20 varian per buku.":query.error==="invalid"?"Isi nama dan harga yang valid.":"Varian gagal disimpan."}</p>}
    {query?.status && <p role="status" className="text-sm text-utama">Varian disimpan.</p>}
    <div className="space-y-3">
      {variants?.length ? variants.map(v=><div key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-garis p-4">
        <span>{v.nama} — Rp {Number(v.harga).toLocaleString("id-ID")}</span>
        <form action={deleteVariant}><input type="hidden" name="produk_id" value={book.id}/><input type="hidden" name="varian_id" value={v.id}/><button className="text-sm font-semibold text-bahaya" type="submit">Hapus</button></form>
      </div>) : <p className="text-sm text-teks-lembut">Belum ada varian tambahan.</p>}
    </div>
    <form action={addVariant} className="flex max-w-lg flex-col gap-4 rounded-lg border border-garis p-5">
      <input type="hidden" name="produk_id" value={book.id}/>
      <label className="text-sm font-semibold">Nama varian<input name="nama" required maxLength={60} className="mt-2 w-full rounded-md border border-garis bg-latar p-3" placeholder="Contoh: Hardcover" /></label>
      <label className="text-sm font-semibold">Harga (Rp)<input name="harga" required min="0" max="2000000000" type="number" step="1" className="mt-2 w-full rounded-md border border-garis bg-latar p-3" /></label>
      <button type="submit" className="rounded-md bg-utama px-5 py-3 text-sm font-semibold text-white">Tambah varian</button>
    </form>
  </section>;
}
