import {NextResponse} from "next/server";
import {catalogClient} from "@/lib/supabase/catalog";
export const dynamic="force-dynamic";
export async function GET(){try{const {count,error}=await catalogClient().from("produk").select("id",{count:"exact",head:true});if(error)throw Error("unavailable");return NextResponse.json({status:"ok",items:count??0})}catch{return NextResponse.json({status:"degraded"},{status:503})}}
