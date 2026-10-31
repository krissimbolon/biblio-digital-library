import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { login } from "@/app/admin/actions";

export default async function HalamanLogin({ searchParams }) {
  const q = await searchParams;
  return <section className="mx-auto max-w-md py-16">
    <div className="rounded-xl border border-garis bg-latar p-8 shadow-sm">
      <h1 className="font-serif text-3xl">Masuk administrator</h1>
      <p className="mt-2 text-sm text-teks-lembut">Pengelolaan koleksi Biblio.</p>
      {q?.error && <p role="alert" className="mt-6 rounded-md bg-red-50 p-3 text-sm text-bahaya">Email, password, atau hak akses tidak sesuai.</p>}
      <form action={login} className="mt-7 flex flex-col gap-5">
        <Input label="Email" name="email" type="email" autoComplete="email" required />
        <Input label="Password" name="password" type="password" autoComplete="current-password" required />
        <Tombol type="submit">Masuk</Tombol>
      </form>
    </div>
  </section>;
}
