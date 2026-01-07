const domainInput = document.getElementById('domain');
const selectorInput = document.getElementById('selector');
const saveBtn = document.getElementById('save');
const cancelBtn = document.getElementById('cancel');
const listContainer = document.getElementById('rule-list');

let isEditing = false;
let originalDomain = "";

function loadRules() {
    chrome.storage.sync.get(['domainConfig'], (result) => {
        const config = result.domainConfig || {};
        listContainer.innerHTML = '';
        
        for (const [domain, selectors] of Object.entries(config)) {
            const div = document.createElement('div');
            div.className = 'rule-item';
            div.innerHTML = `
                <span><strong>${domain}</strong>: ${selectors.join(', ')}</span>
                <div>
                    <button class="edit-btn" data-domain="${domain}" data-selectors="${selectors.join(', ')}">Edit</button>
                    <button class="delete-btn" data-domain="${domain}">Delete</button>
                </div>
            `;
            listContainer.appendChild(div);
        }
    });
}

// Save or Update rule
saveBtn.onclick = () => {
    const domain = domainInput.value.trim();
    const selectorString = selectorInput.value.trim();

    if (domain && selectorString) {
        chrome.storage.sync.get(['domainConfig'], (result) => {
            let config = result.domainConfig || {};
            
            // If we are editing, remove the old domain key first 
            // (in case the domain name itself was changed)
            if (isEditing && originalDomain !== domain) {
                delete config[originalDomain];
            }

            // Convert comma-separated string back to array
            const selectorArray = selectorString.split(',').map(s => s.trim()).filter(s => s !== "");
            config[domain] = selectorArray;

            chrome.storage.sync.set({ domainConfig: config }, () => {
                resetForm();
                loadRules();
            });
        });
    }
};

// Handle Edit and Delete clicks
listContainer.onclick = (e) => {
    const domain = e.target.getAttribute('data-domain');

    if (e.target.classList.contains('delete-btn')) {
        chrome.storage.sync.get(['domainConfig'], (result) => {
            const config = result.domainConfig;
            delete config[domain];
            chrome.storage.sync.set({ domainConfig: config }, loadRules);
        });
    } 

    if (e.target.classList.contains('edit-btn')) {
        const selectors = e.target.getAttribute('data-selectors');
        enterEditMode(domain, selectors);
    }
};

function enterEditMode(domain, selectors) {
    isEditing = true;
    originalDomain = domain;
    
    domainInput.value = domain;
    selectorInput.value = selectors;
    
    saveBtn.textContent = "Update Rule";
    cancelBtn.style.display = "inline";
    domainInput.focus();
}

function resetForm() {
    isEditing = false;
    originalDomain = "";
    domainInput.value = '';
    selectorInput.value = '';
    saveBtn.textContent = "Add Rule";
    cancelBtn.style.display = "none";
}

cancelBtn.onclick = resetForm;

loadRules();