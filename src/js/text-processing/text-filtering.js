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
    element.parentNode.removeChild(element);
  }
  return copy;
}

function filterWithSpace(content) {
  console.log(content);

  content = content.replace(/[ \t]+/g, ' ').replace(/ \n+/g, '\n');
  let separatedContent = content.split('\n'.repeat(5));
  let longest = separatedContent.sort(function (a, b) {
    return b.length - a.length;
  })[0];
  return longest.trim();
}

export function filterMainContent(copy) {
  // 핵심 내용에 해당하는 text를 필터링 하는 함수
  // 관련된 함수가 많이 필요할 것.

  TAGS.forEach(function (tag) {
    copy = removeTag(copy, tag);
  });
  copy = removeTagWithID(copy, 'footer');

  let mainContent = copy.body.innerText.trim();
  mainContent = filterWithSpace(mainContent);

  return mainContent;
}
