/*global chrome*/

async function getCurrentTabUrl() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  
  if (tab && tab.url) {
    return tab.url;
  } else {
    return null; // No active tab or URL
  }
}

(async () => {
  const currentTabUrl = await getCurrentTabUrl();
  if (currentTabUrl !== null) {
    console.log('Current tab URL:', currentTabUrl);
    // Do something with the current tab URL
  } else {
    console.log('No active tab or URL.');
  }
})();