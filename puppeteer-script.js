const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Intercept network requests
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.url().includes('m3u8')) {
                console.log('Captured m3u8 URL:', request.url());
            }
            request.continue();
        });

        // Navigate to the page
        await page.goto('https://www.shemaroome.com/all-channels/shemaroo-marathibana', {
            waitUntil: 'networkidle2',
        });

        // Wait for a few seconds to allow the stream to load
        await page.waitForTimeout(10000);

        await browser.close();
    } catch (error) {
        console.error('Error:', error);
    }
})();
