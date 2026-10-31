"use client";
import {useState} from "react";

export default function WhatsAppOrder({nomor,id,nama,harga,stok=99}) {
  const maks=Math.max(1,Math.min(99,stok));
  const [jumlah,setJumlah]=useState(1);
  const rupiah=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
  const total=Number(harga)*jumlah;
  const pesan="Halo Biblio, saya mau pesan "+nama+" ("+rupiah(Number(harga))+") sebanyak "+jumlah+" eksemplar, total "+rupiah(total)+".";
  const href="https://wa.me/"+nomor+"?text="+encodeURIComponent(pesan);
  function recordClick(){
    navigator.sendBeacon?.("/api/wa-click",new Blob([JSON.stringify({id})],{type:"application/json"}));
  }
  return <div className="flex flex-col gap-3">
    <label className="flex items-center gap-3 text-sm">Jumlah
      <input type="number" min="1" max={maks} value={jumlah} onChange={e=>setJumlah(Math.min(maks,Math.max(1,Number(e.target.value)||1)))} className="w-20 rounded-md border border-garis bg-latar px-3 py-2" />
    </label>
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={recordClick} className="inline-flex min-h-11 items-center justify-center rounded-md bg-utama px-6 py-3 text-sm font-semibold text-white hover:bg-utama-gelap">Pesan via WhatsApp</a>
  </div>;
}
