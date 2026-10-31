"use client";
import { useActionState } from "react";
import { importCSV } from "@/app/admin/impor/actions";

export default function ImportCSVForm() {
  const [result,action,pending]=useActionState(importCSV,null);
  return <div className="space-y-5">
    <form action={action} className="flex max-w-lg flex-col gap-4 rounded-lg border border-garis p-5">
      <label className="text-sm font-semibold">Berkas CSV (maksimal 1 MB, 250 baris)
        <input type="file" name="csv" accept=".csv,text/csv" required className="mt-2 block w-full rounded-md border border-garis p-3"/>
      </label>
      <button disabled={pending} type="submit" className="rounded-md bg-utama px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending?"Membaca berkas…":"Impor buku"}</button>
    </form>
    {result&&<section role="status" className="max-w-2xl space-y-3 rounded-lg border border-garis bg-permukaan p-5">
      <h2 className="font-serif text-xl">Hasil impor</h2>
      <p>{result.ok} buku berhasil, {result.fail} baris gagal.</p>
      {result.errors?.length>0&&<ul className="max-h-80 list-disc space-y-1 overflow-auto pl-5 text-sm text-bahaya">{result.errors.map((v,i)=><li key={i}>{v}</li>)}</ul>}
    </section>}
  </div>;
}
