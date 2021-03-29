import Html2Text from './modules/text-processing/html-processing';

export function textProcessing(message, sendResponse) {
  let title = message.html.getElementsByTagName('title')[0].innerText;
  let htmlParser = new Html2Text(message.html);

  // test code
  console.log(htmlParser.html);

  sendResponse({
    type: 'text',
    message: 200
  });

  return {
    title: title,
    keywords: ''
  };
}
