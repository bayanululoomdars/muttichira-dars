const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://muttichira-dars.onrender.com', { waitUntil: 'networkidle2' });
  
  const newsHtml = await page.evaluate(() => {
    const el = document.getElementById('dynamicNews');
    return el ? el.innerHTML : 'NOT_FOUND';
  });
  
  console.log("HTML in dynamicNews:");
  console.log(newsHtml);
  
  await browser.close();
})();
