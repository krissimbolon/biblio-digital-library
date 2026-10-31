import Link from "next/link";
import { formatRupiah } from "@/lib/format";

export default function KartuProduk({ produk }) {
  return (
    <Link href={"/produk/" + produk.id} className="group block min-w-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-utama">
      <div className="overflow-hidden rounded-lg border border-garis bg-permukaan px-[14%] py-6 transition-colors group-hover:bg-[#ece9e2] sm:py-8">
        <img
          src={produk.foto_url}
          alt={"Sampul " + produk.nama}
          loading="lazy"
          className="aspect-[3/4] w-full rounded-[2px] object-cover shadow-[5px_8px_14px_rgba(16,30,24,0.17)] transition-transform duration-300 group-hover:-translate-y-1"
        />
      </div>
      <div className="pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teks-lembut">{produk.kategori}</p>
        <h3 className="mt-2 font-serif text-[clamp(1.13rem,2vw,1.45rem)] leading-snug tracking-[-0.02em] text-teks group-hover:text-utama">
          {produk.nama}
        </h3>
        {produk.penulis && <p className="mt-1 text-xs text-teks-lembut">{produk.penulis}</p>}
        <p className="mt-3 text-sm font-semibold text-utama">
          {Number(produk.harga) === 0 ? "Gratis" : formatRupiah(produk.harga)}
        </p>
      </div>
    </Link>
  );
}
