document.getElementById('saveBtn').addEventListener('click', saveWebsite);
document.getElementById('saveCurrentBtn').addEventListener('click', saveCurrentWebsite);

// Save website from user input
function saveWebsite() {
  const label = document.getElementById('label').value.trim();
  const title = document.getElementById('title').value.trim();
  const url = document.getElementById('url').value.trim();

  if (!label || !title || !url) {
    return alert("Please fill out all fields.");
  }

  chrome.storage.local.get({ websites: [] }, function(result) {
    const websites = result.websites;
    websites.push({ label, title, url });
    chrome.storage.local.set({ websites }, displaySavedLinks);

    document.getElementById('label').value = '';
    document.getElementById('title').value = '';
    document.getElementById('url').value = '';
  });
}

// Save current tab's website
function saveCurrentWebsite() {
  const label = prompt("Enter a label for this website:");

  if (!label) {
    return alert("Label is required.");
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const activeTab = tabs[0];
    const title = activeTab.title;
    const url = activeTab.url;

    chrome.storage.local.get({ websites: [] }, function(result) {
      const websites = result.websites;
      websites.push({ label, title, url });
      chrome.storage.local.set({ websites }, displaySavedLinks);
    });
  });
}

// Delete a website from the saved list
function deleteWebsite(index) {
  chrome.storage.local.get({ websites: [] }, function(result) {
    const websites = result.websites;
    websites.splice(index, 1); // Remove the website at the specified index
    chrome.storage.local.set({ websites }, displaySavedLinks);
  });
}

// Display saved links
function displaySavedLinks() {
  chrome.storage.local.get({ websites: [] }, function(result) {
    const savedLinksDiv = document.getElementById('savedLinks');
    savedLinksDiv.innerHTML = '';

    result.websites.forEach((item, index) => {
      const linkDiv = document.createElement('div');
      linkDiv.className = 'saved-link';
      linkDiv.innerHTML = `
        <strong>${item.label}:</strong> <a href="${item.url}" target="_blank">${item.title}</a>
        <button class="deleteBtn" data-index="${index}">Delete</button>
      `;
      savedLinksDiv.appendChild(linkDiv);
    });

    // Add event listeners for delete buttons
    const deleteButtons = savedLinksDiv.querySelectorAll('.deleteBtn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const index = event.target.getAttribute('data-index');
        deleteWebsite(index);
      });
    });
  });
}

// Load saved links when popup is opened
displaySavedLinks();
