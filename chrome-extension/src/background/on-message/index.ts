import * as openSidebar from './open-sidebar';
import * as queryTabId from './query-tab-id';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('background received message: ', message);
  if (message.type === queryTabId.type) {
    queryTabId.handle(message, sender, sendResponse);
  } else if (message.type === openSidebar.type) {
    openSidebar.handle();
  }
  // https://stackoverflow.com/a/56483156/9304616
  return true;
});

console.log('background onMessage loaded');
