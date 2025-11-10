// scraper.js
const puppeteer = require('puppeteer');
const fs = require('fs');

const products = [
  "https://www.n11.com/urun/msi-mag-forge-100m-temperli-cam-2x120mm-1x120mm-argb-fan-psu-yok-gaming-siyah-kasa-59165498",
  "https://www.n11.com/urun/vento-vg3400s-650w-80-psu-gaming-kasa-74763052",
  "https://www.n11.com/urun/hiper-zoe-gaming-rainbow-mid-atx-750w-80-bronz-psu-kasa-57557871"
];

async function scrape() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  for (const url of products) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

      const name = await page.$eval('.proName', el => el.innerText.trim());
      const price = await page.$eval('.newPrice', el => el.innerText.replace(/\s/g, ''));
      let oldPrice = null;
      try {
        oldPrice = await page.$eval('.oldPrice', el => el.innerText.replace(/\s/g, ''));
      } catch {}

      results.push({
        name,
        url,
        priceDisplay: price,
        oldPriceDisplay: oldPrice,
        updatedAt: new Date().toISOString()
      });

      console.log(`✅ ${name} → ${price}`);
    } catch (err) {
      console.error(`❌ Hata ${url}: ${err.message}`);
    }
  }

  await browser.close();

  fs.writeFileSync('data.json', JSON.stringify(results, null, 2), 'utf-8');
  console.log('data.json başarıyla oluşturuldu!');
}

scrape();
