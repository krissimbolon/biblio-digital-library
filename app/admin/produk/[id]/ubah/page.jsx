import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { editProduct } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/supabase/server";
import { productById } from "@/lib/supabase/catalog";

export default async function HalamanUbahProduk({params,searchParams}) {
  await requireAdmin();
  const {id}=await params;
  const book=await productById(id);
  if (!book) notFound();
  const q=await searchParams;
  return <section className="flex flex-col gap-7 py-10">
    <NavAdmin/><h1 className="font-serif text-3xl">Ubah buku</h1>
    <FormProduk produk={book} labelTombol="Simpan perubahan" action={editProduct.bind(null,id)} error={q?.error}/>
  </section>;
}
