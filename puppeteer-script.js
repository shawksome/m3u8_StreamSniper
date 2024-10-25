const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Set a user-agent to mimic a real browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36');

        // Intercept network requests
        await page.setRequestInterception(true);
        page.on('request', request => {
            // Continue all requests but log the m3u8 requests
            if (request.url().includes('playlist.m3u8')) {
                console.log('Captured m3u8 URL:', request.url());
            }
            request.continue();
        });

        // Navigate to the page
        console.log('Navigating to the URL...');
        await page.goto('https://www.shemaroome.com/all-channels/shemaroo-marathibana', {
            waitUntil: 'networkidle2',
        });

        // Wait to allow streams to load (15 seconds for robustness)
        await new Promise(resolve => setTimeout(resolve, 15000)); // Wait for 15 seconds

        // Check for the network responses after loading
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
