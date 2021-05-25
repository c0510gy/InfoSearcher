import mock from './modules/mock';

function mockButtonClickedHandler() {
  chrome.runtime.sendMessage(
    {
      type: 'mock'
    },
    response => {
      console.log('response', response);
    }
  );
}

function updateCards() {
  const cardListElement = document.getElementById('cardList');
  const { backgroundGlobal } = chrome.extension.getBackgroundPage();

  cardListElement.innerHTML = '';

  if (backgroundGlobal.text) {
    const textCardField = document.createElement('div');
    textCardField.setAttribute('class', 'textContainer');
    textCardField.innerHTML = `
    <div class="textTitle">현재 글과 관련된 포스트</div>
    `;

    backgroundGlobal.text.forEach(linkInfo => {
      console.log(linkInfo);
      const textCard = document.createElement('div');
      textCard.setAttribute('class', 'textCard');
      textCard.innerHTML = `
      <div class="container">
        <h4><b>${linkInfo.title}</b></h4>
        <p><a href="${linkInfo.link}" target="_blank">See More Detail</a></p>
      </div>
      `;
      textCardField.appendChild(textCard);
    });

    cardListElement.appendChild(textCardField);
  }
  if (backgroundGlobal.image) {
    const imageCard = document.createElement('div');
    imageCard.setAttribute('class', 'card');

    imageCard.innerHTML = `
      <div class="container">
        <h4><b>${backgroundGlobal.image.title}</b></h4>
        <p>${backgroundGlobal.image.content}</p>
      </div>
    `;

    cardListElement.appendChild(imageCard);
  }
}

const initPopupScript = () => {
  document.getElementById('mockButton').addEventListener('click', function () {
    mockButtonClickedHandler();
  });
  updateCards();
  setInterval(updateCards, 2000);
};

// Fire scripts after page has loaded
document.addEventListener('DOMContentLoaded', initPopupScript);
