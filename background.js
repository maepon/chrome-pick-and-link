chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message.action !== 'string') {
    console.warn('Invalid message received:', message);
    return;
  }

  if (message.action === 'getLinks') {
    // Forward the message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message to content script:', chrome.runtime.lastError.message);
            sendResponse({ error: 'Failed to communicate with content script.' });
            return;
          }
          sendResponse(response);
        });
      } else {
        sendResponse({ error: 'No active tab found.' });
      }
    });
    // Required to keep the message channel open for async response
    return true;
  }
});