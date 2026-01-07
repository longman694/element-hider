const domainSpan = document.getElementById('current-domain');
const selectorsInput = document.getElementById('selectors');
const saveBtn = document.getElementById('save-btn');
let currentDomain = "";

// 1. Get the current active tab's domain
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    currentDomain = url.hostname;
    domainSpan.textContent = currentDomain;

    // 2. Load existing selectors for this domain
    chrome.storage.sync.get(['domainConfig'], (result) => {
        const config = result.domainConfig || {};
        if (config[currentDomain]) {
            selectorsInput.value = config[currentDomain].join(', ');
        }
    });
});

// 3. Save the configuration
saveBtn.onclick = () => {
    const inputVal = selectorsInput.value.trim();
    
    chrome.storage.sync.get(['domainConfig'], (result) => {
        let config = result.domainConfig || {};
        
        if (inputVal === "") {
            delete config[currentDomain]; // Remove if empty
        } else {
            // Convert string to array, clean up whitespace
            config[currentDomain] = inputVal.split(',').map(s => s.trim()).filter(s => s !== "");
        }

        chrome.storage.sync.set({ domainConfig: config }, () => {
            saveBtn.textContent = "Saved!";
            saveBtn.style.background = "#34a853";
            
            // Reload the current tab to apply changes immediately
            chrome.tabs.reload();

            setTimeout(() => {
                window.close(); // Close popup after saving
            }, 1000);
        });
    });
};

// 4. Open the full options page
document.getElementById('open-options').onclick = (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
};