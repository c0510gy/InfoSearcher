import mock from './modules/mock';
import getTextCardList from './modules/text-processing/popup-text';

function updateCards() {
  const cardListElement = document.getElementById('cardList');
  const { backgroundGlobal } = chrome.extension.getBackgroundPage();

  cardListElement.innerHTML = '';

  if (backgroundGlobal.text) {
    cardListElement.appendChild(getTextCardList(backgroundGlobal.text));
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
  updateCards();
  setInterval(updateCards, 2000);
};

// Fire scripts after page has loaded
document.addEventListener('DOMContentLoaded', initPopupScript);
