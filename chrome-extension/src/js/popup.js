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
    const textCard = document.createElement('div');
    textCard.setAttribute('class', 'card');

    textCard.innerHTML = `
      <div class="container">
        <h4><b>${backgroundGlobal.text.title}</b></h4>
        <p>${backgroundGlobal.text.content}</p>
      </div>
    `;

    cardListElement.appendChild(textCard);
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
