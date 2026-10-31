"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";
import { catalogClient } from "@/lib/supabase/catalog";

function parseCSV(text) {
  const rows=[];
  let cell="",cells=[],quoted=false,rowStart=1,line=1;
  const source=text.replace(/^\uFEFF/,"");
  for(let i=0;i<source.length;i++){
    const ch=source[i];
    if(ch==='"'){
      if(quoted&&source[i+1]==='"'){cell+='"';i++;}
      else if(quoted)quoted=false;
      else if(cell==="")quoted=true;
      else throw new Error("Format tanda kutip CSV tidak valid");
    }else if(ch===","&&!quoted){cells.push(cell);cell="";}
    else if((ch==="\n"||ch==="\r")&&!quoted){
      cells.push(cell);if(cells.some(x=>x.trim()))rows.push({line:rowStart,cells});
      if(ch==="\r"&&source[i+1]==="\n")i++;
      line++;rowStart=line;cell="";cells=[];
    }else{cell+=ch;if(ch==="\n")line++;}
  }
  if(quoted)throw new Error("Tanda kutip CSV belum ditutup");
  cells.push(cell);if(cells.some(x=>x.trim()))rows.push({line:rowStart,cells});
  return rows;
}
function int(value,defaultValue=null) {
  const text=String(value??"").trim();
  if(text==="")return defaultValue;
  if(!/^\d+$/.test(text))return NaN;
  return Number(text);
}
export async function importCSV(_previous,form) {
  await requireAdmin();
  const file=form.get("csv");
  if(!file||typeof file.text!=="function"||file.size<1||file.size>1024*1024)
    return {ok:0,fail:1,errors:["Ukuran berkas harus antara 1 byte dan 1 MB."]};
  let rows;
  try {rows=parseCSV(await file.text());}catch(e){return {ok:0,fail:1,errors:[e.message]};}
  if(rows.length<2)return {ok:0,fail:1,errors:["Berkas tidak berisi baris data."]};
  if(rows.length>251)return {ok:0,fail:rows.length-1,errors:["Maksimal 250 baris data per unggahan."]};
  const names=rows[0].cells.map(x=>x.trim().toLowerCase());
  const required=["nama","harga"];
  if(required.some(x=>!names.includes(x))||new Set(names).size!==names.length)
    return {ok:0,fail:rows.length-1,errors:["Header wajib: nama, harga. Nama kolom tidak boleh berulang."]};
  const insert=[],errors=[];
  for(const row of rows.slice(1)){
    const obj=Object.fromEntries(names.map((name,i)=>[name,row.cells[i]??""]));
    const nama=String(obj.nama||"").trim();
    const harga=int(obj.harga);
    const stok=int(obj.stok,10);
    const diskon=int(obj.harga_diskon);
    const foto=String(obj.foto_url||"").trim();
    if(row.cells.length!==names.length||!nama||nama.length>160||!Number.isSafeInteger(harga)||harga<0||harga>2000000000||!Number.isSafeInteger(stok)||stok<0||stok>100000||(diskon!==null&&(!Number.isSafeInteger(diskon)||diskon<0||diskon>=harga))||(foto&&!(foto.startsWith("https://")||(foto.startsWith("/")&&!foto.startsWith("//"))))) {
      errors.push("Baris "+row.line+": nama, harga, stok, harga diskon, atau URL tidak valid.");continue;
    }
    insert.push({nama,harga,stok,harga_diskon:diskon,foto_url:foto||null,kategori:String(obj.kategori||"").trim().slice(0,80)||null,deskripsi:String(obj.deskripsi||"").trim().slice(0,4000),aktif:String(obj.aktif||"true").toLowerCase()!=="false"});
  }
  if(!insert.length)return {ok:0,fail:errors.length,errors};
  const db=catalogClient();
  const {data:last}=await db.from("produk").select("urutan").order("urutan",{ascending:false}).limit(1).maybeSingle();
  const start=Number(last?.urutan)||0;
  const {error}=await db.from("produk").insert(insert.map((row,i)=>({...row,urutan:start+i+1})));
  if(error)return {ok:0,fail:errors.length+insert.length,errors:[...errors,"Penyimpanan data valid gagal: "+error.message]};
  const {user}=await requireAdmin();
  await db.from("admin_log").insert({admin_id:user.id,admin_email:user.email,aksi:"Impor CSV",target:insert.length+" buku"});
  revalidatePath("/");
  revalidatePath("/admin");
  return {ok:insert.length,fail:errors.length,errors};
}
