document.addEventListener('DOMContentLoaded', () => {
  const linkList = document.getElementById('link-list');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab?.id) {
      linkList.textContent = 'No active tab found.';
      return;
    }
    chrome.runtime.sendMessage({ action: 'getLinks', tabId: tab.id }, (response) => {
      if (!response || !response.links) {
        linkList.textContent = 'No links found.';
        return;
      }
      const groupedLinks = response.links.reduce((acc, link) => {
        const { title, text, url } = link;
        if (!acc[title]) acc[title] = [];
        acc[title].push({ text, url });
        return acc;
      }, {});
      Object.entries(groupedLinks).forEach(([title, links]) => {
        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        linkList.appendChild(titleElement);
        const ul = document.createElement('ul');
        links.forEach(({ text, url }) => {
          const listItem = document.createElement('li');
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.textContent = text;
          anchor.target = '_blank';
          listItem.appendChild(anchor);
          ul.appendChild(listItem);
        });
        linkList.appendChild(ul);
      });
    });
  });
});