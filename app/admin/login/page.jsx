import Link from "next/link";
import { login } from "@/app/admin/actions";

export const metadata = { title: "Masuk administrator | Biblio", robots: { index: false, follow: false } };

const pesan = {
  rate: "Terlalu banyak percobaan masuk. Coba lagi dalam beberapa menit.",
  default: "Email atau password tidak sesuai, atau akun tidak memiliki akses administrator.",
};

function IkonSurat() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6 8.5-6" /></svg>;
}

function IkonGembok() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></svg>;
}

function IkonPeringatan() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" /></svg>;
}

function Kolom({ id, label, ikon, ...props }) {
  return <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-semibold text-teks">{label}</label>
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-teks-lembut">{ikon}</span>
      <input id={id} className="w-full rounded-lg border border-garis bg-latar py-3 pl-11 pr-3 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none focus:ring-2 focus:ring-utama/20" {...props} />
    </div>
  </div>;
}

export default async function HalamanLogin({ searchParams }) {
  const q = await searchParams;
  const error = q?.error ? (pesan[q.error] || pesan.default) : "";
  return <section className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-12">
    <div className="rounded-2xl border border-garis bg-permukaan p-8 sm:p-10">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-utama text-white"><IkonGembok /></span>
        <div>
          <h1 className="font-serif text-2xl leading-tight text-teks">Masuk administrator</h1>
          <p className="text-sm text-teks-lembut">Pengelolaan koleksi Biblio</p>
        </div>
      </div>
      {error && <p role="alert" className="mt-6 flex gap-2 rounded-lg border border-bahaya/40 bg-latar p-3 text-sm text-bahaya"><IkonPeringatan />{error}</p>}
      <form action={login} className="mt-7 flex flex-col gap-5">
        <Kolom id="email" label="Email" ikon={<IkonSurat />} name="email" type="email" autoComplete="email" placeholder="nama@email.com" required />
        <Kolom id="password" label="Password" ikon={<IkonGembok />} name="password" type="password" autoComplete="current-password" required />
        <button type="submit" className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-utama px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-utama-gelap">Masuk</button>
      </form>
      <p className="mt-6 border-t border-garis pt-5 text-center text-sm text-teks-lembut">
        <Link href="/" className="font-semibold text-utama underline-offset-4 hover:underline">Kembali ke katalog</Link>
      </p>
    </div>
  </section>;
}
