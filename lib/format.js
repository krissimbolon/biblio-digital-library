export function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

export function hargaAkhir(produk) {
  const diskon = Number(produk?.harga_diskon);
  const harga = Number(produk?.harga) || 0;
  return Number.isFinite(diskon) && produk?.harga_diskon !== null && diskon < harga ? diskon : harga;
}

export function adaDiskon(produk) {
  return hargaAkhir(produk) < (Number(produk?.harga) || 0);
}

export function slugify(teks) {
  return String(teks || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export function bukuBaru(produk, hari = 30) {
  const dibuat = new Date(produk?.created_at || 0).getTime();
  return dibuat > 0 && Date.now() - dibuat < hari * 86400000;
}
