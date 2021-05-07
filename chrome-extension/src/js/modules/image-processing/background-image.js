export default function imageProcessing(message, sendResponse) {
  sendResponse({
    type: 'image',
    message: 200
  });

  return {
    images: message.images
  };
}
