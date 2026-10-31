import Link from "next/link";
import { formatRupiah, hargaAkhir, adaDiskon, bukuBaru } from "@/lib/format";
import QuickActions from "@/components/QuickActions";

function Badge({ children, nada = "utama" }) {
  const warna = nada === "habis" ? "bg-teks text-latar" : nada === "terlaris" ? "bg-[#b4532a] text-white" : "bg-utama text-white";
  return <span className={"rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide " + warna}>{children}</span>;
}

export default function KartuProduk({ produk, terlaris = false }) {
  const habis = Number(produk.stok) === 0;
  const harga = hargaAkhir(produk);
  return (
    <div className="min-w-0"><Link href={"/produk/" + produk.id} className="group block min-w-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-utama">
      <div className="relative overflow-hidden rounded-lg border border-garis bg-permukaan px-[14%] py-6 transition-colors sm:py-8">
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {habis && <Badge nada="habis">Habis</Badge>}
          {!habis && terlaris && <Badge nada="terlaris">Terlaris</Badge>}
          {!habis && bukuBaru(produk) && <Badge>Baru</Badge>}
        </div>
        <img
          src={produk.foto_url}
          alt={"Sampul " + produk.nama}
          loading="lazy"
          className={"aspect-[3/4] w-full rounded-[2px] object-cover shadow-[5px_8px_14px_rgba(16,30,24,0.17)] transition-transform duration-300 group-hover:-translate-y-1" + (habis ? " opacity-60 grayscale" : "")}
        />
      </div>
      <div className="pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teks-lembut">{produk.kategori}</p>
        <h3 className="mt-2 font-serif text-[clamp(1.13rem,2vw,1.45rem)] leading-snug tracking-[-0.02em] text-teks group-hover:text-utama">
          {produk.nama}
        </h3>
        <p className="mt-3 flex flex-wrap items-baseline gap-2 text-sm">
          <span className="font-semibold text-utama">{harga === 0 ? "Gratis" : formatRupiah(harga)}</span>
          {adaDiskon(produk) && <s className="text-xs text-teks-lembut">{formatRupiah(produk.harga)}</s>}
        </p>
      </div>
    </Link>
    <QuickActions id={produk.id} habis={habis} />
    </div>
  );
}
