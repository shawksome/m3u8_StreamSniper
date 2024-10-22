from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# Set up Chrome options to run headless
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")

# Set up Chrome browser
driver = webdriver.Chrome(options=chrome_options)

# Navigate to the given website
driver.get("https://www.shemaroome.com/all-channels/shemaroo-marathibana")

# Wait for a few seconds to ensure the page loads
driver.implicitly_wait(10)

# Close the browser
driver.quit()
