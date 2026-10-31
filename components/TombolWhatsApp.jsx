import { toko } from "@/lib/toko";
import WhatsAppOrder from "@/components/WhatsAppOrder";

export default function TombolWhatsApp({ produk }) {
  const nomor = String(toko.nomorWhatsApp || "").replace(/\D/g, "");
  if (!/^\d{10,15}$/.test(nomor)) return <p className="rounded-md border border-garis bg-permukaan px-4 py-3 text-sm text-teks-lembut">Pemesanan WhatsApp belum tersedia.</p>;
  return <WhatsAppOrder nomor={nomor} id={produk.id} nama={produk.nama} harga={produk.harga} />;
}
