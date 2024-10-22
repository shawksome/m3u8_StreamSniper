from mitmproxy import http

# Global variable to store the m3u8 URL
latest_m3u8_url = None

def request(flow: http.HTTPFlow) -> None:
    global latest_m3u8_url
    # Check if the request contains ".m3u8"
    if ".m3u8" in flow.request.url:
        latest_m3u8_url = flow.request.url
        print(f"Captured m3u8 URL: {latest_m3u8_url}")

def response(flow: http.HTTPFlow) -> None:
    global latest_m3u8_url
    # Ensure the file is created even if no m3u8 URL is captured
    with open("latest_m3u8.txt", "w") as f:
        if latest_m3u8_url:
            f.write(latest_m3u8_url)
        else:
            f.write("No m3u8 URL found during this run.")
