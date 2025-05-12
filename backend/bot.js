const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const cron = require('node-cron');
require('dotenv').config();
const { sendEmailAlert } = require('./utils/email');
const Product = require('./models/Product');

const scheduleTime = process.env.SCHEDULE_TIME;

if (!cron.validate(scheduleTime)) {
  console.error('❌ Invalid cron pattern:', scheduleTime);
  process.exit(1);
}

async function checkPrices() {
  const products = await Product.find({ isActive: true });

  for (const product of products) {
    const { url, targetPrice, _id } = product;

    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0...');
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Scrape price
      const priceSelector = '#priceblock_ourprice, #priceblock_dealprice, .a-price-whole';
      const priceText = await page.$eval(priceSelector, el => el.innerText);

      if (!priceText) {
        throw new Error('Price not found on the page.');
      }

      const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));

      // Update both lastCheckedPrice and currentPrice
      await Product.findByIdAndUpdate(_id, {
        lastCheckedPrice: numericPrice,
        currentPrice: numericPrice, // Ensure this is updated
        lastChecked: new Date()
      });

      // Notify if price drops below the target
      if (numericPrice < targetPrice) {
        console.log(`💥 Price dropped for ${product.name}!`);
        await sendEmailAlert(numericPrice, url);
        await Product.findByIdAndUpdate(_id, { lastNotified: new Date() });
      }

      await browser.close();
    } catch (err) {
      console.error(`❌ Failed for product ${product.name}:`, err.message);
    }
  }
}

cron.schedule(scheduleTime, () => {
  console.log(`⏰ Checking prices at ${new Date().toLocaleTimeString()}`);
  checkPrices();
});

async function checkPriceNow() {
  await checkPrices();
}

module.exports = { checkPriceNow };
