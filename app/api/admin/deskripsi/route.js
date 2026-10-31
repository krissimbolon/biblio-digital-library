import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/server";
import { catalogClient } from "@/lib/supabase/catalog";
import { generateText } from "@/lib/gemini";

export async function POST(request){
  const origin=request.headers.get("origin");
  if(origin&&new URL(origin).host!==request.headers.get("host"))return NextResponse.json({error:"Permintaan tidak diizinkan."},{status:403});
  let user;
  try{({user}=await requireAdmin());}catch{return NextResponse.json({error:"Silakan masuk sebagai administrator."},{status:401});}
  let input;
  try{input=await request.json();}catch{return NextResponse.json({error:"Permintaan tidak valid."},{status:400});}
  const nama=String(input?.nama||"").trim();
  const kategori=String(input?.kategori||"").trim();
  if(!nama||nama.length>160||kategori.length>80)return NextResponse.json({error:"Judul atau kategori tidak valid."},{status:400});
  if(!process.env.GEMINI_API_KEY)return NextResponse.json({error:"Fitur penyusunan deskripsi belum diaktifkan."},{status:503});
  const db=catalogClient();
  const since=new Date(Date.now()-15*60*1000).toISOString();
  const {count,error:rateError}=await db.from("batas_kiriman").select("id",{count:"exact",head:true}).eq("jenis","deskripsi").eq("sumber",user.id).gte("created_at",since);
  if(rateError||count>=5)return NextResponse.json({error:"Batas permintaan tercapai. Coba lagi nanti."},{status:429});
  const {error:logError}=await db.from("batas_kiriman").insert({jenis:"deskripsi",sumber:user.id});
  if(logError)return NextResponse.json({error:"Permintaan belum dapat diproses."},{status:503});
  const prompt="Susun deskripsi katalog buku berbahasa Indonesia dalam 75–110 kata. Gunakan bahasa editorial yang tenang, informatif, dan faktual. Hindari klaim spesifik yang tidak dapat diverifikasi. Berikan hanya isi deskripsinya. Data buku: "+JSON.stringify({judul:nama,kategori});
  const result=await generateText(prompt,400);
  if(result.error)return NextResponse.json({error:result.error==="timeout"?"Permintaan melebihi batas waktu.":"Layanan belum dapat menyusun deskripsi."},{status:503});
  return NextResponse.json({deskripsi:result.text},{headers:{"Cache-Control":"no-store"}});
}
