import axios from 'axios';
import config from '../../../config';

export default function imageProcessing(message, sendResponse) {
  const { backgroundGlobal } = chrome.extension.getBackgroundPage();

  (async function () {
    const detected = [];

    for (let i = 0; i < message.images.length; ++i) {
      const image = message.images[i];

      const resp = await axios.post(`${config.backendEndPoint}/image/`, {
        image: image.base64
      });

      resp.data.detected.forEach(item => detected.push(item));
    }

    console.log(detected);
    backgroundGlobal.image = detected;
    sendResponse({ type: 'image', message: 200 });
  })();
}
