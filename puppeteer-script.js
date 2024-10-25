//#region Logging Detected M3U8 URLs
const detectedUrls = [];

// Function to log detected M3U8 URLs
function logDetectedM3u8(url) {
    detectedUrls.push(url);
    chrome.storage.local.set({ detectedM3u8Urls: detectedUrls }, () => {
        console.log(`Logged M3U8 URL: ${url}`);
        notifyUser(url); // Notify user about the new URL
    });
}

// Function to notify user (this can be customized for better UX)
function notifyUser(url) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png", // Path to your notification icon
        title: "M3U8 URL Detected",
        message: `New M3U8 URL: ${url}`,
        priority: 2
    });
}
//#endregion

//#region Filtering M3U8 URLs
const userDefinedDomains = ["example.com", "another-example.com"]; // Add user-defined domains here

// Check if the URL belongs to the user-defined domains
function isUrlAllowed(url) {
    return userDefinedDomains.some(domain => url.includes(domain));
}
//#endregion

// In your webRequest.onBeforeRequest listener
chrome.webRequest.onBeforeRequest.addListener(
    async function(details) {
        // Your existing logic...

        // Check if the detected URL is an M3U8 and if it is allowed
        if (snifferUtils.m3u8RegexFilter.test(requestM3u8) && isUrlAllowed(requestM3u8)) {
            logDetectedM3u8(requestM3u8); // Log the URL
            await webPageHandleM3u8(tabId, tabObj, requestM3u8); // Existing handling
        }
    },
    networkFilters
);

// Clear logged URLs (can be tied to a UI element)
function clearLoggedUrls() {
    detectedUrls.length = 0; // Clear the array
    chrome.storage.local.remove('detectedM3u8Urls', () => {
        console.log("Cleared all logged M3U8 URLs.");
    });
}
