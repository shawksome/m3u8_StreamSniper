const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the target page
  try {
    await page.goto('https://www.shemaroome.com/all-channels/shemaroo-marathibana', { waitUntil: 'networkidle2' });
  } catch (error) {
    console.error('Error navigating to page:', error);
  }

  // Wait for a few seconds to ensure all requests are completed
  await page.waitForTimeout(5000);

  // Check for .m3u8 URLs in <video> and <source> tags
  const m3u8Urls = await page.evaluate(() => {
    const urls = [];
    const videoElements = document.querySelectorAll('video, source');
    videoElements.forEach((element) => {
      if (element.src && element.src.endsWith('.m3u8')) {
        urls.push(element.src);
      }
    });
    return urls;
  });

  // If no URLs found, check the network responses
  if (m3u8Urls.length === 0) {
    // Intercept network requests
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      request.continue();
    });

    // Listen for responses
    page.on('response', async (response) => {
      const url = response.url();
      if (url.endsWith('.m3u8')) {
        m3u8Urls.push(url);
        console.log('Found .m3u8 URL in response:', url);
      }
    });

    // Wait again for responses to be captured
    await page.waitForTimeout(5000);
  }

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
