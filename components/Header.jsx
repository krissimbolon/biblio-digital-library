import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";
import { getToko } from "@/lib/supabase/store";

export default async function Header() {
  const toko = await getToko();
  return (
    <header className="sticky top-0 z-30 border-b border-garis bg-latar/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Biblio — beranda" className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-utama">
          <span className="font-serif text-[30px] font-bold tracking-[-0.065em] text-utama">{toko.nama}</span>
        </Link>
        <nav aria-label="Navigasi utama" className="hidden items-center gap-4 text-sm font-medium lg:flex xl:gap-6">
          <Link href="/#koleksi" className="text-teks transition-colors hover:text-utama">Koleksi</Link>
          <Link href="/keranjang" className="text-teks-lembut transition-colors hover:text-utama">Keranjang</Link>
          <Link href="/bandingkan" className="text-teks-lembut transition-colors hover:text-utama">Bandingkan</Link>
          <Link href="/favorit" className="text-teks-lembut transition-colors hover:text-utama">Favorit</Link>
          <Link href="/#tentang" className="text-teks-lembut transition-colors hover:text-utama">Tentang</Link>
          <ThemeToggle/>
          <Link href="/admin/login" className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border border-garis px-3 text-teks-lembut transition-colors hover:border-utama hover:text-utama">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>
            <span>Masuk admin</span>
          </Link>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle/>
          <MobileMenu/>
        </div>
      </div>
    </header>
  );
}
