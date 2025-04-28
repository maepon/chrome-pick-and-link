document.addEventListener('DOMContentLoaded', () => {
  const linkList = document.getElementById('link-list');

  // Fetch the picked links via the background script
  chrome.runtime.sendMessage({ action: 'getLinks' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error fetching links:', chrome.runtime.lastError.message);
      linkList.textContent = 'Failed to fetch links. Please try again.';
      return;
    }

    if (response && response.links) {
      const groupedLinks = response.links.reduce((acc, link) => {
        const { title, text, url } = link;
        if (!acc[title]) {
          acc[title] = [];
        }
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
    } else {
      linkList.textContent = 'No links found.';
    }
  });
});