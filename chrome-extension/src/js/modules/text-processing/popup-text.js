export default function getTextCardList(linkInfos) {
  const textCardField = document.createElement('div');
  textCardField.setAttribute('class', 'textContainer');
  textCardField.innerHTML = `
  <div class="textTitle">텍스트와 관련된 글</div>
  `;

  linkInfos.forEach(linkInfo => {
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

  return textCardField;
}