"use client";
import {useEffect,useState} from "react";
import Link from "next/link";

export default function RecentlyViewed({products}) {
  const [ids,setIds]=useState([]);
  useEffect(()=>{try {setIds(JSON.parse(localStorage.getItem("biblio:recent")||"[]"))} catch {}},[]);
  const items=ids.map(id=>products.find(p=>Number(p.id)===Number(id))).filter(Boolean).slice(0,4);
  if(!items.length) return null;
  return <section className="border-t border-garis py-12">
    <h2 className="mb-6 font-serif text-2xl">Terakhir dilihat</h2>
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">{items.map(book=><Link href={"/produk/"+book.id} key={book.id} className="group">
      <img src={book.foto_url} alt={"Sampul "+book.nama} className="aspect-[3/4] w-full rounded-md bg-permukaan object-cover"/>
      <p className="mt-3 font-serif text-lg group-hover:text-utama">{book.nama}</p>
    </Link>)}</div>
  </section>;
}
