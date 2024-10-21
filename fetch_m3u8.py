import sys
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def extract_m3u8_url(page_url):
    try:
        # Set up Chrome options
        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.binary_location = "/usr/bin/chromium-browser"  # Specify Chromium binary

        # Set up WebDriver
        driver = webdriver.Chrome(service=Service("/usr/bin/chromedriver"), options=chrome_options)
        driver.get(page_url)

        # Wait for a specific element to load (adjust selector as needed)
        WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        # Search for m3u8 URLs in page source
        page_source = driver.page_source
        m3u8_urls = re.findall(r'https?://[^\s"\']+\.m3u8', page_source)

        if m3u8_urls:
            print(f"Found m3u8 URLs:\n{', '.join(m3u8_urls)}")
        else:
            print("No m3u8 URLs found.")

        driver.quit()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python fetch_m3u8.py <webpage_url>")
        sys.exit(1)

    webpage_url = sys.argv[1]
    extract_m3u8_url(webpage_url)
