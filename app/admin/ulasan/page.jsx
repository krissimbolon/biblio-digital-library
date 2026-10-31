import NavAdmin from "@/components/NavAdmin";
import { requireAdmin } from "@/lib/supabase/server";
import { catalogClient } from "@/lib/supabase/catalog";
import { toggleReview,deleteReview } from "./actions";
import Link from "next/link";

export default async function UlasanAdmin({searchParams}){
  const q=await searchParams;
  const page=Math.max(1,Math.floor(Number(q?.page)||1));
  const size=50;
  await requireAdmin();
  const {data:items,error,count}=await catalogClient().from("ulasan").select("id,produk_id,nama,rating,komentar,tampil,created_at",{count:"exact"}).order("created_at",{ascending:false}).range((page-1)*size,page*size-1);
  if(error)throw new Error("Ulasan belum dapat dimuat");
  return <section className="space-y-6 py-10">
    <NavAdmin/><h1 className="font-serif text-3xl">Moderasi ulasan</h1>
    {!items?.length&&<p className="text-sm text-teks-lembut">Belum ada ulasan.</p>}
    {items?.map(u=><article key={u.id} className="rounded-lg border border-garis p-5">
      <div className="flex flex-wrap justify-between gap-2"><strong>{u.nama}</strong><span className="text-sm text-teks-lembut">{u.rating}/5 · {u.tampil?"Tampil":"Disembunyikan"}</span></div>
      <Link href={"/produk/"+u.produk_id} className="text-xs text-utama underline">Buka buku #{u.produk_id}</Link>
      <p className="my-4 whitespace-pre-wrap text-sm leading-6">{u.komentar}</p>
      <div className="flex gap-5 text-sm">
        <form action={toggleReview}><input type="hidden" name="id" value={u.id}/><button type="submit" className="font-semibold text-utama">{u.tampil?"Sembunyikan":"Tampilkan"}</button></form>
        <form action={deleteReview}><input type="hidden" name="id" value={u.id}/><button type="submit" className="font-semibold text-bahaya">Hapus</button></form>
      </div>
    </article>)}
    <nav aria-label="Halaman ulasan" className="flex gap-6 text-sm">
      {page>1&&<Link href={"/admin/ulasan?page="+(page-1)} className="text-utama underline">Sebelumnya</Link>}
      <span>Halaman {page} dari {Math.max(1,Math.ceil((count||0)/size))}</span>
      {page*size<(count||0)&&<Link href={"/admin/ulasan?page="+(page+1)} className="text-utama underline">Berikutnya</Link>}
    </nav>
  </section>;
}
