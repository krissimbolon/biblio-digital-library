import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({produk}) {
  const nomor=(process.env.BIBLIO_WHATSAPP_NUMBER||toko.nomorWhatsApp||"").replace(/\D/g,"");
  if (!/^\d{10,15}$/.test(nomor)) {
    return <p className="rounded-md border border-garis bg-permukaan px-4 py-3 text-sm text-teks-lembut">
      Pemesanan melalui WhatsApp belum tersedia.
    </p>;
  }
  const pesan="Halo Biblio, saya ingin memesan buku "+produk.nama+" ("+formatRupiah(produk.harga)+").";
  const href="https://wa.me/"+nomor+"?text="+encodeURIComponent(pesan);
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-md bg-utama px-6 py-3 text-sm font-semibold text-white hover:bg-utama-gelap">
    Pesan via WhatsApp
  </a>;
}
