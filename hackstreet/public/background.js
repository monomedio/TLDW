// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed.");
  });
  
  function getCurrentTabUrl(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const url = tab.url;
      callback(url);
    });
  }
  
  // Listen for messages from content scripts or other parts of your extension
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTabUrl") {
      getCurrentTabUrl((url) => {
        sendResponse({ url });
      });
    }
  });
  