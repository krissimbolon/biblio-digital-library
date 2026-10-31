"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark,setDark]=useState(false);
  useEffect(()=>{
    const selected=localStorage.getItem("biblio:theme")==="dark";
    document.documentElement.dataset.theme=selected?"dark":"light";
    setDark(selected);
  },[]);
  function toggle(){
    const next=!dark;
    document.documentElement.dataset.theme=next?"dark":"light";
    localStorage.setItem("biblio:theme",next?"dark":"light");
    setDark(next);
  }
  return <button type="button" onClick={toggle} aria-label={dark?"Aktifkan mode terang":"Aktifkan mode gelap"} className="rounded-md border border-garis px-3 py-2 text-xs font-semibold text-teks-lembut hover:text-utama">
    {dark?"Terang":"Gelap"}
  </button>;
}
