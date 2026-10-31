"use client";
import {useState} from "react";

export default function TanyaBuku({id}){
  const [pertanyaan,setPertanyaan]=useState("");
  const [jawaban,setJawaban]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  async function kirim(e){
    e.preventDefault();if(!pertanyaan.trim())return;
    setLoading(true);setError("");setJawaban("");
    try{
      const res=await fetch("/api/produk/tanya",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,pertanyaan})});
      const json=await res.json();
      if(!res.ok)throw new Error(json.error||"Pertanyaan belum dapat dijawab.");
      setJawaban(json.jawaban);
    }catch(e){setError(e.message||"Coba kembali nanti.");}
    finally{setLoading(false);}
  }
  return <div className="grid gap-6 md:grid-cols-2">
    <div><h2 className="font-serif text-2xl">Tanya tentang buku ini</h2><p className="mt-3 text-sm leading-7 text-teks-lembut">Jawaban hanya menggunakan informasi yang tersedia di katalog Biblio.</p></div>
    <form onSubmit={kirim} className="flex flex-col gap-3">
      <label htmlFor="pertanyaan-buku" className="text-sm font-semibold">Pertanyaan singkat</label>
      <textarea id="pertanyaan-buku" value={pertanyaan} onChange={e=>setPertanyaan(e.target.value)} required maxLength={250} rows={3} placeholder="Contoh: Buku ini termasuk genre apa?" className="rounded-lg border border-garis bg-latar p-3 text-sm"/>
      <button disabled={loading||!pertanyaan.trim()} type="submit" className="self-start rounded-md bg-utama px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{loading?"Mencari jawaban…":"Kirim pertanyaan"}</button>
      {error&&<p role="alert" className="text-sm text-bahaya">{error}</p>}
      {jawaban&&<p role="status" className="rounded-lg border border-garis bg-permukaan p-4 text-sm leading-7">{jawaban}</p>}
    </form>
  </div>;
}
