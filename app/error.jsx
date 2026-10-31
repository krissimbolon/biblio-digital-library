"use client";
export default function ErrorPage({reset}) {
  return <section className="mx-auto max-w-lg py-24 text-center">
    <h1 className="font-serif text-3xl">Halaman belum dapat dibuka</h1>
    <p className="mt-4 text-sm text-teks-lembut">Terjadi kendala sementara. Silakan coba kembali.</p>
    <button type="button" onClick={()=>reset()} className="mt-8 rounded-md bg-utama px-6 py-3 text-sm font-semibold text-white">Coba lagi</button>
  </section>;
}
