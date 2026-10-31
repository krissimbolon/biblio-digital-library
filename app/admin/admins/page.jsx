import NavAdmin from "@/components/NavAdmin";
import { requireAdmin } from "@/lib/supabase/server";
import { catalogClient } from "@/lib/supabase/catalog";
import { inviteAdmin,toggleAdmin,deleteAdmin } from "./actions";

const errors={email:"Alamat email tidak valid.",invite:"Undangan belum berhasil dikirim. Periksa konfigurasi email di Supabase.",save:"Perubahan administrator gagal disimpan.",self:"Akun yang sedang digunakan tidak dapat diubah atau dihapus.",delete:"Akun belum berhasil dihapus."};

export default async function Admins({searchParams}){
  const {user}=await requireAdmin();
  const {data:admins,error}=await catalogClient().from("biblio_admins").select("user_id,email,aktif,created_at").order("created_at");
  if(error)throw new Error("Daftar administrator gagal dimuat");
  const q=await searchParams;
  return <section className="space-y-6 py-10">
    <NavAdmin/><h1 className="font-serif text-3xl">Administrator</h1>
    <p className="text-sm text-teks-lembut">Undangan dikirim melalui email. Administrator baru menetapkan kredensial melalui tautan undangan.</p>
    {q?.error&&<p role="alert" className="text-sm text-bahaya">{errors[q.error]||errors.save}</p>}
    {q?.status&&<p role="status" className="text-sm text-utama">Undangan administrator telah diproses.</p>}
    <form action={inviteAdmin} className="flex max-w-lg flex-wrap gap-3 rounded-lg border border-garis p-4">
      <input type="email" name="email" required placeholder="email@contoh.com" className="min-w-0 flex-1 rounded-md border border-garis bg-latar p-3"/>
      <button type="submit" className="rounded-md bg-utama px-5 py-3 text-sm font-semibold text-white">Undang admin</button>
    </form>
    {!admins?.length&&<p className="text-sm text-teks-lembut">Daftar administrator belum tersedia.</p>}
    {admins?.map(a=><div key={a.user_id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-garis p-4">
      <div><p className="font-semibold">{a.email||"Administrator"}</p><p className="text-xs text-teks-lembut">{a.aktif?"Aktif":"Nonaktif"}{a.user_id===user.id?" · Akun ini":""}</p></div>
      {a.user_id!==user.id&&<div className="flex gap-4 text-sm">
        <form action={toggleAdmin}><input type="hidden" name="user_id" value={a.user_id}/><button type="submit" className="font-semibold text-utama">{a.aktif?"Nonaktifkan":"Aktifkan"}</button></form>
        <form action={deleteAdmin}><input type="hidden" name="user_id" value={a.user_id}/><button type="submit" className="font-semibold text-bahaya">Hapus</button></form>
      </div>}
    </div>)}
  </section>;
}
