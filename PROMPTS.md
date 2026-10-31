# Jurnal Prompt

Catatan prompt utama selama membangun Biblio Digital Library, hasil yang diperoleh, dan perbaikan yang dilakukan. Kriteria setiap fitur mengacu pada `docs/user-stories.md`.

## US-01 Katalog dari database

**Prompt:** Sambungkan katalog di `app/page.jsx` ke tabel `produk` Supabase dari sisi server memakai `SUPABASE_URL` dan `SUPABASE_SECRET_KEY`. Tampilkan dengan `KartuProduk`, beri pesan error yang jelas bila data gagal dimuat dan tulisan kosong bila tabel belum berisi.

**Hasil:** Beranda menampilkan buku dari tabel `produk`; perubahan nama di Table Editor langsung terlihat setelah halaman dimuat ulang.

**Perbaikan:** Nilai `SUPABASE_URL` di Vercel memakai alamat proyek tanpa akhiran `/rest/v1/`.

## US-02 Detail produk

**Prompt:** Ambil satu buku dari tabel `produk` berdasarkan `id` di URL pada `app/produk/[id]/page.jsx`, dari sisi server, dan panggil `notFound()` bila buku tidak ditemukan.

**Hasil:** Halaman detail menampilkan sampul, kategori, judul, harga, dan deskripsi dari database; ID yang tidak ada membuka halaman tidak ditemukan.

**Perbaikan:** Menambahkan metadata judul dan deskripsi per buku.

## US-03 Pesan via WhatsApp

**Prompt:** Jadikan `components/TombolWhatsApp.jsx` tautan `https://wa.me/` ke nomor di `lib/toko.js` dengan pesan otomatis berisi nama dan harga buku dalam format rupiah, di-encode dengan `encodeURIComponent`, dan dibuka di tab baru.

**Hasil:** Tombol "Pesan via WhatsApp" membuka WhatsApp ke nomor Biblio dengan pesan berisi judul, harga satuan, jumlah, dan total.

**Perbaikan:** Nomor layanan diisi di `lib/toko.js` dan tombol membaca nomor langsung dari berkas tersebut.

## US-04 Login admin

**Prompt:** Buat login admin dengan Supabase Auth (email dan password) memakai `@supabase/ssr` dan cookie, diproses Server Action di `app/admin/actions.js`. Login berhasil menuju `/admin`, gagal menampilkan pesan error, dan tombol Keluar mengakhiri sesi.

**Hasil:** Login dengan akun admin menuju `/admin`; password salah menampilkan pesan error; Keluar kembali ke `/admin/login`.

**Perbaikan:** Menambahkan pesan khusus saat percobaan masuk dibatasi dan merapikan tampilan halaman masuk dengan ikon pada kolom email dan password.

## US-05 Ganti password

**Prompt:** Buat Server Action ganti password untuk admin yang sedang login dengan validasi server: minimal 8 karakter dan sama dengan konfirmasi. Tampilkan pesan berhasil atau error yang jelas di `/admin/password`.

**Hasil:** Password admin berhasil diganti dari halaman `/admin/password`; isian kurang dari 8 karakter atau konfirmasi berbeda ditolak dengan pesan yang jelas.

**Perbaikan:** Menambahkan pesan untuk password baru yang sama dengan password lama.

## US-06 Proteksi halaman admin

**Prompt:** Buat `proxy.js` di root proyek agar semua rute `/admin` kecuali `/admin/login` wajib login, dan pastikan setiap Server Action yang mengubah data memeriksa login di server.

**Hasil:** Membuka `/admin` dan `/admin/password` tanpa login dialihkan ke `/admin/login`.

**Perbaikan:** Akses admin dibatasi pada satu UID melalui `BIBLIO_ADMIN_UID`.

## Fitur bonus

Fitur bonus dikerjakan per user story dan dicatat pada pesan commit dengan format `US-xx` dan `K-xx`.

## US-18, US-29, US-48 — Foto dan varian

**Fitur:** Galeri sampul, berkas foto dengan batas 2 MB dan pemeriksaan format, serta varian harga untuk setiap buku.

**Kriteria:** Foto tersimpan di bucket `sampul`; varian ikut tercantum dalam pesan WhatsApp.

## US-21, US-37, US-38, US-39 — Interaksi pembaca

**Fitur:** Keranjang lintas halaman, perbandingan dua buku, ulasan dengan rating, dan moderasi administrator.

**Kriteria:** Jumlah dan total keranjang mengikuti data katalog; ulasan yang disembunyikan tidak masuk rata-rata rating.

## US-42 sampai US-46 — Administrasi katalog

**Fitur:** Banner promo, pengaturan toko, undangan dan status administrator, catatan aktivitas, dan impor koleksi CSV.

**Kriteria:** Akses melalui sesi administrator, informasi toko dari database, serta validasi baris CSV dan ringkasan impor.

## US-14 dan US-50 — Deskripsi dan tanya jawab

**Fitur:** Deskripsi buku berbasis judul dan kategori; pertanyaan singkat berdasarkan informasi buku di katalog.

**Kriteria:** Layanan diproses dari server dengan `GEMINI_API_KEY`, panjang input dibatasi, pembatasan frekuensi diberlakukan, dan kegagalan ditampilkan kepada pengguna.

## K-1 sampai K-13 — Keamanan dan ketersediaan

**Fitur:** Otentikasi server, pembatasan peran administrator, validasi data, pembatasan unggah, kebijakan header keamanan, pemeriksaan fungsi database, dan halaman tidak ditemukan.

**Kriteria:** Kunci rahasia hanya di server; pemeriksaan akses dilakukan di setiap operasi mutasi; respons HTTP dan fungsi publik dapat diuji melalui rute masing-masing.
