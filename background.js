chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getLinks') {
    chrome.storage.sync.get(['rules'], (data) => {
      const rules = data.rules || [];
      chrome.scripting.executeScript({
        target: { tabId: message.tabId },
        func: (rules) => {
          // ルールにマッチするものだけ抽出
          const matchingRules = rules.filter((rule) => {
            try {
              const urlPattern = new RegExp(rule.urlPattern);
              return urlPattern.test(window.location.href);
            } catch (e) {
              return false;
            }
          });
          if (matchingRules.length === 0) return { links: [] };
          const allLinks = [];
          matchingRules.forEach((rule) => {
            const codePattern = new RegExp(rule.codePattern.replace(/&lt;/g, '<').replace(/&gt;/g, '>'), 'g');
            const urlTemplate = rule.urlTemplate;
            const matches = document.body.innerText.match(codePattern) || [];
            const links = matches.map(match => ({
              title: rule.title,
              text: match,
              url: urlTemplate.replace('{placeholder}', encodeURIComponent(match))
            }));
            allLinks.push(...links);
          });
          return { links: allLinks };
        },
        args: [rules]
      }, (results) => {
        if (chrome.runtime.lastError || !results || !results[0]) {
          sendResponse({ links: [] });
          return;
        }
        sendResponse(results[0].result);
      });
    });
    return true;
  }
});
