"use client";
import { useEffect, useState } from "react";

export default function LibraryActions({id}) {
  const [favorite,setFavorite]=useState(false);
  const [ready,setReady]=useState(false);
  const [status,setStatus]=useState("");
  useEffect(()=>{
    try {
      const saved=JSON.parse(localStorage.getItem("biblio:favorites")||"[]");
      setFavorite(saved.includes(Number(id)));
      const recent=JSON.parse(localStorage.getItem("biblio:recent")||"[]").filter(x=>x!==Number(id));
      localStorage.setItem("biblio:recent",JSON.stringify([Number(id),...recent].slice(0,8)));
    } catch { /* Katalog tetap dapat digunakan tanpa penyimpanan browser. */ }
    setReady(true);
  },[id]);
  function toggleFavorite(){
    try {
      const old=JSON.parse(localStorage.getItem("biblio:favorites")||"[]");
      const next=favorite?old.filter(x=>x!==Number(id)):[...new Set([...old,Number(id)])];
      localStorage.setItem("biblio:favorites",JSON.stringify(next));
      setFavorite(!favorite);
      setStatus(favorite?"Dihapus dari favorit":"Disimpan ke favorit");
    } catch {setStatus("Penyimpanan favorit tidak tersedia");}
  }
  async function share(){
    try {
      if(navigator.share) {
        await navigator.share({title:document.title,url:location.href});
        setStatus("Tautan berhasil dibagikan");
      } else {
        await navigator.clipboard.writeText(location.href);
        setStatus("Link tersalin");
      }
    } catch(e) {
      if(e?.name!=="AbortError")setStatus("Link belum dapat dibagikan");
    }
  }
  return <div className="flex flex-wrap items-center gap-3">
    <button type="button" onClick={toggleFavorite} disabled={!ready} aria-pressed={favorite} className="rounded-md border border-garis px-4 py-2 text-sm font-semibold hover:border-utama">{favorite?"♥ Tersimpan":"♡ Simpan favorit"}</button>
    <button type="button" onClick={share} disabled={!ready} className="rounded-md border border-garis px-4 py-2 text-sm font-semibold hover:border-utama">Bagikan buku</button>
    {status&&<span role="status" className="text-xs text-teks-lembut">{status}</span>}
  </div>;
}
