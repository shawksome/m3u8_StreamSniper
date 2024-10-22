from mitmproxy import http

# Global variable to store the m3u8 URL
latest_m3u8_url = None

def request(flow: http.HTTPFlow) -> None:
    global latest_m3u8_url
    # Check if the request contains ".m3u8"
    if ".m3u8" in flow.request.url:
        latest_m3u8_url = flow.request.url
        print(f"Captured m3u8 URL: {latest_m3u8_url}")
