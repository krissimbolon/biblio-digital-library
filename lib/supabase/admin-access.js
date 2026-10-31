import "server-only";
import { catalogClient } from "@/lib/supabase/catalog";

export async function isAdminAllowed(id) {
  if (!id) return false;
  try {
    const {data,error}=await catalogClient().from("biblio_admins").select("aktif").eq("user_id",id).maybeSingle();
    if(error) return false;
    if(data) return data.aktif===true;
    return !!process.env.BIBLIO_ADMIN_UID && id===process.env.BIBLIO_ADMIN_UID;
  } catch {return false;}
}
