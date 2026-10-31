import "server-only";
import { catalogClient } from "@/lib/supabase/catalog";
import { toko } from "@/lib/toko";

export async function getToko() {
  try {
    const {data,error}=await catalogClient().from("pengaturan_toko").select("nama,nomor_whatsapp,alamat,jam_buka").eq("id",1).maybeSingle();
    if(error||!data)return toko;
    return {
      ...toko,
      nama:data.nama||toko.nama,
      nomorWhatsApp:data.nomor_whatsapp||toko.nomorWhatsApp,
      alamat:data.alamat||toko.alamat,
      jamBuka:data.jam_buka === "Koleksi pilihan · Sastra dan literasi" ? "" : (data.jam_buka || toko.jamBuka),
    };
  } catch {return toko;}
}
