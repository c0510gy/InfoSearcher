import { TAGS } from './items';

function removeTag(copy, tagName) {
  // function for removing useless tag with tagname
  let elements = copy.getElementsByTagName(tagName);
  let l = elements.length;
  let i;
  for (i = l - 1; i >= 0; i--) {
    elements[i].parentNode.removeChild(elements[i]);
  }
  return copy;
}

function removeTagWithID(copy, id) {
  // function for removing useless tag with id
  let element = copy.getElementById(id);
  if (element) {
    tag.parentNode.removeChild(element);
  }
  return copy;
}

function regexWhiteSpaceAndLineBreaks(content) {
  content = content.replace(/[ \t]+/g, ' ');
  content = content.replace(/ \n+/g, '\n');
  return content;
}

export function filterMainContent(copy) {
  // 핵심 내용에 해당하는 text를 필터링 하는 함수
  // 관련된 함수가 많이 필요할 것.

  TAGS.forEach(function (tag) {
    copy = removeTag(copy, tag);
  });
  copy = removeTagWithID(copy, 'footer');

  let mainContent = copy.body.innerText.trim();
  mainContent = regexWhiteSpaceAndLineBreaks(mainContent);

  return mainContent;
}
