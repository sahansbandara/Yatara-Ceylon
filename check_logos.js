const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    // Wait for Next.js to load images
    await page.waitForTimeout(3000); 
    const isError = await page.evaluate(() => {
        const imgs = document.querySelectorAll('img');
        let errorImgs = 0;
        imgs.forEach(img => {
            if(img.src.includes('partners') && (!img.complete || img.naturalHeight === 0)) {
                console.log(`Failed to load: ${img.src}`);
                errorImgs++;
            }
        });
        return errorImgs > 0;
    });
    console.log(isError ? "Some logos failed to load" : "All logos loaded successfully");
    await browser.close();
})();
