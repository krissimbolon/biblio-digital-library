import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

const pesanError = {
  invalid: "Periksa judul, harga, harga diskon (harus lebih kecil dari harga normal), stok, atau alamat gambar.",
  save: "Buku gagal disimpan. Coba lagi.",
};

export default function FormProduk({ produk = {}, labelTombol, action, error, kategori = [] }) {
  const pilihan = kategori.some((k) => k.nama === produk.kategori) || !produk.kategori ? kategori : [{ id: "lama", nama: produk.kategori }, ...kategori];
  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      {error && <p role="alert" className="rounded-md border border-bahaya/40 bg-permukaan p-3 text-sm text-bahaya">{pesanError[error] || pesanError.save}</p>}
      <Input label="Judul buku" name="nama" defaultValue={produk.nama || ""} maxLength={160} required />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Harga normal (Rp)" name="harga" type="number" min="0" step="1" defaultValue={produk.harga ?? ""} required />
        <Input label="Harga diskon (Rp, opsional)" name="harga_diskon" type="number" min="0" step="1" defaultValue={produk.harga_diskon ?? ""} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Kategori
          <select name="kategori" defaultValue={produk.kategori || ""} className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none">
            <option value="">Tanpa kategori</option>
            {pilihan.map((k) => <option key={k.id} value={k.nama}>{k.nama}</option>)}
          </select>
        </label>
        <Input label="Stok" name="stok" type="number" min="0" step="1" defaultValue={produk.stok ?? 10} required />
      </div>
      <Input label="URL sampul" name="foto_url" defaultValue={produk.foto_url || ""} placeholder="https://... atau /buku/nama.svg" />
      <Input label="Deskripsi" name="deskripsi" textarea defaultValue={produk.deskripsi || ""} maxLength={4000} />
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" name="aktif" defaultChecked={produk.aktif ?? true} className="h-4 w-4 accent-[var(--color-utama)]" />
        Tampilkan di katalog publik
      </label>
      <div className="flex gap-3"><Tombol type="submit">{labelTombol}</Tombol><Tombol href="/admin" varian="garis">Batal</Tombol></div>
    </form>
  );
}
