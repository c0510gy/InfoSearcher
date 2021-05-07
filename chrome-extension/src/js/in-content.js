import mock from './modules/mock';
import htmlProcessing from './modules/text-processing/html-processing';
import imageProcessingFromHTML from './modules/image-processing/html-processing';

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
let message = htmlProcessing(document.cloneNode(true));
chrome.runtime.sendMessage(message, response => {
  console.log(response);
});

// Html Image Content Control
(async function () {
  const imageProcessingMessage = await imageProcessingFromHTML(document);
  chrome.runtime.sendMessage(imageProcessingMessage, response => {
    console.log(response);
  });
})();
