# BIBLIO — Biblio Digital Library

Perpustakaan digital independen untuk menjelajahi koleksi buku dan memesan edisi cetak melalui WhatsApp. Proyek Creative Hub App Talent (CHAT) Ekraf 2026, dibangun dari template `andixurniawan/katalog-umkm`.

> “I have always imagined that Paradise will be a kind of library.” — **Jorge Luis Borges**

**Situs:** https://biblio-digital-library.vercel.app/

## Halaman

| Rute | Fungsi |
|---|---|
| `/` | Katalog buku dengan pencarian, filter kategori, pengurutan, paginasi, dan buku terakhir dilihat |
| `/produk/[id]` | Detail buku, pilihan jumlah eksemplar, pemesanan WhatsApp, tombol bagikan, favorit, dan buku terkait |
| `/favorit` | Daftar buku favorit yang tersimpan di peramban |
| `/tentang` | Profil Biblio dan informasi layanan |
| `/admin/login` | Masuk administrator |
| `/admin` | Kelola koleksi: daftar, pencarian, ringkasan per kategori, dan lima buku dengan klik pesan terbanyak |
| `/admin/produk/baru`, `/admin/produk/[id]/ubah` | Tambah dan ubah data buku |
| `/admin/password` | Ganti password administrator |
| `/api/admin/ekspor` | Ekspor katalog ke CSV |

## Teknologi

Next.js 16 (App Router), React 19, Tailwind CSS 4, Supabase Auth dan PostgreSQL, serta Vercel. Seluruh akses Supabase berjalan di server melalui Server Component, Server Action, dan Route Handler. Rute `/admin` dilindungi `proxy.js`, dan setiap aksi yang mengubah data memeriksa sesi administrator di server.

## Basis data

| Berkas | Isi |
|---|---|
| `docs/schema.sql` | Tabel `produk` dan Row Level Security |
| `docs/seed-biblio-books.sql` | Enam judul awal katalog Biblio |
| `docs/bonus-analytics.sql` | Tabel `wa_clicks` untuk hitungan klik pesan per buku |
| `docs/admin-rls.sql` | Kebijakan tulis `produk` khusus UID administrator terdaftar (opsional) |

## Variabel lingkungan

`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, dan `BIBLIO_ADMIN_UID` (UID akun Supabase Auth yang diizinkan membuka panel admin). Semuanya hanya dibaca di server; format contoh tersedia di `.env.example`.

## Pengembangan lokal

```bash
npm ci
npm run dev
```

## Tentang aplikasi ini

- **Nama usaha:** BIBLIO — Biblio Digital Library
- **Pembuat:** Christian Simbolon
- **Link aplikasi:** https://biblio-digital-library.vercel.app/
- **Fitur bonus yang dikerjakan:** US-07 sampai US-13, US-15 sampai US-17, US-22 sampai US-28, US-30, US-33 sampai US-36, US-40, US-41, K-6, K-8, K-9, K-10, dan K-12.
