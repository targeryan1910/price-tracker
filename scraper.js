const puppeteer = require('puppeteer');
const fs = require('fs');

const dataPath = './data.json';
const products = JSON.parse(fs.readFileSync(dataPath));

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (let product of products) {
    try {
      await page.goto(product.link, { waitUntil: 'networkidle2', timeout: 60000 });

      // N11 fiyat seçici
      const priceText = await page.$eval('.newPrice .price', el => el.innerText);
      const price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));

      product.price = price;
      product.updatedAt = new Date().toISOString();

      console.log(`${product.name} → ${price} TL`);
    } catch (err) {
      console.log(`${product.name} fiyat çekilemedi! Hata: ${err.message}`);
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
  await browser.close();
})();
