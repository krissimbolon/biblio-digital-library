import {requireAdmin} from "@/lib/supabase/server";
import {NextResponse} from "next/server";

export const dynamic="force-dynamic";
function csvCell(value) {
  let s=String(value??"");
  if (/^[=+@-]/.test(s)) s="'"+s;
  return '"'+s.replace(/"/g,'""')+'"';
}
export async function GET() {
  let supabase;
  try {({supabase}=await requireAdmin())} catch {return new NextResponse("Tidak diizinkan",{status:403})}
  const {data,error}=await supabase.from("produk").select("id,nama,kategori,harga,deskripsi,foto_url").order("id").limit(10000);
  if(error) return new NextResponse("Ekspor gagal",{status:500});
  const cols=["id","nama","kategori","harga","deskripsi","foto_url"];
  const csv="\uFEFF"+cols.join(",")+"\r\n"+(data||[]).map(row=>cols.map(key=>csvCell(row[key])).join(",")).join("\r\n");
  return new NextResponse(csv,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":'attachment; filename="biblio-koleksi.csv"',"Cache-Control":"no-store"}});
}
