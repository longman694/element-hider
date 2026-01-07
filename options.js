document.addEventListener('DOMContentLoaded', () => {
    const domainInput = document.getElementById('domain');
    const selectorInput = document.getElementById('selector');
    const saveBtn = document.getElementById('save');
    const cancelBtn = document.getElementById('cancel');
    const listContainer = document.getElementById('rule-list');

    let isEditing = false;
    let originalDomain = "";

    function renderRule(domain, selectors) {
        const ruleItem = document.createElement('div');
        ruleItem.className = 'rule-item';
        ruleItem.dataset.domain = domain;

        const textSpan = document.createElement('span');
        const strong = document.createElement('strong');
        strong.textContent = domain;
        textSpan.appendChild(strong);
        textSpan.append(`: ${selectors.join(', ')}`);

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.dataset.domain = domain;
        editBtn.dataset.selectors = selectors.join(', ');
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.domain = domain;

        buttonGroup.appendChild(editBtn);
        buttonGroup.appendChild(deleteBtn);

        ruleItem.appendChild(textSpan);
        ruleItem.appendChild(buttonGroup);

        return ruleItem;
    }

    function loadRules() {
        chrome.storage.sync.get(['domainConfig'], (result) => {
            const config = result.domainConfig || {};
            listContainer.innerHTML = '';
            
            for (const [domain, selectors] of Object.entries(config)) {
                const ruleElement = renderRule(domain, selectors);
                listContainer.appendChild(ruleElement);
            }
        });
    }

    function saveRule() {
        const domain = domainInput.value.trim();
        const selectorString = selectorInput.value.trim();

        if (!domain || !selectorString) {
            // Maybe show an error message to the user
            return;
        }

        chrome.storage.sync.get(['domainConfig'], (result) => {
            let config = result.domainConfig || {};
            
            if (isEditing && originalDomain && originalDomain !== domain) {
                delete config[originalDomain];
            }

            const selectorArray = selectorString.split(',').map(s => s.trim()).filter(Boolean);
            
            if (selectorArray.length > 0) {
                config[domain] = selectorArray;
            } else {
                // If all selectors are removed, delete the rule for that domain.
                delete config[domain];
            }


            chrome.storage.sync.set({ domainConfig: config }, () => {
                resetForm();
                loadRules();
            });
        });
    }

    function enterEditMode(domain, selectors) {
        isEditing = true;
        originalDomain = domain;
        
        domainInput.value = domain;
        selectorInput.value = selectors;
        
        saveBtn.textContent = "Update Rule";
        cancelBtn.style.display = "inline-block";
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

    function handleListClick(e) {
        const target = e.target;
        if (target.tagName !== 'BUTTON') {
            return;
        }

        const domain = target.dataset.domain;

        if (target.classList.contains('delete-btn')) {
            chrome.storage.sync.get(['domainConfig'], (result) => {
                const config = result.domainConfig;
                if (config && config[domain]) {
                    delete config[domain];
                    chrome.storage.sync.set({ domainConfig: config }, loadRules);
                }
            });
        } 

        if (target.classList.contains('edit-btn')) {
            const selectors = target.dataset.selectors;
            enterEditMode(domain, selectors);
        }
    }

    saveBtn.addEventListener('click', saveRule);
    cancelBtn.addEventListener('click', resetForm);
    listContainer.addEventListener('click', handleListClick);

    // Initial load
    loadRules();
});