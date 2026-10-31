# BIBLIO — Pengaturan proyek

## Identitas

- Nama: **BIBLIO**
- Nama lengkap: **Biblio Digital Library**
- Motto: “I have always imagined that Paradise will be a kind of library.” — **Jorge Luis Borges** (1899–1986)
- Deskripsi: Perpustakaan digital untuk menjelajahi pengetahuan, merawat literasi, dan menemukan gagasan yang melampaui zaman.
- Situs: https://biblio-digital-library.vercel.app/

## Basis data

Skrip dijalankan melalui Supabase SQL Editor dengan urutan berikut:

1. `docs/schema.sql` membuat tabel `produk` beserta Row Level Security.
2. `docs/seed-biblio-books.sql` mengisi enam judul awal katalog Biblio.
3. `docs/bonus-analytics.sql` membuat tabel `wa_clicks` untuk hitungan klik pesan WhatsApp per buku.
4. `docs/admin-rls.sql` (opsional) membatasi tambah, ubah, dan hapus `produk` pada UID yang tercatat di `public.biblio_admins`.

## Akun administrator

Akun dibuat melalui Supabase Authentication → Users dengan pendaftaran publik dinonaktifkan. Panel admin hanya terbuka untuk akun yang UID-nya sama dengan `BIBLIO_ADMIN_UID`.

## Variabel lingkungan

`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, dan `BIBLIO_ADMIN_UID` disimpan di pengaturan Vercel serta `.env.local`, di luar repositori.
