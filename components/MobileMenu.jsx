"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";

const links = [
  { href: "/#koleksi", label: "Koleksi" },
  { href: "/keranjang", label: "Keranjang" },
  { href: "/bandingkan", label: "Bandingkan" },
  { href: "/favorit", label: "Favorit" },
  { href: "/#tentang", label: "Tentang" },
  { href: "/admin/login", label: "Masuk admin" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  useEffect(() => {
    if (!open) return;
    function closeOnEscape(e) { if (e.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  return <div className="relative">
    <button type="button" aria-expanded={open} aria-controls={menuId} aria-label={open ? "Tutup navigasi" : "Buka navigasi"} onClick={() => setOpen(x => !x)}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-garis text-teks hover:border-utama">
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        {open ? <path d="M5 5l14 14M19 5L5 19"/> : <path d="M4 7h16M4 12h16M4 17h16"/>}
      </svg>
    </button>
    {open && <nav id={menuId} aria-label="Navigasi seluler" className="absolute right-0 top-[calc(100%+12px)] z-50 flex w-[min(19rem,calc(100vw-2rem))] flex-col gap-1 rounded-xl border border-garis bg-latar p-2 shadow-xl">
      {links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
        className="rounded-lg px-4 py-3 text-sm font-semibold text-teks hover:bg-permukaan focus-visible:outline-2 focus-visible:outline-utama">{link.label}</Link>)}
    </nav>}
  </div>;
}
