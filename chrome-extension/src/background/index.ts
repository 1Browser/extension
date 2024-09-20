import 'webextension-polyfill';
import { themeStorage } from '@extension/storage';
import './on-message';

themeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");
