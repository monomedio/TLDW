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

function jumpTo(seconds){
    console.log("IM INSIDE");
    console.log(seconds)
    document.getElementsByTagName('video')[0].currentTime = seconds
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
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            console.log(activeTab)
            if (activeTab) {
                console.log("here?")
              chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                func: jumpTo,
                args: [request.seconds]
              }).then(() => console.log("?????"));
            }
            console.log("done?")
          })
      }
  
    // This return statement is necessary to keep the message channel open until the asynchronous operation is complete
    return true;
  });


  