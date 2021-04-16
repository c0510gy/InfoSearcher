import { TAGS } from './items';

function removeTag(html, tagName) {
  // Function that removes useless tag with tagname
  let elements = html.getElementsByTagName(tagName);
  for (let idx = elements.length - 1; idx >= 0; idx--) {
    elements[idx].parentNode.removeChild(elements[idx]);
  }
  return html;
}

function removeTagWithID(html, id) {
  // Function that removes useless tag with id
  let element = html.getElementById(id);
  if (element) {
    element.parentNode.removeChild(element);
  }
  return html;
}

function filterWithSpace(content) {
  // Function that filters the content with the space between phrases.
  content = content.replace(/[ \t]+/g, ' ').replace(/ \n+/g, '\n');
  let separatedContent = content.split('\n'.repeat(4));
  let longest = Math.max(...(separatedContent.map(el => el.length)));
  let ret = '';
  separatedContent.forEach(function (subContent) {
    if (subContent.length >= longest * 0.2) {
      ret += subContent;
    }
  });
  return ret.trim();
}

export default function htmlProcessing(html) {
  // Main function of text processing
  // filter html with TAGS
  // and also filter with the space between phrases

  // Get title
  let title;
  if (document.head.contains(document.getElementsByTagName('title')[0])) {
    title = document.getElementsByTagName('title')[0].innerText;
  } else {
    title = '';
  }

  // Remove Tag Element
  TAGS.forEach(function (tag) {
    html = removeTag(html, tag);
  });
  html = removeTagWithID(html, 'footer');

  // Filter text
  let mainContent = html.body.innerText.trim();
  mainContent = filterWithSpace(mainContent);

  return {
    type: 'text',
    title: title,
    text: mainContent
  };
}
