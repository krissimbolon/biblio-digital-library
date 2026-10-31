import NavAdmin from "@/components/NavAdmin";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { changePassword } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/supabase/server";

export default async function HalamanPassword({searchParams}) {
  await requireAdmin();
  const q=await searchParams;
  const messages={length:"Password minimal 8 karakter.",mismatch:"Konfirmasi tidak cocok.",save:"Perubahan belum berhasil."};
  return <section className="flex flex-col gap-7 py-10">
    <NavAdmin/>
    <h1 className="font-serif text-3xl">Ganti password</h1>
    {q?.error && <p role="alert" className="rounded-md bg-red-50 p-4 text-sm text-bahaya">{messages[q.error]||messages.save}</p>}
    {q?.status==="success" && <p role="status" className="rounded-md bg-permukaan p-4 text-sm text-utama">Password berhasil diperbarui.</p>}
    <form action={changePassword} className="flex max-w-md flex-col gap-4">
      <Input label="Password baru" name="password_baru" type="password" autoComplete="new-password" minLength={8} required/>
      <Input label="Ulangi password baru" name="konfirmasi_password" type="password" autoComplete="new-password" minLength={8} required/>
      <Tombol type="submit">Simpan password</Tombol>
    </form>
  </section>;
}
