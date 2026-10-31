# BIBLIO — Biblio Digital Library

Katalog buku digital independen untuk menjelajahi karya sastra, menyimpan favorit, membandingkan edisi, membaca ulasan, dan memesan edisi cetak melalui WhatsApp.

**Situs:** https://biblio-digital-library.vercel.app/

## Katalog publik

| Halaman | Kegunaan |
| --- | --- |
| `/` | Katalog, pencarian, kategori, urutan, banner, buku terakhir dilihat |
| `/produk/[id]` | Sampul dan galeri, harga, varian, stok, pemesanan, ulasan, pertanyaan buku |
| `/kategori/[slug]` | Katalog per kategori |
| `/keranjang` | Jumlah dan ringkasan beberapa buku untuk satu pesan WhatsApp |
| `/bandingkan` | Perbandingan dua buku |
| `/favorit` | Buku tersimpan di peramban |
| `/tentang` | Profil dan informasi layanan |

## Administrasi

| Halaman | Kegunaan |
| --- | --- |
| `/admin` | Dashboard koleksi, statistik dan minat pemesanan |
| `/admin/produk/baru` | Buku baru, harga, stok, sampul, galeri, dan deskripsi |
| `/admin/produk/[id]/ubah` | Perubahan buku |
| `/admin/produk/[id]/varian` | Pilihan edisi dan harga |
| `/admin/kategori` | Kelola kategori |
| `/admin/ulasan` | Moderasi ulasan |
| `/admin/banner` | Penawaran dan pengumuman |
| `/admin/toko` | Identitas dan kontak toko |
| `/admin/admins` | Undangan dan status administrator |
| `/admin/aktivitas` | 50 aktivitas terakhir |
| `/admin/impor` | Impor koleksi CSV |
| `/admin/password` | Ubah password |
| `/api/admin/ekspor` | Ekspor CSV |

## Teknologi dan data

Next.js 16, React 19, Tailwind CSS 4, Supabase PostgreSQL/Auth/Storage, dan Vercel.

Skema dasar tersedia di `docs/schema.sql`, sementara fitur katalog lanjutan terdapat di `docs/biblio-fitur.sql`. RLS digunakan pada tabel operasional. Katalog diambil oleh server; kredensial rahasia tidak dipublikasikan ke browser.

## Konfigurasi

Variabel lingkungan server: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `BIBLIO_ADMIN_UID`. Untuk deskripsi buku dan tanya jawab berbasis Gemini, tambahkan `GEMINI_API_KEY` pada lingkungan Vercel Production. Jika kunci tidak tersedia, kedua layanan menampilkan pesan ketidaktersediaan.

Berkas contoh: `.env.example`.

## Impor CSV

Header wajib: `nama,harga`. Header opsional: `kategori,deskripsi,foto_url,stok,harga_diskon,aktif`. Ukuran maksimum 1 MB atau 250 baris data per unggahan. Baris bermasalah dilaporkan dengan nomor baris.

## Penggunaan lokal

```bash
npm ci
npm run dev
```

## Biblio

Ruang untuk buku, pengetahuan, dan ide-ide yang melampaui zaman.

Dibuat dengan sepenuh hati oleh Chris Simbolon.

## Kebijakan keamanan

Aturan akses database dan pembatasan permintaan tercantum dalam `docs/biblio-security.sql`. Halaman administrator hanya tersedia untuk akun aktif yang telah tercatat. Kebijakan keamanan konten halaman menggunakan nonce per permintaan. Pengujian akses, pembatasan kiriman, dan dependensi tercantum di `docs/checklist-keamanan.md`.

## Ringkasan minat koleksi

Jumlah klik pemesanan per buku dihitung melalui view `public.biblio_click_totals` sesuai `docs/biblio-analytics.sql`. Ringkasan hanya menampilkan produk yang tercatat dalam katalog dan tidak memuat identitas pengunjung.
