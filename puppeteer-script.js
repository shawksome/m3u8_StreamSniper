const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Enable request interception
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    request.continue();
  });

  const m3u8Urls = [];

  // Log network responses
  page.on('response', async (response) => {
    const url = response.url();
    if (url.endsWith('.m3u8')) {
      m3u8Urls.push(url);
      console.log('Found .m3u8 URL:', url);
    }
  });

  try {
    // Navigate to the target page
    await page.goto('https://www.yupptv.com/channels/jai-maharashtra/live', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(10000); // Increase wait time
  } catch (error) {
    console.error('Error navigating to page:', error);
  }

  // Log all responses for debugging
  const allResponses = await page.evaluate(() => {
    return performance.getEntriesByType('resource').map((resource) => ({
      name: resource.name,
      initiatorType: resource.initiatorType,
      responseEnd: resource.responseEnd,
    }));
  });

  console.log('All network responses:', allResponses);

  // Write responses to file for inspection
  fs.writeFileSync('network_responses.txt', JSON.stringify(allResponses, null, 2));

  // Log results
  if (m3u8Urls.length) {
    console.log('Total .m3u8 URLs found:', m3u8Urls.length);
    fs.writeFileSync('puppeteer_output.txt', m3u8Urls.join('\n')); // Save to file
  } else {
    console.log('No .m3u8 URL found.');
    fs.writeFileSync('puppeteer_output.txt', 'No .m3u8 URL found.');
  }

  await browser.close();
})();
