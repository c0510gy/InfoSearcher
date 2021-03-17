function removeTag(copy, tagName) {
  let tags = copy.getElementsByTagName(tagName);
  let l = tags.length;
  let i;
  for (i = l - 1; i >= 0; i--) {
    tags[i].parentNode.removeChild(tags[i]);
  }
  return copy;
}

function filterMainContent(copy) {
  // 핵심 내용에 해당하는 text를 필터링 하는 함수
  // 관련된 함수가 많이 필요할 것.

  // test code
  return copy.body.innerText;
}

function getTitle() {
  return document.getElementsByTagName('title')[0].innerText;
}

function sendMainContent(text, title) {
  // 핵심 내용을 백엔드쪽(background.js)에 보내는 역할

  let message = {
    type: 'text',
    text: text,
    title: title
  };
  chrome.runtime.sendMessage(message, HandleSendMainContentResponse);
}

function HandleSendMainContentResponse(response) {
  // 현재 페이지의 핵심 내용을 보내고 난 뒤, 그 응답을 받았을 때,
  // 응답은 url이나 그런 정보가 될 수 있을 것.
  // 그런 정보를 띄워줘야 하니, popup.html이나 관련 메서드가 여기에 들어서야 함.

  // test code
  console.log(response);
}

function main() {
  // 현재 페이지에서 메인에 해당하는 text 를 불러오기 위한 함수
  // 현재 페이지에 접근하고, 필터 함수에 전달하고, 그 핵심 내용을 받아 다시
  // 전달하는 역할

  // test code
  let title = getTitle();
  let copy = document.cloneNode(true);
  let tags = ['a', 'code', 'script', 'style'];
  tags.forEach(function (tag) {
    copy = removeTag(copy, tag);
  });
  let mainText = filterMainContent(copy);
  console.log(title);
  console.log(mainText);
  //sendMainContent(mainText);
}

main();
