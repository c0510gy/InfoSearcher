import mock from './modules/mock';
import htmlProcessing from './modules/text-processing/html-processing';
import imageProcessingFromHTML from './modules/image-processing/html-image-processing';

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
let message;
if (window.location.href.search('blog.naver.com') !== -1) {
  setTimeout(function () {
    let iframe = document.getElementById('mainFrame');
    message = htmlProcessing(iframe.contentDocument.cloneNode(true));
    chrome.runtime.sendMessage(message, response => {
      console.log(response);
    });
  }, 2000);
} else {
  message = htmlProcessing(document.cloneNode(true));
  chrome.runtime.sendMessage(message, response => {
    console.log(response);
  });
}

// Html Image Content Control
setTimeout(function () {
  (async function () {
    const imageProcessingMessage = await imageProcessingFromHTML(document);
    chrome.runtime.sendMessage(imageProcessingMessage, response => {
      console.log(response);
    });
  })();
}, 10000);
