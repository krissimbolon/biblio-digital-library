import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const origin = "https://biblio-digital-library.vercel.app";
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const checks = [];
async function check(label, fn) {
  await fn();
  checks.push(label);
  process.stdout.write("OK " + label + "\n");
}
async function ready(page) {
  for (let attempt = 0; attempt < 24; attempt++) {
    try {
      await page.goto(origin + "/", { waitUntil: "domcontentloaded", timeout: 20000 });
      const header = await page.locator("header").innerText();
      if (header.includes("BIBLIO") && !header.includes("Digital Library") && !(await page.locator("body").innerText()).includes("Koleksi pilihan · Sastra dan literasi")) return;
    } catch {}
    await page.waitForTimeout(5000);
  }
  throw new Error("Halaman produksi belum memuat tampilan terkini.");
}

try {
  const context = await browser.newContext({ viewport: {width: 1366, height: 900}, permissions: ["clipboard-read","clipboard-write"] });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await ready(page);
  await check("Logo BIBLIO dan informasi katalog", async()=>{
    const header = await page.locator("header").innerText();
    assert.match(header, /BIBLIO/);
    assert.ok(!header.includes("Digital Library"));
    assert.ok(!((await page.locator("body").innerText()).includes("Koleksi pilihan · Sastra dan literasi")));
    assert.ok(await page.locator("#koleksi").count());
    assert.ok(await page.locator("#tentang").count());
  });
  await check("Tema gelap dan terang", async()=>{
    await page.getByRole("button",{name:"Aktifkan mode gelap"}).click();
    await page.waitForFunction(()=>document.documentElement.dataset.theme==="dark");
    await page.reload({waitUntil:"domcontentloaded"});
    await page.waitForFunction(()=>document.documentElement.dataset.theme==="dark");
    await page.getByRole("button",{name:"Aktifkan mode terang"}).click();
    await page.waitForFunction(()=>document.documentElement.dataset.theme==="light");
  });
  await check("Tautan koleksi dan tentang", async()=>{
    await page.locator('main a[href="#koleksi"]').first().click();
    await page.waitForURL(url => url.hash === "#koleksi");
    await page.locator('main a[href="#tentang"]').first().click();
    await page.waitForURL(url => url.hash === "#tentang");
  });
  await check("Pencarian judul", async()=>{
    await page.locator('#koleksi input[name="q"]').fill("Frankenstein");
    await page.locator('#koleksi button[type="submit"]').click();
    await page.waitForURL(url=>url.searchParams.get("q")==="Frankenstein");
    assert.ok(await page.locator('#koleksi a[href^="/produk/"]').count() >= 1);
  });
  await check("Urutan katalog dan keadaan tanpa hasil", async()=>{
    await page.goto(origin+"/",{waitUntil:"domcontentloaded"});
    await page.locator('#koleksi select[name="urut"]').selectOption("termurah");
    await page.locator('#koleksi button[type="submit"]').click();
    await page.waitForURL(url=>url.searchParams.get("urut")==="termurah");
    assert.equal(await page.locator('#koleksi select[name="urut"]').inputValue(),"termurah");
    await page.locator('#koleksi input[name="q"]').fill("judul-tidak-ada-987654");
    await page.locator('#koleksi button[type="submit"]').click();
    await page.getByText("Tidak ada buku yang sesuai dengan pencarian atau kategori pilihan.").waitFor({state:"visible"});
    await page.getByRole("link",{name:"Tampilkan semua koleksi"}).click();
    await page.waitForURL(url=>!url.searchParams.has("q"));
  });
  let detail;
  await check("Kartu buku dan tombol keranjang", async()=>{
    detail = await page.locator('#koleksi a[href^="/produk/"]').first().getAttribute("href");
    assert.match(detail,/^\/produk\/\d+$/);
    await page.locator('#koleksi').getByRole("button",{name:"+ Keranjang"}).first().click();
    await page.getByRole("link",{name:"Lihat keranjang"}).first().click();
    await page.waitForURL(/\/keranjang/);
    assert.ok(await page.getByRole("heading",{name:"Keranjang buku"}).isVisible());
    const qty=page.locator('main input[type="number"]').first();
    await qty.fill("2");
    await qty.press("Tab");
    await page.reload({waitUntil:"domcontentloaded"});
    assert.equal(await page.locator('main input[type="number"]').first().inputValue(),"2");
    const wa=page.getByRole("link",{name:"Pesan semua via WhatsApp"});
    const href=await wa.getAttribute("href");
    assert.ok(href.startsWith("https://wa.me/"));
    assert.ok(decodeURIComponent(href).includes("text="));
    await page.getByRole("button",{name:"Kosongkan keranjang"}).click();
    assert.ok(await page.getByText(/Keranjang belum berisi buku/).isVisible());
  });
  await check("Tombol bandingkan dan penghapusan", async()=>{
    await page.goto(origin+"/",{waitUntil:"domcontentloaded"});
    await page.locator('#koleksi').getByRole("button",{name:"Bandingkan"}).first().click();
    await page.getByRole("link",{name:"Lihat perbandingan"}).first().click();
    await page.waitForURL(/\/bandingkan/);
    assert.ok((await page.locator("main").innerText()).includes("1/2 pilihan"));
    await page.getByRole("button",{name:"Hapus pilihan"}).first().click();
    assert.ok(await page.getByText("Belum ada buku untuk dibandingkan. Gunakan tombol Bandingkan di katalog.").isVisible());
  });
  await check("Favorit, detail buku, dan tautan pemesanan", async()=>{
    await page.goto(origin+detail,{waitUntil:"domcontentloaded"});
    assert.ok(await page.locator("h1").count());
    const wa=page.getByRole("link",{name:"Pesan via WhatsApp"});
    const href=await wa.getAttribute("href");
    assert.ok(href?.startsWith("https://wa.me/"));
    assert.ok(href.includes("text="));
    await page.getByRole("button",{name:/Simpan favorit/}).click();
    await page.getByRole("button",{name:/Tersimpan/}).waitFor({state:"visible"});
    await page.goto(origin+"/favorit",{waitUntil:"domcontentloaded"});
    await page.getByRole("button",{name:"Hapus favorit"}).waitFor({state:"visible"});
    await page.getByRole("button",{name:"Hapus favorit"}).click();
    await page.getByText(/Belum ada buku favorit/).waitFor({state:"visible"});
  });
  await check("Bagikan buku dan validasi ulasan", async()=>{
    await page.goto(origin+detail,{waitUntil:"domcontentloaded"});
    await page.getByRole("button",{name:"Bagikan buku"}).click();
    assert.ok((await page.getByRole("status").allTextContents()).some(s=>/Link tersalin|Tautan berhasil dibagikan|belum dapat dibagikan/.test(s)));
    await page.getByRole("button",{name:"Kirim ulasan"}).click();
    assert.ok(await page.locator('input[name="nama"]').evaluate(el=>el.validity.valueMissing));
  });
  await check("Kategori dan halaman administrator", async()=>{
    await page.goto(origin + detail, {waitUntil:"domcontentloaded"});
    const category = page.locator('article a[href^="/kategori/"]').first();
    const href = await category.getAttribute("href");
    assert.ok(href?.startsWith("/kategori/"));
    await category.click();
    await page.waitForURL(url=>url.pathname===href);
    assert.ok(await page.locator('main h1').count());
    await page.locator('header a[href="/admin/login"]').click();
    await page.waitForURL(/\/admin\/login/);
    await page.getByRole("heading",{name:"Masuk administrator"}).waitFor({state:"visible"});
    await page.getByRole("link",{name:"Kembali ke katalog"}).click();
    await page.waitForURL(url=>url.pathname==="/");
    const wa = await page.locator('footer a[href^="https://wa.me/"]').first().getAttribute("href");
    assert.ok(wa?.includes("text="));
  });
  if (process.env.BIBLIO_CHECK_PERTANYAAN === "1") {
  await check("Pertanyaan buku", async()=>{
    await page.goto(origin + detail, {waitUntil:"domcontentloaded"});
    await page.locator("#pertanyaan-buku").fill("Apa kategori buku ini?");
    const [response] = await Promise.all([
      page.waitForResponse(x=>x.url().endsWith("/api/produk/tanya")&&x.request().method()==="POST",{timeout:30000}),
      page.getByRole("button",{name:"Kirim pertanyaan"}).click()
    ]);
    const data=await response.json();
    if (!response.ok()) throw new Error("Layanan pertanyaan buku: HTTP "+response.status()+" - "+String(data.error||"Tidak tersedia").slice(0,180));
    assert.ok(typeof data.jawaban==="string"&&data.jawaban.length>10);
    const jawaban = page.locator('form:has(#pertanyaan-buku) [role="status"]');
    await jawaban.waitFor({state:"visible"});
    assert.equal((await jawaban.innerText()).trim(),data.jawaban.trim());
  });
  }
  await check("Navigasi seluler dan lebar halaman", async()=>{
    const mobile = await browser.newContext({viewport:{width:375,height:812},isMobile:true,hasTouch:true});
    const p=await mobile.newPage();
    await p.goto(origin+"/",{waitUntil:"domcontentloaded"});
    const menu=p.getByRole("button",{name:"Buka navigasi"});
    assert.ok(await menu.isVisible());
    await menu.click();
    assert.ok(await p.getByRole("navigation",{name:"Navigasi seluler"}).isVisible());
    await p.getByRole("navigation",{name:"Navigasi seluler"}).getByRole("link",{name:"Keranjang"}).click();
    await p.waitForURL(/\/keranjang/);
    const overflow = await p.evaluate(()=>document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 2, "Layar seluler melebar sebesar " + overflow + " px");
    await mobile.close();
  });
  assert.deepEqual(pageErrors,[],"Kesalahan JavaScript pada halaman: "+pageErrors.join("; "));
  process.stdout.write("Selesai: "+checks.length+" kelompok pemeriksaan.\n");
  await context.close();
} finally {
  await browser.close();
}
