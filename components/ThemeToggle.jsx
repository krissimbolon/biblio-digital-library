"use client";
import { useEffect, useState } from "react";

function IkonMatahari() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></svg>;
}

function IkonBulan() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" /></svg>;
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const selected = localStorage.getItem("biblio:theme") === "dark";
    document.documentElement.dataset.theme = selected ? "dark" : "light";
    setDark(selected);
  }, []);
  function toggle() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("biblio:theme", next ? "dark" : "light");
    setDark(next);
  }
  const label = dark ? "Aktifkan mode terang" : "Aktifkan mode gelap";
  return <button type="button" onClick={toggle} aria-label={label} title={label} aria-pressed={dark}
    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-garis text-teks-lembut transition-colors hover:border-utama hover:text-utama">
    {dark ? <IkonMatahari /> : <IkonBulan />}
  </button>;
}
