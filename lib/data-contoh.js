// Koleksi pratinjau sebelum US-01 terhubung ke Supabase.
// Harga ilustratif untuk pengembangan; bukan penawaran jual riil.
// Data server akan menggantikannya pada Langkah 9 worksheet.
export const produkContoh = [
  {
    "id": 1,
    "nama": "Pride and Prejudice",
    "penulis": "Jane Austen · 1813",
    "harga": 49000,
    "deskripsi": "Novel klasik Jane Austen tentang Elizabeth Bennet, keluarga, reputasi, dan prasangka dalam masyarakat Inggris.",
    "foto_url": "/buku/pride-and-prejudice.svg",
    "kategori": "Roman klasik"
  },
  {
    "id": 2,
    "nama": "Frankenstein",
    "penulis": "Mary Shelley · 1818",
    "harga": 54000,
    "deskripsi": "Kisah Mary Shelley tentang penciptaan, tanggung jawab, dan batas pengetahuan manusia.",
    "foto_url": "/buku/frankenstein.svg",
    "kategori": "Fiksi gotik"
  },
  {
    "id": 3,
    "nama": "Jane Eyre",
    "penulis": "Charlotte Brontë · 1847",
    "harga": 52000,
    "deskripsi": "Novel Charlotte Brontë tentang kemandirian, moralitas, dan pencarian tempat dalam masyarakat.",
    "foto_url": "/buku/jane-eyre.svg",
    "kategori": "Roman klasik"
  },
  {
    "id": 4,
    "nama": "Moby-Dick",
    "penulis": "Herman Melville · 1851",
    "harga": 59000,
    "deskripsi": "Petualangan pelayaran Herman Melville yang menjelajahi obsesi, nasib, dan alam.",
    "foto_url": "/buku/moby-dick.svg",
    "kategori": "Sastra klasik"
  },
  {
    "id": 5,
    "nama": "The Picture of Dorian Gray",
    "penulis": "Oscar Wilde · 1890",
    "harga": 51000,
    "deskripsi": "Novel Oscar Wilde tentang kecantikan, moralitas, dan konsekuensi sebuah kehidupan ganda.",
    "foto_url": "/buku/dorian-gray.svg",
    "kategori": "Sastra klasik"
  },
  {
    "id": 6,
    "nama": "Dracula",
    "penulis": "Bram Stoker · 1897",
    "harga": 55000,
    "deskripsi": "Novel gotik Bram Stoker tentang Count Dracula dan ancaman yang mengikuti perjalanannya.",
    "foto_url": "/buku/dracula.svg",
    "kategori": "Fiksi gotik"
  }
];

export function cariProdukContoh(id) {
  return produkContoh.find((produk) => String(produk.id) === String(id));
}
