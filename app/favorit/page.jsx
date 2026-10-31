import FavoritesView from "@/components/FavoritesView";
import { productsPage } from "@/lib/supabase/catalog";
export default async function Favorit() {
  let products=[];
  try {products=(await productsPage({size:500})).products} catch {}
  return <section className="py-14">
    <h1 className="mb-8 font-serif text-4xl">Buku favorit</h1>
    <FavoritesView products={products}/>
  </section>;
}
