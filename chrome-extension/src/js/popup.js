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
    const textCard = document.createElement('li');

    textCard.innerHtml = backgroundGlobal.text.content;

    cardListElement.appendChild(textCard);
  }
  if (backgroundGlobal.image) {
    const imageCard = document.createElement('li');

    textCard.imageCard = backgroundGlobal.image.content;

    cardListElement.appendChild(imageCard);
  }
}

const initPopupScript = () => {
  document.getElementById('mockButton').addEventListener('click', function () {
    mockButtonClickedHandler();
  });
  updateCards();
};

// Fire scripts after page has loaded
document.addEventListener('DOMContentLoaded', initPopupScript);
