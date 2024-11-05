
  
  // Optionally, add a command to save the current tab without opening the popup
  chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get({ websites: [] }, (result) => {
      const websites = result.websites;
      websites.push({ label: "Quick Save", title: tab.title, url: tab.url });
      chrome.storage.local.set({ websites });
      console.log(`Saved ${tab.url} with label 'Quick Save'`);
    });
  });
  