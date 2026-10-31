"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "biblio:favorites";

export default function FavoritesView({ products }) {
  const [ids, setIds] = useState(null);
  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || "[]");
      setIds(Array.isArray(list) ? list.map(Number).filter(Number.isSafeInteger) : []);
    } catch { setIds([]); }
  }, []);
  function remove(id) {
    const next = ids.filter(x => x !== Number(id));
    try { localStorage.setItem(KEY, JSON.stringify(next)); }
    catch { return; }
    setIds(next);
  }
  if (ids === null) return <p role="status" className="text-teks-lembut">Memuat favorit…</p>;
  const items = products.filter(book => ids.includes(Number(book.id)));
  if (!items.length) return <p className="rounded-lg border border-garis bg-permukaan p-6 text-teks-lembut">Belum ada buku favorit. Buka detail buku dan pilih Simpan favorit. <Link href="/#koleksi" className="font-semibold text-utama underline">Jelajahi koleksi</Link></p>;
  return <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
    {items.map(book => <article key={book.id}>
      <Link href={"/produk/" + book.id} className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-utama">
        <img src={book.foto_url} alt={"Sampul " + book.nama} className="aspect-[3/4] w-full rounded-md bg-permukaan object-cover"/>
        <h2 className="mt-3 font-serif text-lg group-hover:text-utama">{book.nama}</h2>
        <p className="mt-1 text-xs text-teks-lembut">{book.kategori}</p>
      </Link>
      <button type="button" onClick={() => remove(book.id)} className="mt-3 rounded-md border border-garis px-3 py-2 text-xs font-semibold text-bahaya hover:border-bahaya">Hapus favorit</button>
    </article>)}
  </div>;
}
