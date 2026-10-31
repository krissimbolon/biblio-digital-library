import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import { produkContoh } from "@/lib/data-contoh";
import { toko } from "@/lib/toko";

// Halaman pengantar koleksi. US-01 akan mengganti produkContoh dengan query server Supabase.
export default function HalamanKatalog() {
  const daftarProduk = produkContoh;
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
        {daftarProduk.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-garis bg-permukaan p-8 text-teks-lembut">
            Belum ada buku dalam koleksi.
          </p>
        )}
      </section>

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
