import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import { cariProdukContoh } from "@/lib/data-contoh";
import { formatRupiah } from "@/lib/format";

// US-02 akan mengganti sumber data ini dengan pembacaan Supabase di server.
export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  const produk = cariProdukContoh(id);
  if (!produk) notFound();

  return (
    <article className="grid gap-10 py-10 sm:py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
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
  );
}
