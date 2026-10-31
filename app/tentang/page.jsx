import Link from "next/link";
import { getToko } from "@/lib/supabase/store";
export const metadata={title:"Tentang Biblio"};
export default async function Tentang(){
  const toko=await getToko();
  return <section className="grid gap-12 py-16 md:grid-cols-[1fr_1.4fr]">
    <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-utama">Tentang perpustakaan</p><h1 className="mt-4 font-serif text-5xl">{toko.nama}</h1><p className="mt-3 text-sm text-teks-lembut">Biblio Digital Library</p></div>
    <div className="space-y-6 text-base leading-8 text-teks-lembut">
      <p>Biblio menghadirkan ruang eksplorasi buku dan sastra lintas generasi. Koleksi dan antarmuka dikurasi agar pembaca mudah menemukan bacaan yang sesuai.</p>
      <p>Lokasi layanan: {toko.alamat}.</p>
      {toko.jamBuka && <p>Informasi layanan: {toko.jamBuka}.</p>}
      <p>Fitur pemesanan fisik dan akses digital bergantung pada ketersediaan judul serta izin distribusi. Informasi terbaru ditampilkan pada katalog.</p>
      <a href={"https://wa.me/"+toko.nomorWhatsApp} target="_blank" rel="noopener noreferrer" className="inline-block rounded-md border border-garis px-6 py-3 text-sm font-semibold">Hubungi via WhatsApp</a>
      <Link className="inline-block rounded-md bg-utama px-6 py-3 text-sm font-semibold text-white" href="/#koleksi">Jelajahi koleksi</Link>
    </div>
  </section>;
}
