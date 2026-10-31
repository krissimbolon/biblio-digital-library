"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { hargaAkhir, formatRupiah } from "@/lib/format";

const KEY="biblio:cart";
export default function CartView({ produk, nomor }) {
  const [cart,setCart]=useState(null);
  useEffect(()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||"[]");setCart(Array.isArray(x)?x.filter(v=>v&&Number.isSafeInteger(Number(v.id))&&Number(v.qty)>0):[]);}catch{setCart([])}},[]);
  function save(next){setCart(next);try{localStorage.setItem(KEY,JSON.stringify(next));window.dispatchEvent(new Event("biblio:cart-change"));}catch{}}
  if(cart===null)return <p className="text-teks-lembut">Memuat keranjang…</p>;
  const items=cart.map(x=>({book:produk.find(p=>Number(p.id)===Number(x.id)),qty:Math.max(1,Math.min(99,Number(x.qty)||1))})).filter(x=>x.book&&Number(x.book.stok)>0);
  const missing=cart.length-items.length;
  const total=items.reduce((s,x)=>s+hargaAkhir(x.book)*Math.min(x.qty,x.book.stok),0);
  function catatPesanan() {
    for (const {book} of items) {
      navigator.sendBeacon?.("/api/wa-click",new Blob([JSON.stringify({id:book.id})],{type:"application/json"}));
    }
  }
  const pesan="Halo Biblio, saya ingin memesan:\n"+items.map((x,i)=>(i+1)+". "+x.book.nama+" — "+Math.min(x.qty,x.book.stok)+" × "+formatRupiah(hargaAkhir(x.book))+" = "+formatRupiah(Math.min(x.qty,x.book.stok)*hargaAkhir(x.book))).join("\n")+"\nTotal: "+formatRupiah(total)+".";
  return <div className="space-y-6">
    {missing>0&&<div role="status" className="flex flex-wrap items-center gap-3 text-sm text-bahaya">
      <p>{missing} buku tidak tersedia atau stoknya habis. Buku tersebut tidak dimasukkan ke pesanan.</p>
      <button type="button" onClick={()=>save(cart.filter(x=>produk.some(p=>Number(p.id)===Number(x.id)&&Number(p.stok)>0)))} className="font-semibold underline">Bersihkan item tidak tersedia</button>
    </div>}
    {!items.length&&<p className="rounded-lg border border-garis bg-permukaan p-6 text-teks-lembut">Keranjang belum berisi buku yang tersedia. <Link href="/#koleksi" className="underline">Jelajahi koleksi</Link>.</p>}
    {items.map(({book,qty})=><div key={book.id} className="flex flex-wrap items-center gap-5 rounded-lg border border-garis p-4">
      <img src={book.foto_url} alt="" className="h-24 w-16 rounded-sm bg-permukaan object-cover"/>
      <div className="min-w-0 flex-1"><Link href={"/produk/"+book.id} className="font-serif text-xl hover:text-utama">{book.nama}</Link><p className="mt-2 text-sm text-teks-lembut">{formatRupiah(hargaAkhir(book))} per eksemplar</p></div>
      <label className="text-xs font-semibold">Jumlah <input type="number" min="1" max={Math.min(99,book.stok)} value={Math.min(qty,book.stok)} onChange={e=>save(cart.map(x=>Number(x.id)===Number(book.id)?{...x,qty:Math.max(1,Math.min(Number(book.stok),99,Number(e.target.value)||1))}:x))} className="ml-2 w-16 rounded-md border border-garis bg-latar p-2"/></label>
      <button onClick={()=>save(cart.filter(x=>Number(x.id)!==Number(book.id)))} className="text-sm font-semibold text-bahaya">Hapus</button>
    </div>)}
    {items.length>0&&<div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-permukaan p-5">
      <div><p className="text-sm text-teks-lembut">Total pemesanan</p><strong className="font-serif text-2xl">{formatRupiah(total)}</strong></div>
      <a href={"https://wa.me/"+nomor+"?text="+encodeURIComponent(pesan)} target="_blank" rel="noopener noreferrer" onClick={catatPesanan} className="rounded-md bg-utama px-5 py-3 text-sm font-semibold text-white">Pesan semua via WhatsApp</a>
    </div>}
    {cart.length>0&&<button type="button" onClick={()=>save([])} className="text-sm font-semibold text-bahaya underline">Kosongkan keranjang</button>}
  </div>;
}
