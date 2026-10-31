import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import { productById, productsPage, categories, bestSellerIds, reviewSummary } from "@/lib/supabase/catalog";
import KartuProduk from "@/components/KartuProduk";
import LibraryActions from "@/components/LibraryActions";
import { formatRupiah, hargaAkhir, adaDiskon, slugify } from "@/lib/format";
import { catalogClient } from "@/lib/supabase/catalog";
import GaleriProduk from "@/components/GaleriProduk";
import QuickActions from "@/components/QuickActions";
import { kirimUlasan } from "@/app/produk/[id]/actions";
import { getToko } from "@/lib/supabase/store";
import TanyaBuku from "@/components/TanyaBuku";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const produk = await productById(id);
  if (!produk) return { title: "Buku tidak ditemukan | Biblio" };
  const deskripsi = produk.deskripsi?.slice(0, 160) || produk.nama;
  return {
    title: produk.nama + " | Biblio",
    description: deskripsi,
    openGraph: { title: produk.nama, description: deskripsi, images: produk.foto_url ? [{ url: new URL(produk.foto_url, "https://biblio-digital-library.vercel.app").toString(), alt: "Sampul " + produk.nama }] : [] },
  };
}

export default async function HalamanDetailProduk({ params, searchParams }) {
  const { id } = await params;
  const produk = await productById(id);
  if (!produk) notFound();
  const [related, daftarKategori, terlaris, hasilVarian, hasilUlasan, toko, ringkasan] = await Promise.all([
    productsPage({ category: produk.kategori, size: 6 }),
    categories(),
    bestSellerIds(),
    catalogClient().from("produk_varian").select("id,nama,harga").eq("produk_id", produk.id).order("urutan").order("id"),
    catalogClient().from("ulasan").select("id,nama,rating,komentar,created_at").eq("produk_id", produk.id).eq("tampil", true).order("created_at", { ascending: false }).limit(100),
    getToko(),
    reviewSummary(produk.id),
  ]);
  const recommendations = related.products.filter((item) => item.id !== produk.id).slice(0, 4);
  const kategori = daftarKategori.find((k) => k.nama === produk.kategori);
  const stok = Number(produk.stok);
  const harga = hargaAkhir(produk);
  const ulasan = hasilUlasan.data || [];
  const rataRating = ringkasan.average;
  const status = (await searchParams)?.ulasan;

  return (
    <>
      <article className="grid gap-10 py-10 sm:py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div className="rounded-lg border border-garis bg-permukaan px-[18%] py-10">
          <GaleriProduk nama={produk.nama} sampul={produk.foto_url} galeri={produk.galeri || []} habis={stok === 0} />
        </div>
        <div className="flex flex-col items-start gap-5">
          <Link href="/#koleksi" className="text-xs font-semibold text-utama hover:underline">← Kembali ke koleksi</Link>
          {produk.kategori && (
            <Link href={"/kategori/" + (kategori?.slug || slugify(produk.kategori))} className="text-xs font-bold uppercase tracking-[0.16em] text-utama hover:underline">
              {produk.kategori}
            </Link>
          )}
          <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">{produk.nama}</h1>
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-lg font-bold text-utama">{harga === 0 ? "Gratis" : formatRupiah(harga)}</p>
            {adaDiskon(produk) && <s className="text-sm text-teks-lembut">{formatRupiah(produk.harga)}</s>}
            {stok === 0
              ? <span className="rounded-full bg-teks px-3 py-1 text-xs font-bold text-latar">Habis</span>
              : <span className="text-sm text-teks-lembut">Stok {stok}</span>}
            {stok > 0 && terlaris.has(produk.id) && <span className="rounded-full bg-[#b4532a] px-3 py-1 text-xs font-bold text-white">Terlaris</span>}
          </div>
          <p className="max-w-prose text-base leading-8 text-teks-lembut">{produk.deskripsi}</p>
          <TombolWhatsApp produk={produk} variants={hasilVarian.data || []} nomorToko={toko.nomorWhatsApp} />
          <LibraryActions id={produk.id} />
          <QuickActions id={produk.id} habis={stok === 0} />
        </div>
      </article>
      <section className="border-t border-garis py-10"><TanyaBuku id={produk.id}/></section>
      <section className="border-t border-garis py-12" aria-labelledby="judul-ulasan">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 id="judul-ulasan" className="font-serif text-2xl">Ulasan pembaca</h2>
            <p className="mt-3 text-sm text-teks-lembut">{rataRating ? rataRating + " / 5 dari " + ringkasan.count + " ulasan" : "Belum ada ulasan untuk buku ini."}</p>
            <div className="mt-6 max-h-[480px] space-y-4 overflow-y-auto">
              {ulasan.map(u => <article key={u.id} className="rounded-lg border border-garis p-4">
                <div className="flex flex-wrap justify-between gap-2"><strong>{u.nama}</strong><span className="text-sm text-utama" aria-label={u.rating+" dari 5 bintang"}>{"★".repeat(u.rating)}{"☆".repeat(5-u.rating)}</span></div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-teks-lembut">{u.komentar}</p>
              </article>)}
            </div>
          </div>
          <form action={kirimUlasan} className="flex flex-col gap-4 rounded-lg border border-garis p-5">
            <h3 className="font-serif text-xl">Tulis ulasan</h3>
            {status === "terkirim" && <p role="status" className="text-sm text-utama">Terima kasih, ulasan berhasil dikirim.</p>}
            {status === "batas" && <p role="alert" className="text-sm text-bahaya">Terlalu banyak kiriman. Coba lagi nanti.</p>}
            {status === "invalid" && <p role="alert" className="text-sm text-bahaya">Periksa nama, rating, dan komentar sebelum mengirim.</p>}
            {status === "gagal" && <p role="alert" className="text-sm text-bahaya">Ulasan belum berhasil disimpan.</p>}
            <input type="hidden" name="produk_id" value={produk.id} />
            <input type="text" name="situs" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <label className="text-sm font-semibold">Nama
              <input name="nama" required maxLength={60} className="mt-2 w-full rounded-md border border-garis bg-latar p-3" />
            </label>
            <label className="text-sm font-semibold">Rating
              <select name="rating" required defaultValue="5" className="mt-2 w-full rounded-md border border-garis bg-latar p-3">
                {[5,4,3,2,1].map(n=><option key={n} value={n}>{n} bintang</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold">Komentar
              <textarea name="komentar" required minLength={3} maxLength={1000} rows={4} className="mt-2 w-full rounded-md border border-garis bg-latar p-3" />
            </label>
            <button type="submit" className="rounded-md bg-utama px-5 py-3 text-sm font-semibold text-white">Kirim ulasan</button>
          </form>
        </div>
      </section>
      {recommendations.length > 0 && (
        <section className="border-t border-garis py-12">
          <h2 className="mb-8 font-serif text-2xl">Buku terkait</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {recommendations.map((book) => <KartuProduk key={book.id} produk={book} terlaris={terlaris.has(book.id)} />)}
          </div>
        </section>
      )}
    </>
  );
}
