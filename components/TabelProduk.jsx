import Link from "next/link";
import { formatRupiah, hargaAkhir, adaDiskon } from "@/lib/format";
import DeleteProduct from "@/components/DeleteProduct";
import { toggleProduct, moveProduct } from "@/app/admin/actions";

function TombolUrutan({ id, arah, label, children }) {
  return (
    <form action={moveProduct}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="arah" value={arah} />
      <button type="submit" aria-label={label} title={label} className="flex h-8 w-8 items-center justify-center rounded-md border border-garis text-teks-lembut hover:border-utama hover:text-utama">{children}</button>
    </form>
  );
}

export default function TabelProduk({ daftarProduk }) {
  if (!daftarProduk.length) return <p className="rounded-lg border border-garis p-6 text-sm text-teks-lembut">Belum ada buku yang sesuai.</p>;
  return (
    <div className="overflow-x-auto rounded-xl border border-garis">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-permukaan text-teks-lembut">
          <tr><th className="p-4">Urutan</th><th className="p-4">Buku</th><th className="p-4">Kategori</th><th className="p-4">Harga</th><th className="p-4">Stok</th><th className="p-4">Status</th><th className="p-4">Tindakan</th></tr>
        </thead>
        <tbody>
          {daftarProduk.map((produk) => (
            <tr key={produk.id} className={"border-t border-garis" + (produk.aktif ? "" : " text-teks-lembut")}>
              <td className="p-4"><div className="flex gap-1">
                <TombolUrutan id={produk.id} arah="naik" label={"Naikkan " + produk.nama}>↑</TombolUrutan>
                <TombolUrutan id={produk.id} arah="turun" label={"Turunkan " + produk.nama}>↓</TombolUrutan>
              </div></td>
              <td className="p-4"><div className="flex items-center gap-3">
                {produk.foto_url ? <img src={produk.foto_url} alt="" className="h-14 w-10 object-cover" /> : <span className="h-14 w-10 rounded bg-permukaan" />}
                <span className="font-semibold">{produk.nama}</span>
              </div></td>
              <td className="p-4 text-teks-lembut">{produk.kategori || "—"}</td>
              <td className="p-4">{formatRupiah(hargaAkhir(produk))}{adaDiskon(produk) && <s className="ml-2 text-xs text-teks-lembut">{formatRupiah(produk.harga)}</s>}</td>
              <td className="p-4">{Number(produk.stok) === 0 ? <span className="font-semibold text-bahaya">Habis</span> : produk.stok}</td>
              <td className="p-4">
                <form action={toggleProduct}>
                  <input type="hidden" name="id" value={produk.id} />
                  <button type="submit" aria-pressed={produk.aktif} className={"rounded-full px-3 py-1 text-xs font-semibold " + (produk.aktif ? "bg-utama text-white" : "border border-garis text-teks-lembut")}>
                    {produk.aktif ? "Aktif" : "Nonaktif"}
                  </button>
                </form>
              </td>
              <td className="p-4"><div className="flex items-center gap-2">
                <Link className="rounded-md border border-garis px-3 py-2 text-xs font-semibold" href={"/admin/produk/" + produk.id + "/ubah"}>Ubah</Link>
                <DeleteProduct id={produk.id} nama={produk.nama} />
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
