-- Enam judul awal katalog Biblio, menggantikan produk contoh bawaan template.
BEGIN;
UPDATE public.produk SET nama = 'Pride and Prejudice', harga = 49000, deskripsi = 'Novel klasik Jane Austen tentang Elizabeth Bennet, keluarga, reputasi, dan prasangka dalam masyarakat Inggris.', foto_url = '/buku/pride-and-prejudice.svg', kategori = 'Roman klasik' WHERE nama = 'Kopi Bubuk Robusta 250 g';
UPDATE public.produk SET nama = 'Frankenstein', harga = 54000, deskripsi = 'Kisah Mary Shelley tentang penciptaan, tanggung jawab, dan batas pengetahuan manusia.', foto_url = '/buku/frankenstein.svg', kategori = 'Fiksi gotik' WHERE nama = 'Keripik Singkong Balado';
UPDATE public.produk SET nama = 'Jane Eyre', harga = 52000, deskripsi = 'Novel Charlotte Brontë tentang kemandirian, moralitas, dan pencarian tempat dalam masyarakat.', foto_url = '/buku/jane-eyre.svg', kategori = 'Roman klasik' WHERE nama = 'Sambal Bawang Botol 150 ml';
UPDATE public.produk SET nama = 'Moby-Dick', harga = 59000, deskripsi = 'Petualangan pelayaran Herman Melville yang menjelajahi obsesi, nasib, dan alam.', foto_url = '/buku/moby-dick.svg', kategori = 'Sastra klasik' WHERE nama = 'Kue Nastar Toples 500 g';
UPDATE public.produk SET nama = 'The Picture of Dorian Gray', harga = 51000, deskripsi = 'Novel Oscar Wilde tentang kecantikan, moralitas, dan konsekuensi sebuah kehidupan ganda.', foto_url = '/buku/dorian-gray.svg', kategori = 'Sastra klasik' WHERE nama = 'Tas Anyaman Pandan';
UPDATE public.produk SET nama = 'Dracula', harga = 55000, deskripsi = 'Novel gotik Bram Stoker tentang Count Dracula dan ancaman yang mengikuti perjalanannya.', foto_url = '/buku/dracula.svg', kategori = 'Fiksi gotik' WHERE nama = 'Kain Batik Cap 2 m';
COMMIT;
SELECT id,nama,kategori,harga,foto_url FROM public.produk ORDER BY id LIMIT 12;
