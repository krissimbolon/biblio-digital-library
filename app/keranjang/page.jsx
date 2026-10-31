export const dynamic = "force-dynamic";
import CartView from "@/components/CartView";
import { allProducts } from "@/lib/supabase/catalog";
import { getToko } from "@/lib/supabase/store";

export const metadata = { title: "Keranjang | Biblio" };
export default async function Keranjang() {
  const [produk,toko]=await Promise.all([allProducts(),getToko()]);
  return <section className="py-12">
    <h1 className="mb-8 font-serif text-4xl">Keranjang buku</h1>
    <CartView produk={produk} nomor={toko.nomorWhatsApp}/>
  </section>;
}
