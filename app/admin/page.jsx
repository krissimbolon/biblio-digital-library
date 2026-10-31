import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { requireAdmin } from "@/lib/supabase/server";
import { productsPage } from "@/lib/supabase/catalog";

export default async function HalamanAdmin({searchParams}) {
  await requireAdmin();
  const params=await searchParams;
  const page=Math.max(1,Number(params?.page)||1);
  const q=String(params?.q||"").slice(0,80);
  const {products,pages,count}=await productsPage({page,size:20,q});
  return <section className="flex flex-col gap-7 py-10">
    <NavAdmin/>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="font-serif text-3xl">Kelola koleksi</h1><p className="mt-2 text-sm text-teks-lembut">{count} buku</p></div>
      <Tombol href="/admin/produk/baru">Tambah buku</Tombol>
    </div>
    <form className="flex max-w-md gap-2">
      <input name="q" aria-label="Cari buku" defaultValue={q} placeholder="Cari judul" className="min-w-0 flex-1 rounded-md border border-garis bg-latar px-3 py-2 text-sm"/>
      <Tombol type="submit">Cari</Tombol>
    </form>
    <TabelProduk daftarProduk={products}/>
    <nav aria-label="Halaman admin" className="flex gap-5 text-sm">
      {page>1&&<a className="text-utama underline" href={"/admin?page="+(page-1)+"&q="+encodeURIComponent(q)}>Sebelumnya</a>}
      <span>Halaman {page} dari {pages}</span>
      {page<pages&&<a className="text-utama underline" href={"/admin?page="+(page+1)+"&q="+encodeURIComponent(q)}>Berikutnya</a>}
    </nav>
  </section>;
}
