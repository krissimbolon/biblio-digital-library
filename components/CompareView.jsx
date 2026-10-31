"use client";
import { useState,useEffect } from "react";
import Link from "next/link";
import { hargaAkhir, formatRupiah } from "@/lib/format";
const KEY="biblio:compare";

export default function CompareView({ produk }) {
  const [ids,setIds]=useState(null);
  useEffect(()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||"[]");setIds(Array.isArray(x)?x.map(Number).slice(0,2):[])}catch{setIds([])}},[]);
  function remove(id){const next=ids.filter(x=>x!==id);setIds(next);try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}}
  if(ids===null)return <p className="text-teks-lembut">Memuat pilihan…</p>;
  const books=ids.map(id=>({id,book:produk.find(p=>Number(p.id)===id)}));
  if(!books.length)return <p className="rounded-lg bg-permukaan p-6 text-teks-lembut">Belum ada buku untuk dibandingkan. Gunakan tombol Bandingkan di katalog.</p>;
  return <div>
    <p className="mb-6 text-sm text-teks-lembut">Pilih maksimal dua buku. {books.length}/2 pilihan.</p>
    <div className="grid gap-5 sm:grid-cols-2">
      {books.map(({id,book})=><article key={id} className="flex flex-col gap-4 rounded-lg border border-garis p-5">
        {book?<><img src={book.foto_url} alt={"Sampul "+book.nama} className="mx-auto aspect-[3/4] max-h-64 object-contain"/>
          <h2 className="font-serif text-2xl"><Link href={"/produk/"+id}>{book.nama}</Link></h2>
          <p className="text-sm text-teks-lembut">Kategori: {book.kategori||"Tidak berkategori"}</p>
          <p className="font-semibold text-utama">{formatRupiah(hargaAkhir(book))}</p>
          <p className="flex-1 whitespace-pre-wrap text-sm leading-7 text-teks-lembut">{book.deskripsi||"Belum ada deskripsi."}</p>
        </>:<p role="status" className="text-bahaya">Buku tidak ditemukan atau tidak tersedia lagi.</p>}
        <button type="button" onClick={()=>remove(id)} className="self-start text-sm font-semibold text-bahaya">Hapus pilihan</button>
      </article>)}
    </div>
  </div>;
}
