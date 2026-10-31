"use client";
import { useState } from "react";
import { formatRupiah } from "@/lib/format";

export default function WhatsAppOrder({ nomor, id, nama, harga, stok = 99, variants = [] }) {
  const maks = Math.max(1, Math.min(99, stok));
  const [jumlah, setJumlah] = useState(1);
  const [pilihan, setPilihan] = useState("dasar");
  const varian = variants.find(v => String(v.id) === pilihan);
  const hargaSatuan = varian ? Number(varian.harga) : Number(harga);
  const total = hargaSatuan * jumlah;
  const rincian = varian ? " - " + varian.nama : "";
  const pesan = "Halo Biblio, saya mau pesan " + nama + rincian + " (" + formatRupiah(hargaSatuan) + ") sebanyak " + jumlah + " eksemplar, total " + formatRupiah(total) + ".";
  const href = "https://wa.me/" + nomor + "?text=" + encodeURIComponent(pesan);
  function recordClick() {
    navigator.sendBeacon?.("/api/wa-click", new Blob([JSON.stringify({ id })], { type: "application/json" }));
  }
  return <div className="flex w-full max-w-sm flex-col gap-3">
    {variants.length > 0 && <label className="flex flex-col gap-1.5 text-sm font-semibold">
      Pilihan edisi atau ukuran
      <select value={pilihan} onChange={e=>setPilihan(e.target.value)} className="rounded-md border border-garis bg-latar px-3 py-2.5 text-teks">
        <option value="dasar">Edisi standar — {formatRupiah(Number(harga))}</option>
        {variants.map(v=><option value={v.id} key={v.id}>{v.nama} — {formatRupiah(Number(v.harga))}</option>)}
      </select>
    </label>}
    <label className="flex items-center gap-3 text-sm">Jumlah
      <input type="number" min="1" max={maks} value={jumlah} onChange={e=>setJumlah(Math.min(maks,Math.max(1,Number(e.target.value)||1)))} className="w-20 rounded-md border border-garis bg-latar px-3 py-2" />
    </label>
    <p className="text-sm font-semibold text-utama">Total: {formatRupiah(total)}</p>
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={recordClick} className="inline-flex min-h-11 items-center justify-center rounded-md bg-utama px-6 py-3 text-sm font-semibold text-white hover:bg-utama-gelap">Pesan via WhatsApp</a>
  </div>;
}
