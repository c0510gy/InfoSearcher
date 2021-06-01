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

    const labelCount = {};

    detected.forEach(label => {
      labelCount[label] = labelCount[label] ? labelCount[label] + 1 : 1;
    });
    const sortable = [];
    for (const label in labelCount) {
      sortable.push([label, labelCount[label]]);
    }
    sortable.sort(function (a, b) {
      return b[1] - a[1];
    });

    backgroundGlobal.image = {
      title: '인식된 이미지로 쇼핑하기',
      content: `가장 많이 인식된 물체는 <a href="https://search.shopping.naver.com/search/all?query=${sortable[0][0]}" target="_blank">${sortable[0][0]}</a> 입니다.`
    };

    sendResponse({ type: 'image', message: 200 });
  })();
}
