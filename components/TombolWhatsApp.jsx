import { toko } from "@/lib/toko";
import { hargaAkhir } from "@/lib/format";
import WhatsAppOrder from "@/components/WhatsAppOrder";

export default function TombolWhatsApp({ produk, nomorToko }) {
  const nomor = String(nomorToko || toko.nomorWhatsApp || "").replace(/\D/g, "");
  if (Number(produk.stok) === 0) return <p role="status" className="rounded-md border border-garis bg-permukaan px-4 py-3 text-sm font-semibold text-teks">Stok habis. Pemesanan dibuka kembali setelah stok tersedia.</p>;
  if (!/^\d{10,15}$/.test(nomor)) return <p className="rounded-md border border-garis bg-permukaan px-4 py-3 text-sm text-teks-lembut">Pemesanan WhatsApp belum tersedia.</p>;
  return <WhatsAppOrder nomor={nomor} id={produk.id} nama={produk.nama} harga={hargaAkhir(produk)} stok={Number(produk.stok) || 99} />;
}
