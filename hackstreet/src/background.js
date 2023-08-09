/* global chrome */
function getCurrentTabUrl() {
    return new Promise((resolve) => {
      let queryOptions = { active: true, lastFocusedWindow: true };
      chrome.tabs.query(queryOptions, (tabs) => {
        const tab = tabs[0];
        if (tab && tab.url) {
          resolve(tab.url);
        } else {
          resolve(null); // No active tab or URL
        }
      });
    });
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTabInfo') {
      (async () => {
        const currentTabUrl = await getCurrentTabUrl();
        if (currentTabUrl !== null) {
          console.log('Current tab URL:', currentTabUrl);
          sendResponse(currentTabUrl); // Send the URL back to the content script
        } else {
          console.log('No active tab or URL.');
        }
      })();
    }

    if (request.action === 'jumpToTimestamp') {
        // Send the request to the content script in the active tab
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab) {
            chrome.tabs.sendMessage(activeTab.id, { action: 'jumpToTimestamp', seconds: request.seconds });
          }
        });
      }
  
    // This return statement is necessary to keep the message channel open until the asynchronous operation is complete
    return true;
  });


  