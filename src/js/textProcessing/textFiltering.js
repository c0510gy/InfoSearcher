function removeTag(copy, tagName) {
  // function for removing useless tag with tagname
  let tags = copy.getElementsByTagName(tagName);
  let l = tags.length;
  let i;
  for (i = l - 1; i >= 0; i--) {
    tags[i].parentNode.removeChild(tags[i]);
  }
  return copy;
}

function removeTagWithID(copy, id) {
  // function for removing useless tag with id
  let tag = copy.getElementById(id);
  if (tag) {
    tag.parentNode.removeChild(tag);
  }
  return copy;
}

export function filterMainContent(copy) {
  // 핵심 내용에 해당하는 text를 필터링 하는 함수
  // 관련된 함수가 많이 필요할 것.

  let tags = ['a', 'code', 'script', 'style', 'noscript', 'button', 'footer'];
  tags.forEach(function (tag) {
    copy = removeTag(copy, tag);
  });
  copy = removeTagWithID(copy, 'footer');

  return copy.body.innerText;
}
