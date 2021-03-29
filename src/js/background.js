import mock from './modules/mock';
import textProcessing from './modules/text-processing/background-text.js';

const backgroundGlobal = {};

// req handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type } = message;
  const {} = sender;

  switch (type) {
    case 'mock':
      sendResponse({
        message: 'mock'
      });
      break;
    case 'text':
      // the result of the process will be saved in the 'backgroundGlobal' variable
      console.log(message);
      backgroundGlobal.text = textProcessing(message, sendResponse);
      break;
  }

  return true;
});

window.backgroundGlobal = backgroundGlobal;
