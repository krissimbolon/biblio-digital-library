"use client";
import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import DeskripsiBuku from "@/components/DeskripsiBuku";

export default function FormProduk({ produk = {}, labelTombol, action, kategori = [] }) {
  const [state, formAction, pending] = useActionState(action, { errors: {}, values: null, attempt: 0 });
  const errors = state?.errors || {};
  const values = state?.values || produk;
  const pilihan = kategori.some(k => k.nama === values.kategori) || !values.kategori
    ? kategori : [{ id: "lama", nama: values.kategori }, ...kategori];
  const error = key => errors[key] ? <p role="alert" className="mt-1 text-xs text-bahaya">{errors[key]}</p> : null;
  return (
    <form key={state?.attempt || 0} action={formAction} className="flex max-w-xl flex-col gap-5">
      {errors.form && <p role="alert" className="rounded-md border border-bahaya/40 bg-permukaan p-3 text-sm text-bahaya">{errors.form}</p>}
      <div><Input label="Judul buku" name="nama" defaultValue={values.nama || ""} maxLength={160} required />{error("nama")}</div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><Input label="Harga normal (Rp)" name="harga" type="number" min="1" max="2000000000" step="1" defaultValue={values.harga ?? ""} required />{error("harga")}</div>
        <div><Input label="Harga diskon (Rp)" name="harga_diskon" type="number" min="0" step="1" defaultValue={values.harga_diskon ?? ""} />{error("harga_diskon")}</div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Kategori
          <select name="kategori" defaultValue={values.kategori || ""} className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none">
            <option value="">Tanpa kategori</option>{pilihan.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
          </select>
          {error("kategori")}
        </label>
        <div><Input label="Stok" name="stok" type="number" min="0" step="1" defaultValue={values.stok ?? 10} required />{error("stok")}</div>
      </div>
      <div><Input label="URL sampul" name="foto_url" defaultValue={values.foto_url || ""} placeholder="https://... atau /buku/nama.svg" />{error("foto_url")}</div>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Unggah sampul (JPG, PNG, WebP; maks. 2 MB)
        <input name="sampul_file" type="file" accept="image/jpeg,image/png,image/webp" className="rounded-lg border border-garis bg-latar p-2 text-sm"/>
        {error("sampul_file")}
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Foto galeri tambahan (maks. lima berkas)
        <input name="galeri_files" type="file" multiple accept="image/jpeg,image/png,image/webp" className="rounded-lg border border-garis bg-latar p-2 text-sm"/>
        {error("galeri_files")}
      </label>
      <div><Input label="URL galeri tambahan (satu per baris)" name="galeri_urls" textarea rows={3} defaultValue={values.galeri_urls ?? (produk.galeri || []).join("\n")}/>{error("galeri_urls")}</div>
      <div><Input label="Deskripsi" name="deskripsi" textarea defaultValue={values.deskripsi || ""} maxLength={4000}/>{error("deskripsi")}</div>
      <DeskripsiBuku/>
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" name="aktif" defaultChecked={values.aktif ?? true} className="h-4 w-4 accent-[var(--color-utama)]"/>Tampilkan di katalog publik
      </label>
      {produk.id && <a href={"/admin/produk/" + produk.id + "/varian"} className="text-sm font-semibold text-utama underline">Kelola varian dan harga</a>}
      <div className="flex gap-3">
        <Tombol type="submit" disabled={pending}>{pending ? "Menyimpan…" : labelTombol}</Tombol><Tombol href="/admin" varian="garis">Batal</Tombol>
      </div>
    </form>
  );
}
