import mock from './modules/mock';

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
  }

  return true;
});
