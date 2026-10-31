import NavAdmin from "@/components/NavAdmin";
import ImportCSVForm from "@/components/ImportCSVForm";
import { requireAdmin } from "@/lib/supabase/server";

export default async function ImporPage() {
  await requireAdmin();
  return <section className="space-y-6 py-10">
    <NavAdmin/><h1 className="font-serif text-3xl">Impor koleksi CSV</h1>
    <p className="max-w-2xl text-sm leading-7 text-teks-lembut">Kolom wajib: <code>nama,harga</code>. Kolom opsional: <code>kategori,deskripsi,foto_url,stok,harga_diskon,aktif</code>. Baris yang tidak valid akan dilaporkan tanpa menghalangi baris lain.</p>
    <ImportCSVForm />
  </section>;
}
