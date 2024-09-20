export const type = 'queryTabId';

export const handle = (
  message: { type: typeof type },
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: { tabId: number }) => void,
) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    sendResponse({ tabId: tabs[0].id ?? 0 });
  });
};
