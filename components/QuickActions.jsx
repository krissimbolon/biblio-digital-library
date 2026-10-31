"use client";
import { useState } from "react";
import Link from "next/link";

const CART_KEY = "biblio:cart";
const COMPARE_KEY = "biblio:compare";

function readList(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export default function QuickActions({ id, habis = false }) {
  const [status, setStatus] = useState(null);
  const bookId = Number(id);
  function tambah() {
    if (habis) return;
    try {
      const items = readList(CART_KEY).filter(x => x && Number.isSafeInteger(Number(x.id)) && Number(x.qty) > 0);
      const found = items.find(x => Number(x.id) === bookId);
      if (found) found.qty = Math.min(99, (Number(found.qty) || 0) + 1);
      else items.push({ id: bookId, qty: 1 });
      localStorage.setItem(CART_KEY, JSON.stringify(items.slice(0, 100)));
      window.dispatchEvent(new Event("biblio:cart-change"));
      setStatus({ message: "Ditambahkan ke keranjang.", href: "/keranjang", label: "Lihat keranjang" });
    } catch { setStatus({ message: "Keranjang tidak dapat disimpan." }); }
  }
  function bandingkan() {
    try {
      const ids = readList(COMPARE_KEY).map(Number).filter(Number.isSafeInteger).slice(0, 2);
      if (ids.includes(bookId)) {
        setStatus({ message: "Buku sudah ada dalam perbandingan.", href: "/bandingkan", label: "Lihat perbandingan" });
        return;
      }
      if (ids.length >= 2) {
        setStatus({ message: "Maksimal dua buku. Hapus salah satu pilihan dahulu.", href: "/bandingkan", label: "Atur pilihan" });
        return;
      }
      localStorage.setItem(COMPARE_KEY, JSON.stringify([...ids, bookId]));
      setStatus({ message: "Buku dipilih untuk dibandingkan.", href: "/bandingkan", label: "Lihat perbandingan" });
    } catch { setStatus({ message: "Pilihan tidak dapat disimpan." }); }
  }
  return <div className="mt-3 flex flex-wrap items-center gap-2">
    <button type="button" onClick={tambah} disabled={habis} className="rounded-md border border-garis px-3 py-2 text-xs font-semibold hover:border-utama disabled:cursor-not-allowed disabled:opacity-50">{habis ? "Stok habis" : "+ Keranjang"}</button>
    <button type="button" onClick={bandingkan} className="rounded-md border border-garis px-3 py-2 text-xs font-semibold hover:border-utama">Bandingkan</button>
    {status && <span role="status" className="basis-full text-xs text-teks-lembut">{status.message} {status.href && <Link href={status.href} className="font-semibold text-utama underline">{status.label}</Link>}</span>}
  </div>;
}
