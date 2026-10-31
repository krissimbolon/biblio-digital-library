"use client";

import { deleteProduct } from "@/app/admin/actions";

export default function DeleteProduct({id,nama}) {
  async function confirmAndDelete(form) {
    if (window.confirm("Hapus buku “"+nama+"” dari katalog?")) {
      await deleteProduct(form);
    }
  }
  return <form action={confirmAndDelete}>
    <input type="hidden" name="id" value={id}/>
    <button type="submit" className="rounded-md border border-garis px-3 py-2 text-xs font-semibold text-bahaya hover:border-bahaya">Hapus</button>
  </form>;
}
