import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import DeleteProduct from "@/components/DeleteProduct";

export default function TabelProduk({daftarProduk}) {
  if (!daftarProduk.length) return <p className="rounded-lg border border-garis p-6 text-sm text-teks-lembut">Belum ada buku yang sesuai.</p>;
  return <div className="overflow-x-auto rounded-xl border border-garis">
    <table className="w-full min-w-[580px] text-left text-sm">
      <thead className="bg-permukaan text-teks-lembut"><tr><th className="p-4">Buku</th><th className="p-4">Kategori</th><th className="p-4">Harga</th><th className="p-4">Tindakan</th></tr></thead>
      <tbody>{daftarProduk.map(produk=><tr key={produk.id} className="border-t border-garis">
        <td className="p-4"><div className="flex items-center gap-3">
          <img src={produk.foto_url||"/buku/pride-and-prejudice.svg"} alt="" className="h-14 w-10 object-cover"/>
          <span className="font-semibold">{produk.nama}</span>
        </div></td>
        <td className="p-4 text-teks-lembut">{produk.kategori}</td>
        <td className="p-4">{formatRupiah(produk.harga)}</td>
        <td className="p-4"><div className="flex items-center gap-2">
          <Link className="rounded-md border border-garis px-3 py-2 text-xs font-semibold" href={"/admin/produk/"+produk.id+"/ubah"}>Ubah</Link>
          <DeleteProduct id={produk.id} nama={produk.nama}/>
        </div></td>
      </tr>)}</tbody>
    </table>
  </div>;
}
