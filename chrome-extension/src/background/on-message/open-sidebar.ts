export const type = 'openSidebar';

export const handle = async () => {
  console.debug('opening sidebar');
  chrome.tabs.query({ active: true, currentWindow: true }, response => {
    const tabId = response[0].id;
    console.debug('tabId', tabId);
    if (tabId) {
      chrome.sidePanel.open({
        tabId: tabId,
      });
    }
  });
};
