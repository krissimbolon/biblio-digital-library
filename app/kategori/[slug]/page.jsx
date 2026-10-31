import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import { categoryBySlug, productsPage, bestSellerIds } from "@/lib/supabase/catalog";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const kategori = await categoryBySlug(slug);
  if (!kategori) return { title: "Kategori tidak ditemukan | Biblio" };
  return { title: kategori.nama + " | Biblio", description: "Koleksi buku " + kategori.nama + " di Biblio Digital Library." };
}

export default async function HalamanKategori({ params, searchParams }) {
  const { slug } = await params;
  const kategori = await categoryBySlug(slug);
  if (!kategori) notFound();
  const query = await searchParams;
  const page = Math.max(1, Number.isFinite(Number(query?.page)) ? Math.floor(Number(query?.page) || 1) : 1);
  const [{ products, count, pages }, terlaris] = await Promise.all([
    productsPage({ category: kategori.nama, size: 12, page }),
    bestSellerIds(),
  ]);
  return (
    <section className="py-10 sm:py-16">
      <Link href="/#koleksi" className="text-xs font-semibold text-utama hover:underline">← Semua koleksi</Link>
      <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">{kategori.nama}</h1>
      <p className="mt-3 text-sm text-teks-lembut">{count} buku</p>
      {products.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
          {products.map((produk) => <KartuProduk key={produk.id} produk={produk} terlaris={terlaris.has(produk.id)} />)}
        </div>
      ) : (
        <p className="mt-10 rounded-lg border border-garis bg-permukaan p-8 text-teks-lembut">Belum ada buku pada halaman kategori ini.</p>
      )}
      {pages > 1 && <nav aria-label="Halaman kategori" className="mt-9 flex items-center gap-5 text-sm">
        {page > 1 && <Link href={"/kategori/" + slug + "?page=" + (page - 1)} className="font-semibold text-utama underline">Sebelumnya</Link>}
        <span>Halaman {page} dari {pages}</span>
        {page < pages && <Link href={"/kategori/" + slug + "?page=" + (page + 1)} className="font-semibold text-utama underline">Berikutnya</Link>}
      </nav>}
    </section>
  );
}
