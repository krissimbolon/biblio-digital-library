import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import RecentlyViewed from "@/components/RecentlyViewed";
import { productsPage, categories, bestSellerIds } from "@/lib/supabase/catalog";
import { toko } from "@/lib/toko";

export default async function HalamanKatalog({searchParams}) {
  const params=await searchParams;
  const q=String(params?.q||"").slice(0,80);
  const category=String(params?.kategori||"").slice(0,80);
  const sort=String(params?.urut||"urutan");
  const page=Math.max(1,Number(params?.page)||1);
  let daftarProduk=[],pages=1,error="",recentCatalog=[],daftarKategori=[],terlaris=new Set();
  try {
    const result=await productsPage({q,category,sort,page,size:12});
    daftarProduk=result.products;pages=result.pages;
    recentCatalog=(await productsPage({size:500})).products;
    [daftarKategori,terlaris]=await Promise.all([categories(),bestSellerIds()]);
  } catch {error="Katalog belum dapat dimuat. Periksa kembali beberapa saat lagi.";}
  const pilihan = daftarProduk[0];

  return (
    <>
      <section className="grid items-center gap-10 border-b border-garis py-12 sm:gap-14 sm:py-20 lg:grid-cols-[1.12fr_0.88fr]">
        <div>
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-utama">
            Biblio Digital Library
          </p>
          <h1 className="max-w-2xl font-serif text-[clamp(2.9rem,5.8vw,5rem)] leading-[1.08] tracking-[-0.045em] text-teks">
            Buku yang layak kembali dibaca.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-teks-lembut sm:text-lg">
            Temukan karya sastra yang melintasi generasi, dari cerita yang membentuk imajinasi hingga
            gagasan yang terus diperbincangkan.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#koleksi"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-utama px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-utama-gelap"
            >
              Jelajahi koleksi
            </Link>
            <Link
              href="#tentang"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-garis bg-latar px-6 py-3 text-sm font-semibold text-teks transition-colors hover:border-utama"
            >
              Tentang Biblio
            </Link>
          </div>
          <blockquote className="mt-10 max-w-md border-l-2 border-utama/40 pl-4 text-sm leading-7 text-teks-lembut">
            <p className="font-serif italic">“{toko.tagline}”</p>
            <footer className="mt-1 text-xs not-italic">— Jorge Luis Borges</footer>
          </blockquote>
        </div>
        {pilihan && (
          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-permukaan sm:-inset-6" aria-hidden="true" />
            <Link
              href={"/produk/" + pilihan.id}
              className="group grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] items-center gap-5 rounded-xl border border-garis bg-latar p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:gap-7 sm:p-7"
            >
              <img
                src={pilihan.foto_url}
                alt={"Sampul " + pilihan.nama}
                className="aspect-[3/4] w-full rounded-sm object-cover shadow-[4px_8px_16px_rgba(16,30,24,0.17)]"
              />
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-utama">Pilihan Biblio</p>
                <h2 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] leading-tight tracking-tight">
                  {pilihan.nama}
                </h2>
                {pilihan.penulis && <p className="mt-3 text-xs leading-5 text-teks-lembut">{pilihan.penulis}</p>}
                <span className="mt-6 inline-block border-b border-utama pb-1 text-xs font-semibold text-utama group-hover:border-utama-gelap">
                  Lihat buku <span aria-hidden="true">↗</span>
                </span>
              </div>
            </Link>
          </div>
        )}
      </section>

      <section id="koleksi" aria-labelledby="judul-koleksi" className="scroll-mt-24 py-14 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-utama">Koleksi terpilih</p>
            <h2 id="judul-koleksi" className="font-serif text-3xl tracking-[-0.03em] sm:text-4xl">
              Jelajahi rak Biblio
            </h2>
          </div>
          <p className="max-w-[260px] text-sm leading-6 text-teks-lembut">
            Karya klasik yang membuka jalan bagi percakapan lintas generasi.
          </p>
        </div>
        <form className="mb-8 grid gap-3 rounded-lg border border-garis bg-latar p-4 sm:grid-cols-[1fr_170px_160px_auto]">
          <input name="q" aria-label="Cari judul buku" defaultValue={q} placeholder="Cari judul buku" className="min-w-0 rounded-md border border-garis bg-latar px-3 py-2 text-sm" />
          <select name="kategori" aria-label="Kategori buku" defaultValue={category} className="min-w-0 rounded-md border border-garis bg-latar px-3 py-2 text-sm">
            <option value="">Semua kategori</option>
            {daftarKategori.map(k=><option key={k.id} value={k.nama}>{k.nama}</option>)}
          </select>
          <select name="urut" aria-label="Urutkan katalog" defaultValue={sort} className="rounded-md border border-garis bg-latar px-3 py-2 text-sm">
            <option value="urutan">Pilihan Biblio</option><option value="terbaru">Terbaru</option><option value="termurah">Termurah</option><option value="termahal">Termahal</option>
          </select>
          <button type="submit" className="rounded-md bg-utama px-5 py-2 text-sm font-semibold text-white">Cari</button>
        </form>
        {error && <p role="alert" className="rounded-md border border-garis bg-permukaan p-4 text-sm text-bahaya">{error}</p>}
        {!error && daftarProduk.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} terlaris={terlaris.has(produk.id)} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-garis bg-permukaan p-8 text-teks-lembut">
            Belum ada buku dalam koleksi.
          </p>
        )}
        {!error && <nav className="mt-9 flex items-center gap-5 text-sm" aria-label="Halaman katalog">
          {page>1 && <Link href={"/?"+new URLSearchParams({q,kategori:category,urut:sort,page:String(page-1)})+"#koleksi"} className="font-semibold text-utama underline">Sebelumnya</Link>}
          <span>Halaman {page} dari {pages}</span>
          {page<pages && <Link href={"/?"+new URLSearchParams({q,kategori:category,urut:sort,page:String(page+1)})+"#koleksi"} className="font-semibold text-utama underline">Berikutnya</Link>}
        </nav>}
      </section>

      <RecentlyViewed products={recentCatalog}/>
      <section id="tentang" className="scroll-mt-24 border-t border-garis py-12 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr] sm:gap-14">
          <h2 className="font-serif text-3xl tracking-tight">Tentang Biblio</h2>
          <div className="max-w-2xl space-y-4 text-sm leading-7 text-teks-lembut sm:text-base">
            <p>
              Biblio adalah ruang kurasi untuk menemukan bacaan yang bermakna.
              Kami mengutamakan pengalaman menjelajah buku yang tenang, jelas, dan mudah digunakan.
            </p>
            <p>
              Katalog saat ini merupakan pratinjau pengembangan. Informasi pembelian dan akses digital
              baru akan ditampilkan ketika layanannya telah tersedia.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
