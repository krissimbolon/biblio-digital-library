import NavAdmin from "@/components/NavAdmin";
import { requireAdmin } from "@/lib/supabase/server";
import { catalogClient } from "@/lib/supabase/catalog";
import { saveBanner,toggleBanner } from "./actions";

function FormBanner({banner={}}){
  return <form action={saveBanner} className="grid gap-3 rounded-lg border border-garis p-5">
    {banner.id&&<input name="id" type="hidden" value={banner.id}/>}
    <input name="judul" required maxLength={120} placeholder="Judul banner" defaultValue={banner.judul||""} className="w-full rounded-md border border-garis bg-latar p-3"/>
    <textarea name="teks" maxLength={300} rows={2} placeholder="Teks penawaran" defaultValue={banner.teks||""} className="w-full rounded-md border border-garis bg-latar p-3"/>
    <div className="grid gap-3 sm:grid-cols-2">
      <input name="gambar_url" placeholder="URL gambar HTTPS" defaultValue={banner.gambar_url||""} className="min-w-0 rounded-md border border-garis bg-latar p-3"/>
      <input name="tautan" placeholder="Tautan HTTPS atau /halaman" defaultValue={banner.tautan||""} className="min-w-0 rounded-md border border-garis bg-latar p-3"/>
    </div>
    <label className="text-sm">Urutan <input type="number" name="urutan" defaultValue={banner.urutan||0} className="ml-2 w-20 rounded-md border border-garis bg-latar p-2"/></label>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="aktif" defaultChecked={banner.aktif??true}/>Tampilkan di beranda</label>
    <button type="submit" className="w-fit rounded-md bg-utama px-5 py-2.5 text-sm font-semibold text-white">{banner.id?"Simpan perubahan":"Tambah banner"}</button>
  </form>;
}
export default async function BannerAdmin({searchParams}){
  await requireAdmin();
  const {data,error}=await catalogClient().from("banner").select("*").order("urutan").order("id");
  if(error)throw new Error("Daftar banner gagal dimuat");
  const q=await searchParams;
  return <section className="space-y-6 py-10">
    <NavAdmin/><h1 className="font-serif text-3xl">Banner koleksi</h1>
    {q?.error&&<p role="alert" className="text-sm text-bahaya">Periksa kembali data banner.</p>}
    {q?.status&&<p role="status" className="text-sm text-utama">Banner berhasil disimpan.</p>}
    <h2 className="font-serif text-xl">Banner baru</h2><FormBanner/>
    <h2 className="font-serif text-xl">Banner tersimpan</h2>
    {!data?.length&&<p className="text-sm text-teks-lembut">Belum ada banner.</p>}
    {data?.map(b=><article key={b.id} className="space-y-3">
      <FormBanner banner={b}/>
      <form action={toggleBanner}><input type="hidden" name="id" value={b.id}/><button type="submit" className="text-sm font-semibold text-utama underline">{b.aktif?"Nonaktifkan":"Aktifkan"} banner ini</button></form>
    </article>)}
  </section>;
}
