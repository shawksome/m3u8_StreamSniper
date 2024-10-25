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
            // Log all requests for debugging
            console.log('Request URL:', request.url());

            // Continue all requests but log the m3u8 requests
            if (request.url().includes('.m3u8')) {
                console.log('Captured m3u8 URL:', request.url());
            }
            request.continue();
        });

        // Navigate to the page with increased timeout
        console.log('Navigating to the URL...');
        await page.goto('https://www.shemaroome.com/all-channels/shemaroo-marathibana', {
            waitUntil: 'domcontentloaded',
            timeout: 60000 // Increase timeout to 60 seconds
        });

        // Wait for the video element or any element indicating the stream is ready
        await page.waitForSelector('video', { timeout: 60000 });

        // Allow more time for dynamic loading (30 seconds)
        console.log('Waiting for additional resources to load...');
        await new Promise(resolve => setTimeout(resolve, 30000));

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
