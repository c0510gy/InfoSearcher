import mock from './modules/mock';
import htmlProcessing from './modules/text-processing/html-processing';

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
let mainContentText = htmlProcessing(document.cloneNode(true));
chrome.runtime.sendMessage(
  {
    type: 'text',
    title: document.getElementsByTagName('title')[0].innerText,
    text: mainContentText
  },
  response => {
    console.log(response);
  }
);
