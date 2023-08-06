// background.js
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed!');
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTabInfo") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        sendResponse({ tabUrl: currentTab.url });
      });
      return true; // This allows sendResponse to be called asynchronously
    }
  });