import mock from './modules/mock';

// Data retriever
setInterval(function () {
  const html = document.documentElement.outerHTML;

  chrome.runtime.sendMessage(
    {
      type: 'mock'
    },
    response => {
      console.log('response', response);
    }
  );
}, 10000);

// Html Text Content Control
chrome.runtime.sendMessage(
  {
    type: 'text',
    html: document.cloneNode(true)
  },
  response => {
    console.log(response);
  }
);
