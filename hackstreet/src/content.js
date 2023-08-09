/* global chrome */

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request)
    console.log("helloooooo")
    if (request.action === 'jumpToTimestamp') {
        document.getElementById("movie_player").seekTo(request.seconds, true);
    }
  });
  