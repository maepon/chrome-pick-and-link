chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getLinks') {
    // Forward the message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          sendResponse(response);
        });
      }
    });
    // Required to keep the message channel open for async response
    return true;
  }
});