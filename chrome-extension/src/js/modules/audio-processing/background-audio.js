import axios from 'axios';
import config from '../../../config';

export default function audioProcessing(buffer) {
  const { backgroundGlobal } = chrome.extension.getBackgroundPage();
  
  const content = {
      "buffer": buffer.join('')
  };
  axios.post(`${config.backendEndPoint}/audio/`, content)
    .then((response) => {
      backgroundGlobal.audio = response.data.resultSearch;
    })
    .catch((error) => {
      console.log(error);
    })
}