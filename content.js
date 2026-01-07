// 1. Identify current domain
const currentDomain = window.location.hostname;

// 2. Fetch configuration from Chrome Storage
chrome.storage.sync.get(['domainConfig'], (result) => {
    const config = result.domainConfig;

    if (config && config[currentDomain]) {
        const selectors = config[currentDomain]; // Expecting an array of strings
        hideElements(selectors);
    }
});

function hideElements(selectors) {
    // Create a style element to inject CSS
    // Using CSS is more efficient than looping through elements with JS
    const style = document.createElement('style');
    style.innerHTML = `${selectors.join(', ')} { display: none !important; }`;
    
    // Append to the document head
    document.documentElement.appendChild(style);
}
