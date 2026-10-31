import Link from "next/link";
import { logout } from "@/app/admin/actions";

export default function NavAdmin() {
  return <nav aria-label="Menu admin" className="flex flex-wrap items-center gap-5 border-b border-garis pb-5 text-sm font-medium">
    <Link href="/admin" className="hover:text-utama">Koleksi</Link>
    <Link href="/admin/produk/baru" className="hover:text-utama">Tambah buku</Link>
    <Link href="/admin/kategori" className="hover:text-utama">Kategori</Link>
    <a href="/api/admin/ekspor" className="hover:text-utama">Ekspor CSV</a>
    <Link href="/admin/password" className="hover:text-utama">Ganti password</Link>
    <form action={logout} className="ml-auto"><button type="submit" className="text-teks-lembut hover:text-bahaya">Keluar</button></form>
  </nav>;
}
