import { textResponse } from './textProcessing/background-text';

const backgroundGlobal = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type == 'text') {
    let ret = textResponse(message);
    sendResponse(ret);
  }
});

// Make variables accessible from chrome.extension.getBackgroundPage()
window.backgroundGlobal = backgroundGlobal;
