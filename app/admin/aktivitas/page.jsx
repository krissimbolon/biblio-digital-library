import NavAdmin from "@/components/NavAdmin";
import { requireAdmin } from "@/lib/supabase/server";
import { catalogClient } from "@/lib/supabase/catalog";

export default async function AktivitasAdmin(){
  await requireAdmin();
  const {data,error}=await catalogClient().from("admin_log").select("id,admin_email,aksi,target,created_at").order("created_at",{ascending:false}).limit(50);
  if(error)throw new Error("Riwayat aktivitas gagal dimuat");
  return <section className="space-y-6 py-10">
    <NavAdmin/><h1 className="font-serif text-3xl">Aktivitas administrator</h1>
    {!data?.length&&<p className="text-sm text-teks-lembut">Belum ada aktivitas tercatat.</p>}
    <ol className="space-y-3">{data?.map(row=><li key={row.id} className="rounded-lg border border-garis p-4">
      <div className="flex flex-wrap justify-between gap-3"><strong className="text-sm">{row.aksi}</strong><time className="text-xs text-teks-lembut">{new Date(row.created_at).toLocaleString("id-ID",{timeZone:"Asia/Jakarta"})} WIB</time></div>
      <p className="mt-2 text-sm">{row.target||"—"}</p>
      <p className="mt-1 text-xs text-teks-lembut">{row.admin_email||"Administrator"}</p>
    </li>)}</ol>
  </section>;
}
