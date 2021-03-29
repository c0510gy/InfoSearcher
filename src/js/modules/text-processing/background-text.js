import Html2Text from './html-processing.js';

export default function textProcessing(message, sendResponse) {
  // test code
  console.log('text : ', message.text);
  console.log('title : ', message.title);

  sendResponse({
    type: 'text',
    message: 200
  });

  return {
    title: title,
    keywords: ''
  };
}
