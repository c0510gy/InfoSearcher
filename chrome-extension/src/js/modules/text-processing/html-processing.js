import { TAGS, NAVER_TAGS, NAVER_CLASSNAMES } from './items';

function removeTag(html, tagName) {
  // Function that removes useless tag with tagname
  let elements = html.getElementsByTagName(tagName);
  for (let idx = elements.length - 1; idx >= 0; idx--) {
    elements[idx].parentNode.removeChild(elements[idx]);
  }
  return html;
}

function removeClass(html, className) {
  // Function that removes useless tag with tagname
  let elements = html.getElementsByClassName(className);
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
  content = content.replace(/[ \t]+/g, ' ').replace(/( \n)+/g, '\n');
  let separatedContent = content.split('\n'.repeat(5));
  separatedContent = separatedContent.map(function(content) {
    return content.replace(/\n+/g, '\n');
  })

  let longest = Math.max(...(separatedContent.map(el => el.length)));
  let ret = '';
  separatedContent.forEach(function (subContent) {
    if (subContent.length >= longest * 0.2) {
      ret += '\n' + subContent;
    }
  });
  return ret.trim();
}

function naverProcessing(html) {
  html = html.getElementById('post-area');
  NAVER_TAGS.forEach(function (tag) {
    html = removeTag(html, tag);
  });
  NAVER_CLASSNAMES.forEach(function(className) {
    html = removeClass(html, className);
  });

  let mainContent = html.innerText.trim();
  mainContent = filterWithSpace(mainContent);

  return {
    type: 'text',
    title: title,
    content: mainContent
  };
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

  // Naver processing
  if (window.location.href.search('blog.naver.com') !== -1) {
    return naverProcessing(html);
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
    content: mainContent
  };
}
