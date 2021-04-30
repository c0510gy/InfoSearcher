export default function textProcessing(message, sendResponse) {
  sendResponse({
    type: 'text',
    message: 200
  });

  return {
    title: message.title,
    keywords: ''
  };
}
