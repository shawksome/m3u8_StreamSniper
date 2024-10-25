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
        console.log('Navigating to the URL...');
        await page.goto('https://www.shemaroome.com/all-channels/shemaroo-marathibana', {
            waitUntil: 'networkidle2',
        });

        // Allow some time for streams to load
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds

        // Check for the network responses
        const networkResponses = await page.evaluate(() => {
            return performance.getEntriesByType('resource').map(resource => resource.name);
        });

        console.log('Network responses:');
        console.log(networkResponses);

        await browser.close();
    } catch (error) {
        console.error('Error:', error);
    }
})();
