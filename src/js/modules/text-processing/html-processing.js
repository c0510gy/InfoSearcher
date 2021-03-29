import { TAGS } from './items';

function removeTag(html, tagName) {
  // Function that removes useless tag with tagname
  let elements = html.getElementsByTagName(tagName);
  let l = elements.length;
  let i;
  for (i = l - 1; i >= 0; i--) {
    elements[i].parentNode.removeChild(elements[i]);
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
  let separatedContent = content.split('\n'.repeat(5));
  let longest = separatedContent.sort(function (a, b) {
    return b.length - a.length;
  })[0];
  return longest.trim();
}

export default function htmlProcessing(html) {
  // Main function of text processing
  // filter html with TAGS
  // and also filter with the space between phrases

  TAGS.forEach(function (tag) {
    html = removeTag(html, tag);
  });
  html = removeTagWithID(html, 'footer');

  let mainContent = html.body.innerText.trim();
  mainContent = filterWithSpace(mainContent);

  return mainContent;
}
