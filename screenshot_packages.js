const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/packages/adventure-and-highlands', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'adventure_highlands.png', fullPage: true });

  await page.goto('http://localhost:3000/packages/east-coast-surf-and-sun', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'east_coast.png', fullPage: true });

  await browser.close();
  
  console.log('Screenshots captured successfully: adventure_highlands.png, east_coast.png');
})();
