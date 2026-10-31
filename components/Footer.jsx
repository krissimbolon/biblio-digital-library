import Link from "next/link";
import { getToko } from "@/lib/supabase/store";

export default async function Footer() {
  const toko=await getToko();
  return (
    <footer className="mt-auto border-t border-garis bg-permukaan">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm sm:grid-cols-[1.4fr_1fr] sm:px-6">
        <div>
          <p className="font-serif text-2xl font-bold tracking-[-0.06em] text-utama">{toko.nama}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-teks-lembut">
            Biblio Digital Library
          </p>
          <p className="mt-5 max-w-sm leading-6 text-teks-lembut">
            Ruang untuk buku, pengetahuan, dan ide-ide yang melampaui zaman.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <Link href="/#koleksi" className="hover:text-utama">Jelajahi koleksi</Link>
          <Link href="/tentang" className="hover:text-utama">Tentang Biblio</Link>
          <a href={"https://wa.me/"+toko.nomorWhatsApp+"?text="+encodeURIComponent("Halo Biblio, saya ingin bertanya tentang koleksi buku.")} target="_blank" rel="noopener noreferrer" className="hover:text-utama">Hubungi via WhatsApp</a>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t border-garis px-4 py-5 text-xs text-teks-lembut sm:px-6">
        <span>© 2026 Biblio Digital Library</span>
        <span>Dibuat dengan sepenuh hati oleh Chris Simbolon.</span>
      </div>
    </footer>
  );
}
