import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import { productById, productsPage } from "@/lib/supabase/catalog";
import KartuProduk from "@/components/KartuProduk";
import { formatRupiah } from "@/lib/format";

// US-02 akan mengganti sumber data ini dengan pembacaan Supabase di server.
export async function generateMetadata({params}) {
  const {id}=await params;
  const produk=await productById(id);
  if (!produk) return {title:"Buku tidak ditemukan | Biblio"};
  return {title:produk.nama+" | Biblio",description:produk.deskripsi?.slice(0,160)||produk.nama,
    openGraph:{title:produk.nama,description:produk.deskripsi?.slice(0,160)||produk.nama,images:produk.foto_url?[{url:produk.foto_url}]:[]}};
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  const produk = await productById(id);
  if (!produk) notFound();
  const related=await productsPage({category:produk.kategori,size:6});
  const recommendations=related.products.filter(item=>item.id!==produk.id).slice(0,4);

  return (
    <><article className="grid gap-10 py-10 sm:py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
      <div className="rounded-lg border border-garis bg-permukaan px-[18%] py-10">
        <img src={produk.foto_url} alt={"Sampul " + produk.nama} className="mx-auto aspect-[3/4] w-full max-w-[320px] rounded-sm object-cover shadow-xl" />
      </div>
      <div className="flex flex-col items-start gap-5">
        <Link href="/#koleksi" className="text-xs font-semibold text-utama hover:underline">← Kembali ke koleksi</Link>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-utama">{produk.kategori}</p>
        <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">{produk.nama}</h1>
        {produk.penulis && <p className="text-sm text-teks-lembut">{produk.penulis}</p>}
        <p className="text-lg font-bold text-utama">{Number(produk.harga) === 0 ? "Gratis" : formatRupiah(produk.harga)}</p>
        <p className="max-w-prose text-base leading-8 text-teks-lembut">{produk.deskripsi}</p>
        <TombolWhatsApp produk={produk} />
      </div>
    </article>
    {recommendations.length>0 && <section className="border-t border-garis py-12"><h2 className="mb-8 font-serif text-2xl">Buku terkait</h2><div className="grid grid-cols-2 gap-5 md:grid-cols-4">{recommendations.map(book=><KartuProduk key={book.id} produk={book}/>)}</div></section>}</>
  );
}
