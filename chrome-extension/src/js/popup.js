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

    textCard.innerHtml = `
      <div class="card">
        <div class="container">
          <h4><b>${backgroundGlobal.text.title}</b></h4>
          <p>${backgroundGlobal.text.content}</p>
        </div>
      </div>
    `;

    cardListElement.appendChild(textCard);
  }
  if (backgroundGlobal.image) {
    const imageCard = document.createElement('li');

    textCard.imageCard = `
      <div class="card">
        <div class="container">
          <h4><b>${backgroundGlobal.image.title}</b></h4>
          <p>${backgroundGlobal.image.content}</p>
        </div>
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
