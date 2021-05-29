import axios from 'axios';
import config from '../../../config';

export default async function textProcessing(message, sendResponse) {
  const { backgroundGlobal } = chrome.extension.getBackgroundPage();
  
  axios.post(`${config.backendEndPoint}/text/`, message)
    .then((response) => {
      backgroundGlobal.text = response.data.result;
      sendResponse({ type: 'text', message: 200 });
    })
    .catch((error) => {
      console.log(error);
      sendResponse({ type: 'text', message: 400 });
    })
}
