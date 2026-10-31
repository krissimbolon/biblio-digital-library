import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

export default function FormProduk({produk={},labelTombol,action,error}) {
  return <form action={action} className="flex max-w-xl flex-col gap-5">
    {error&&<p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-bahaya">Periksa nama, harga, atau alamat gambar, lalu coba kembali.</p>}
    <Input label="Judul buku" name="nama" defaultValue={produk.nama||""} maxLength={160} required/>
    <Input label="Harga (Rp)" name="harga" type="number" min="0" step="1" defaultValue={produk.harga??""} required/>
    <Input label="Kategori" name="kategori" defaultValue={produk.kategori||""} maxLength={80}/>
    <Input label="URL sampul" name="foto_url" defaultValue={produk.foto_url||""} placeholder="https://... atau /buku/nama.svg"/>
    <Input label="Deskripsi" name="deskripsi" textarea defaultValue={produk.deskripsi||""} maxLength={4000}/>
    <div className="flex gap-3"><Tombol type="submit">{labelTombol}</Tombol><Tombol href="/admin" varian="garis">Batal</Tombol></div>
  </form>;
}
