import sys
import requests
from bs4 import BeautifulSoup
import re

def extract_m3u8_url(page_url):
    try:
        response = requests.get(page_url)
        response.raise_for_status()  # Check for HTTP errors

        soup = BeautifulSoup(response.content, 'html.parser')
        # Search for all URLs in the page
        urls = [a['href'] for a in soup.find_all('a', href=True)]

        # Check for m3u8 URLs in the HTML
        m3u8_urls = [url for url in urls if url.endswith('.m3u8')]

        # Also search inside JS scripts (optional, to catch dynamic cases)
        script_urls = re.findall(r'https?://[^\s"\']+\.m3u8', response.text)
        m3u8_urls.extend(script_urls)

        if m3u8_urls:
            print(f"Found m3u8 URLs:\n{', '.join(m3u8_urls)}")
        else:
            print("No m3u8 URLs found.")

    except requests.RequestException as e:
        print(f"Error fetching the page: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python fetch_m3u8.py <webpage_url>")
        sys.exit(1)

    webpage_url = sys.argv[1]
    extract_m3u8_url(webpage_url)
import sys
import requests
from bs4 import BeautifulSoup
import re

def extract_m3u8_url(page_url):
    try:
        response = requests.get(page_url)
        response.raise_for_status()  # Check for HTTP errors

        soup = BeautifulSoup(response.content, 'html.parser')
        # Search for all URLs in the page
        urls = [a['href'] for a in soup.find_all('a', href=True)]

        # Check for m3u8 URLs in the HTML
        m3u8_urls = [url for url in urls if url.endswith('.m3u8')]

        # Also search inside JS scripts (optional, to catch dynamic cases)
        script_urls = re.findall(r'https?://[^\s"\']+\.m3u8', response.text)
        m3u8_urls.extend(script_urls)

        if m3u8_urls:
            print(f"Found m3u8 URLs:\n{', '.join(m3u8_urls)}")
        else:
            print("No m3u8 URLs found.")

    except requests.RequestException as e:
        print(f"Error fetching the page: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python fetch_m3u8.py <webpage_url>")
        sys.exit(1)

    webpage_url = sys.argv[1]
    extract_m3u8_url(webpage_url)
