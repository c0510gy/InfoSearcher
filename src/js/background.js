import mock from './modules';

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
