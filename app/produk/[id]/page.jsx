import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import { productById, productsPage, categories, bestSellerIds } from "@/lib/supabase/catalog";
import KartuProduk from "@/components/KartuProduk";
import LibraryActions from "@/components/LibraryActions";
import { formatRupiah, hargaAkhir, adaDiskon, slugify } from "@/lib/format";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const produk = await productById(id);
  if (!produk) return { title: "Buku tidak ditemukan | Biblio" };
  const deskripsi = produk.deskripsi?.slice(0, 160) || produk.nama;
  return {
    title: produk.nama + " | Biblio",
    description: deskripsi,
    openGraph: { title: produk.nama, description: deskripsi, images: produk.foto_url ? [{ url: produk.foto_url }] : [] },
  };
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  const produk = await productById(id);
  if (!produk) notFound();
  const [related, daftarKategori, terlaris] = await Promise.all([
    productsPage({ category: produk.kategori, size: 6 }),
    categories(),
    bestSellerIds(),
  ]);
  const recommendations = related.products.filter((item) => item.id !== produk.id).slice(0, 4);
  const kategori = daftarKategori.find((k) => k.nama === produk.kategori);
  const stok = Number(produk.stok);
  const harga = hargaAkhir(produk);

  return (
    <>
      <article className="grid gap-10 py-10 sm:py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div className="rounded-lg border border-garis bg-permukaan px-[18%] py-10">
          <img src={produk.foto_url} alt={"Sampul " + produk.nama} className={"mx-auto aspect-[3/4] w-full max-w-[320px] rounded-sm object-cover shadow-xl" + (stok === 0 ? " opacity-60 grayscale" : "")} />
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
          <TombolWhatsApp produk={produk} />
          <LibraryActions id={produk.id} />
        </div>
      </article>
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
