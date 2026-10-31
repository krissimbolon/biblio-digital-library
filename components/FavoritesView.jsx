"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function FavoritesView({products}) {
  const [ids,setIds]=useState(null);
  useEffect(()=>{try{setIds(JSON.parse(localStorage.getItem("biblio:favorites")||"[]"))}catch{setIds([])}},[]);
  if(ids===null) return <p className="text-teks-lembut">Memuat favorit…</p>;
  const items=products.filter(book=>ids.includes(Number(book.id)));
  if(!items.length) return <p className="rounded-lg border border-garis bg-permukaan p-6 text-teks-lembut">Belum ada buku favorit. Buka detail buku dan pilih Simpan favorit.</p>;
  return <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">{items.map(book=><Link key={book.id} href={"/produk/"+book.id} className="group">
    <img src={book.foto_url} alt={"Sampul "+book.nama} className="aspect-[3/4] w-full rounded-md bg-permukaan object-cover"/>
    <h2 className="mt-3 font-serif text-lg group-hover:text-utama">{book.nama}</h2>
    <p className="mt-1 text-xs text-teks-lembut">{book.kategori}</p>
  </Link>)}</div>;
}
