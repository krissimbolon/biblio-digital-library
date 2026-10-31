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

export default async function HalamanKategori({ params }) {
  const { slug } = await params;
  const kategori = await categoryBySlug(slug);
  if (!kategori) notFound();
  const [{ products }, terlaris] = await Promise.all([productsPage({ category: kategori.nama, size: 60 }), bestSellerIds()]);
  return (
    <section className="py-10 sm:py-16">
      <Link href="/#koleksi" className="text-xs font-semibold text-utama hover:underline">← Semua koleksi</Link>
      <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">{kategori.nama}</h1>
      <p className="mt-3 text-sm text-teks-lembut">{products.length} buku</p>
      {products.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
          {products.map((produk) => <KartuProduk key={produk.id} produk={produk} terlaris={terlaris.has(produk.id)} />)}
        </div>
      ) : (
        <p className="mt-10 rounded-lg border border-garis bg-permukaan p-8 text-teks-lembut">Belum ada buku dalam kategori ini.</p>
      )}
    </section>
  );
}
