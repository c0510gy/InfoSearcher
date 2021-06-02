export default function getAudioCardList(audioInfos) {

    const linkInfos = audioInfos.resultSearch;
    const musicInfo = audioInfos.resultMusic;

    const audioCardField = document.createElement('div');
    audioCardField.setAttribute('class', 'textContainer');
    audioCardField.innerHTML = `
    <div class="textTitle">오디오와 관련된 글</div>
    `;
  
    linkInfos.forEach(linkInfo => {
      console.log(linkInfo);
      const audioCard = document.createElement('div');
      audioCard.setAttribute('class', 'textCard');
      audioCard.innerHTML = `
      <div class="container">
        <h4><b>${linkInfo.title}</b></h4>
        <p><a href="${linkInfo.link}" target="_blank">See More Detail</a></p>
      </div>
      `;
      audioCardField.appendChild(audioCard);
    });

    const musicCard = document.createElement('div');
    musicCard.setAttribute('class', textCard);
    musicCard.innerHTML = `
    <div class="container">
      <h4><b> Playing Music: ${musicInfo}</b></h4>
    </div>
    `;
    audioCardField.appendChild(musicCard);
  
    return audioCardField;
  }