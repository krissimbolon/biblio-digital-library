import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-garis bg-latar/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Biblio — beranda" className="flex items-baseline gap-2">
          <span className="font-serif text-[27px] font-bold tracking-[-0.06em] text-utama">BIBLIO</span>
          <span className="hidden border-l border-garis pl-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-teks-lembut sm:inline">
            Digital Library
          </span>
        </Link>
        <nav aria-label="Navigasi utama" className="flex items-center gap-5 text-sm font-medium sm:gap-8">
          <Link href="/#koleksi" className="text-teks transition-colors hover:text-utama">Koleksi</Link>
          <Link href="/#tentang" className="text-teks-lembut transition-colors hover:text-utama">Tentang</Link>
        </nav>
      </div>
    </header>
  );
}
