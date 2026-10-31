import CompareView from "@/components/CompareView";
import { productsPage } from "@/lib/supabase/catalog";

export const metadata={title:"Bandingkan Buku | Biblio"};
export default async function Bandingkan() {
  const produk=(await productsPage({size:500})).products;
  return <section className="py-12"><h1 className="mb-8 font-serif text-4xl">Bandingkan buku</h1><CompareView produk={produk}/></section>;
}
