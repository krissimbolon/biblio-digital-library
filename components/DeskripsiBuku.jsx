"use client";
import {useState} from "react";

export default function DeskripsiBuku(){
  const [loading,setLoading]=useState(false);
  const [status,setStatus]=useState("");
  async function buat(e){
    const form=e.currentTarget.closest("form");
    const nama=form?.querySelector('[name="nama"]')?.value?.trim();
    const kategori=form?.querySelector('[name="kategori"]')?.value?.trim();
    if(!nama){setStatus("Isi judul buku terlebih dahulu.");return;}
    setLoading(true);setStatus("");
    try{
      const response=await fetch("/api/admin/deskripsi",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nama,kategori})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||"Deskripsi belum dapat dibuat.");
      const textarea=form?.querySelector('textarea[name="deskripsi"]');
      if(textarea){textarea.value=data.deskripsi;textarea.dispatchEvent(new Event("input",{bubbles:true}));}
      setStatus("Deskripsi siap ditinjau sebelum disimpan.");
    }catch(e){setStatus(e.message||"Coba kembali beberapa saat lagi.");}
    finally{setLoading(false);}
  }
  return <div className="flex flex-wrap items-center gap-3">
    <button type="button" disabled={loading} onClick={buat} className="rounded-md border border-garis px-4 py-2 text-sm font-semibold hover:border-utama disabled:opacity-60">{loading?"Menyusun deskripsi…":"Buat deskripsi dari judul"}</button>
    {status&&<span role="status" className="text-xs text-teks-lembut">{status}</span>}
  </div>;
}
