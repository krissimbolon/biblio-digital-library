"use client";
import { useState } from "react";

export default function GaleriProduk({ nama, sampul, galeri = [], habis = false }) {
  const gambar = [...new Set([sampul,...galeri].filter(x=>typeof x==="string" && x.length))];
  const [pilih, setPilih] = useState(0);
  if (!gambar.length) return <div className="flex aspect-[3/4] items-center justify-center text-sm text-teks-lembut">Sampul belum tersedia</div>;
  const active = Math.min(pilih, gambar.length - 1);
  return <div className="flex flex-col items-center gap-4">
    <img src={gambar[active]} alt={"Foto "+(active+1)+" dari "+nama} className={"mx-auto aspect-[3/4] w-full max-w-[320px] rounded-sm object-cover shadow-xl"+(habis?" opacity-60 grayscale":"")} />
    {gambar.length > 1 && <div className="flex max-w-full flex-wrap justify-center gap-2" aria-label="Pilih foto buku">
      {gambar.map((src,i)=><button key={src} type="button" onClick={()=>setPilih(i)} aria-label={"Tampilkan foto "+(i+1)} aria-pressed={active===i} className={"w-14 rounded-md border-2 p-1 "+(active===i?"border-utama":"border-garis")}>
        <img src={src} alt="" className="aspect-[3/4] w-full object-cover" loading="lazy" />
      </button>)}
    </div>}
  </div>;
}
