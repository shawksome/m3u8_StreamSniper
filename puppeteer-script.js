const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const targetUrl = process.env.TARGET_URL;  // Use environment variable for the URL

  if (!targetUrl) {
    console.error("No URL provided. Exiting script.");
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Enable request interception
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    request.continue();
  });

  const m3u8Urls = [];

  // Log network responses to capture .m3u8 URLs
  page.on('response', async (response) => {
    const url = response.url();
    if (url.endsWith('.m3u8')) {
      m3u8Urls.push(url);
      console.log('Found .m3u8 URL:', url);
    }
  });

  try {
    // Navigate to the target page
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(10000); // Increase wait time if needed
  } catch (error) {
    console.error('Error navigating to page:', error);
  }

  // Capture all network responses for debugging
  const allResponses = await page.evaluate(() => {
    return performance.getEntriesByType('resource').map((resource) => ({
      name: resource.name,
      initiatorType: resource.initiatorType,
      responseEnd: resource.responseEnd,
    }));
  });

  console.log('All network responses:', allResponses);

  // Write all responses to file for inspection
  fs.writeFileSync('network_responses.txt', JSON.stringify(allResponses, null, 2));

  // Write the captured m3u8 URLs to file
  if (m3u8Urls.length) {
    console.log('Total .m3u8 URLs found:', m3u8Urls.length);
    fs.writeFileSync('puppeteer_output.txt', m3u8Urls.join('\n'));
  } else {
    console.log('No .m3u8 URL found.');
    fs.writeFileSync('puppeteer_output.txt', 'No .m3u8 URL found.');
  }

  await browser.close();
})();
