// Load all rules from storage
chrome.storage.sync.get(['rules'], (data) => {
  const rules = data.rules || [];

  // Find all matching rules for the current URL
  const matchingRules = rules.filter((rule) => {
    const urlPattern = new RegExp(rule.urlPattern);
    return urlPattern.test(window.location.href);
  });

  if (matchingRules.length === 0) {
    console.log('No matching rules found for this URL.');
  }

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || typeof message.action !== 'string') {
      console.warn('Invalid message received:', message);
      return;
    }

    if (message.action === 'getLinks') {
      if (matchingRules.length === 0) {
        sendResponse({ links: [] }); // Return an empty list if no rules match
        return;
      }

      const allLinks = [];

      matchingRules.forEach((rule) => {
        // 修正: エスケープされた文字を元に戻す処理を追加
        const codePattern = new RegExp(rule.codePattern.replace(/&lt;/g, '<').replace(/&gt;/g, '>'), 'g');
        const urlTemplate = rule.urlTemplate;
        console.log('URL Template:', urlTemplate);
        console.log('Code Pattern:', codePattern);

        // Extract links from the current page using the code pattern
        const matches = document.body.innerText.match(codePattern) || []; // Match all occurrences

        // Generate URLs with placeholders replaced
        const links = matches.map(match => ({
          title: rule.title,
          text: match, // Use the matched text as the link text
          url: urlTemplate.replace('{placeholder}', encodeURIComponent(match))
        }));

        allLinks.push(...links);
      });

      sendResponse({ links: allLinks });
    }

    return true; // Keep the message channel open for async response
  });
});