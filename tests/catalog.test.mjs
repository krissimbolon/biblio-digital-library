import test from "node:test";
import assert from "node:assert/strict";
import { formatRupiah, hargaAkhir, adaDiskon, slugify, bukuBaru } from "../lib/format.js";

test("harga normal digunakan ketika diskon tidak tersedia",()=>{
  assert.equal(hargaAkhir({harga:95000,harga_diskon:null}),95000);
  assert.equal(adaDiskon({harga:95000,harga_diskon:null}),false);
});
test("harga diskon yang valid digunakan pada kartu dan pesan",()=>{
  assert.equal(hargaAkhir({harga:95000,harga_diskon:75000}),75000);
  assert.equal(adaDiskon({harga:95000,harga_diskon:75000}),true);
});
test("harga diskon lebih tinggi tidak menggantikan harga normal",()=>{
  assert.equal(hargaAkhir({harga:95000,harga_diskon:120000}),95000);
});
test("mata uang menggunakan format Indonesia",()=>{
  assert.match(formatRupiah(45000),/45\.000/);
});
test("slug kategori konsisten untuk tautan",()=>{
  assert.equal(slugify("Fiksi Gotik"),"fiksi-gotik");
  assert.equal(slugify("Édisi & Cetak"),"edisi-cetak");
});
test("label buku baru memakai tanggal katalog",()=>{
  assert.equal(bukuBaru({created_at:new Date().toISOString()}),true);
  assert.equal(bukuBaru({created_at:"2020-01-01T00:00:00.000Z"}),false);
});
