const fs = require('fs');
const puppeteer = require('puppeteer');

const products = [
  {
    name: "MSI MAG Forge 100M Kasa",
    url: "https://www.n11.com/urun/msi-mag-forge-100m-temperli-cam-2x120mm-1x120mm-argb-fan-psu-yok-gaming-siyah-kasa-59165498",
    selector: ".newPrice"
  },
  {
    name: "Vento VG3400S Kasa",
    url: "https://www.n11.com/urun/vento-vg3400s-650w-80-psu-gaming-kasa-74763052",
    selector: ".newPrice"
  },
  // istediğin diğer ürünleri buraya ekle
];

async function scrape() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];

  for (const p of products) {
    try {
      await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 60000 });
      const priceText = await page.$eval(p.selector, el => el.innerText);
      results.push({
        name: p.name,
        link: p.url,
        price: priceText.trim(),
        updatedAt: new Date().toISOString()
      });
      console.log(`${p.name} → ${priceText}`);
    } catch (err) {
      console.log(`${p.name} fiyat çekilemedi:`, err.message);
    }
  }

  await browser.close();
  fs.writeFileSync('data.json', JSON.stringify(results, null, 2));
}

scrape();
