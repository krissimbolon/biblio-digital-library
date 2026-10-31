"use client";
import { useState } from "react";
import Link from "next/link";

const CART_KEY = "biblio:cart";
const COMPARE_KEY = "biblio:compare";

export default function QuickActions({ id, habis = false }) {
  const [status, setStatus] = useState("");
  function tambah() {
    try {
      const items = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      const found = items.find(x=>Number(x.id)===Number(id));
      if (found) found.qty = Math.min(99, Number(found.qty||0)+1);
      else items.push({ id:Number(id), qty:1 });
      localStorage.setItem(CART_KEY,JSON.stringify(items.slice(0,100)));
      window.dispatchEvent(new Event("biblio:cart-change"));
      setStatus("Ditambahkan ke keranjang");
    } catch {setStatus("Keranjang tidak dapat disimpan.");}
  }
  function bandingkan() {
    try {
      const items = JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]");
      const ids = Array.isArray(items) ? items.map(Number).filter(Number.isSafeInteger) : [];
      if (ids.includes(Number(id))) {setStatus("Buku sudah dipilih.");return;}
      if (ids.length >= 2) {setStatus("Maksimal dua buku. Hapus pilihan di halaman perbandingan.");return;}
      localStorage.setItem(COMPARE_KEY,JSON.stringify([...ids,Number(id)]));
      setStatus("Dipilih untuk dibandingkan");
    } catch {setStatus("Pilihan tidak dapat disimpan.");}
  }
  return <div className="mt-3 flex flex-wrap items-center gap-2">
    <button type="button" onClick={tambah} disabled={habis} className="rounded-md border border-garis px-3 py-2 text-xs font-semibold hover:border-utama disabled:cursor-not-allowed disabled:opacity-50">{habis?"Stok habis":"+ Keranjang"}</button>
    <button type="button" onClick={bandingkan} className="rounded-md border border-garis px-3 py-2 text-xs font-semibold hover:border-utama">Bandingkan</button>
    {status && <span role="status" className="basis-full text-xs text-teks-lembut">{status} <Link href={status.startsWith("Maksimal")?"/bandingkan":"/keranjang"} className="underline">Lihat</Link></span>}
  </div>;
}
