import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { requireAdmin } from "@/lib/supabase/server";
import { productsPage, allProducts, catalogClient } from "@/lib/supabase/catalog";

export default async function HalamanAdmin({searchParams}) {
  await requireAdmin();
  const params=await searchParams;
  const page=Math.max(1,Number(params?.page)||1);
  const q=String(params?.q||"").slice(0,80);
  const {products,pages,count}=await productsPage({page,size:20,q,includeInactive:true});
  const statsProducts=await allProducts({includeInactive:true});
  const stats={products:statsProducts,count:statsProducts.length};
  const aktif=stats.products.filter(b=>b.aktif).length;
  const habis=stats.products.filter(b=>Number(b.stok)===0).length;
  const kategori=stats.products.reduce((acc,b)=>{const key=b.kategori||"Lainnya";acc[key]=(acc[key]||0)+1;return acc},{});
  let ranking=[];
  try {
    const {data:clicks,error}=await catalogClient().from("biblio_click_totals")
      .select("produk_id,total").order("total",{ascending:false}).limit(5);
    if(!error && clicks?.length) {
      ranking=clicks.map(x=>({book:stats.products.find(p=>p.id===Number(x.produk_id)),total:Number(x.total)}))
        .filter(x=>x.book);
    }
  } catch {}

  return <section className="flex flex-col gap-7 py-10">
    <NavAdmin/>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="font-serif text-3xl">Kelola koleksi</h1><p className="mt-2 text-sm text-teks-lembut">{stats.count} buku, {aktif} tampil di katalog, {habis} stok habis</p></div>
      <Tombol href="/admin/produk/baru">Tambah buku</Tombol>
    </div>
    <section className="grid gap-3 sm:grid-cols-3" aria-label="Ringkasan kategori">
      {Object.entries(kategori).map(([nama,jumlah])=><div key={nama} className="rounded-lg border border-garis bg-permukaan p-4">
        <p className="text-xs font-semibold text-teks-lembut">{nama}</p>
        <p className="mt-2 font-serif text-2xl">{jumlah}</p>
      </div>)}
    </section>
    <section aria-label="Buku paling sering dipesan" className="rounded-lg border border-garis p-5">
      <h2 className="font-serif text-xl">Minat pemesanan</h2>
      {ranking.length ? <ol className="mt-4 space-y-2 text-sm">{ranking.map(x=><li key={x.book.id} className="flex justify-between gap-4"><span>{x.book.nama}</span><span className="font-semibold">{x.total} klik</span></li>)}</ol>
        : <p className="mt-3 text-sm text-teks-lembut">Belum ada data klik pesanan.</p>}
    </section>
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
