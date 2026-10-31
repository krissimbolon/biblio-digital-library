import NavAdmin from "@/components/NavAdmin";
import Tombol from "@/components/Tombol";
import { requireAdmin } from "@/lib/supabase/server";
import { catalogClient } from "@/lib/supabase/catalog";
import { addCategory, renameCategory, deleteCategory } from "@/app/admin/actions";

const pesan = {
  tambah: "Kategori ditambahkan.",
  ubah: "Nama kategori diperbarui, termasuk pada buku yang memakainya.",
  hapus: "Kategori dihapus.",
};

export default async function HalamanKategoriAdmin({ searchParams }) {
  await requireAdmin();
  const q = await searchParams;
  const client = catalogClient();
  const [{ data: kategori }, { data: produk }] = await Promise.all([
    client.from("kategori").select("id,nama,slug").order("nama"),
    client.from("produk").select("kategori"),
  ]);
  const pemakaian = (produk || []).reduce((acc, p) => { acc[p.kategori] = (acc[p.kategori] || 0) + 1; return acc; }, {});
  const galat = q?.error === "dipakai"
    ? "Kategori masih dipakai oleh " + (Number(q.jumlah) || "beberapa") + " buku. Pindahkan buku tersebut ke kategori lain sebelum menghapus."
    : q?.error === "duplikat" ? "Nama kategori sudah ada." : q?.error ? "Nama kategori tidak valid." : "";

  return (
    <section className="flex flex-col gap-7 py-10">
      <NavAdmin />
      <div>
        <h1 className="font-serif text-3xl">Kategori</h1>
        <p className="mt-2 text-sm text-teks-lembut">Daftar ini dipakai pada form buku, filter katalog, dan halaman kategori.</p>
      </div>
      {galat && <p role="alert" className="rounded-md border border-bahaya/40 bg-permukaan p-3 text-sm text-bahaya">{galat}</p>}
      {pesan[q?.status] && <p role="status" className="rounded-md bg-permukaan p-3 text-sm text-utama">{pesan[q.status]}</p>}
      <form action={addCategory} className="flex max-w-md gap-2">
        <input name="nama" aria-label="Nama kategori baru" placeholder="Nama kategori baru" maxLength={80} required className="min-w-0 flex-1 rounded-md border border-garis bg-latar px-3 py-2 text-sm" />
        <Tombol type="submit">Tambah</Tombol>
      </form>
      <ul className="divide-y divide-garis rounded-xl border border-garis">
        {(kategori || []).map((k) => (
          <li key={k.id} className="flex flex-wrap items-center gap-3 p-4">
            <form action={renameCategory} className="flex min-w-0 flex-1 gap-2">
              <input type="hidden" name="id" value={k.id} />
              <input name="nama" aria-label={"Nama kategori " + k.nama} defaultValue={k.nama} maxLength={80} required className="min-w-0 flex-1 rounded-md border border-garis bg-latar px-3 py-2 text-sm" />
              <button type="submit" className="rounded-md border border-garis px-3 py-2 text-xs font-semibold hover:border-utama hover:text-utama">Simpan</button>
            </form>
            <span className="text-xs text-teks-lembut">{pemakaian[k.nama] || 0} buku</span>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={k.id} />
              <button type="submit" className="rounded-md border border-garis px-3 py-2 text-xs font-semibold text-bahaya hover:border-bahaya">Hapus</button>
            </form>
          </li>
        ))}
        {!kategori?.length && <li className="p-4 text-sm text-teks-lembut">Belum ada kategori.</li>}
      </ul>
    </section>
  );
}
