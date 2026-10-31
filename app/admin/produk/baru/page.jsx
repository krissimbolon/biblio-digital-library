import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { addProduct } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/supabase/server";
import { categories } from "@/lib/supabase/catalog";

export default async function HalamanTambahProduk({searchParams}) {
  await requireAdmin();
  const q=await searchParams;
  const kategori=await categories();
  return <section className="flex flex-col gap-7 py-10">
    <NavAdmin/><h1 className="font-serif text-3xl">Tambah buku</h1>
    <FormProduk labelTombol="Simpan buku" action={addProduct} error={q?.error} kategori={kategori}/>
  </section>;
}
