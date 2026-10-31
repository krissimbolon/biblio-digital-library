import NavAdmin from "@/components/NavAdmin";
import { requireAdmin } from "@/lib/supabase/server";
import { getToko } from "@/lib/supabase/store";
import { saveSettings } from "./actions";

export default async function PengaturanToko({searchParams}) {
  await requireAdmin();
  const data=await getToko();
  const q=await searchParams;
  return <section className="space-y-6 py-10">
    <NavAdmin/>
    <h1 className="font-serif text-3xl">Pengaturan toko</h1>
    {q?.error&&<p role="alert" className="text-sm text-bahaya">Periksa nama toko, nomor WhatsApp (awalan 62), jam buka, dan alamat.</p>}
    {q?.status&&<p role="status" className="text-sm text-utama">Pengaturan berhasil disimpan.</p>}
    <form action={saveSettings} className="flex max-w-xl flex-col gap-5">
      <label className="text-sm font-semibold">Nama toko<input name="nama" maxLength={80} required defaultValue={data.nama} className="mt-2 w-full rounded-md border border-garis bg-latar p-3"/></label>
      <label className="text-sm font-semibold">Nomor WhatsApp (format 62… tanpa tanda +)<input name="nomor_whatsapp" pattern="62[0-9]{8,13}" required defaultValue={data.nomorWhatsApp} className="mt-2 w-full rounded-md border border-garis bg-latar p-3"/></label>
      <label className="text-sm font-semibold">Jam buka atau informasi layanan<input name="jam_buka" maxLength={120} required defaultValue={data.jamBuka} className="mt-2 w-full rounded-md border border-garis bg-latar p-3"/></label>
      <label className="text-sm font-semibold">Alamat<input name="alamat" maxLength={200} required defaultValue={data.alamat} className="mt-2 w-full rounded-md border border-garis bg-latar p-3"/></label>
      <button className="rounded-md bg-utama px-5 py-3 text-sm font-semibold text-white" type="submit">Simpan pengaturan</button>
    </form>
  </section>;
}
