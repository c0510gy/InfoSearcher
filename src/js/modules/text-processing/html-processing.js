import { TAGS } from './items';

export default class Html2Text {
  constructor(html) {
    this.html = html;
    this.textContentProcessing();
  }

  textContentProcessing() {
    // Main function of text processing
    // filter html with TAGS
    // and also filter with the space between phrases

    TAGS.forEach(function (tag) {
      this.removeTag(tag);
    });
    this.removeTagWithID('footer');

    this.text = this.html.body.innerText.trim();
    this.filterWithSpace();
  }

  get html() {
    return this.html;
  }

  get text() {
    return this.text;
  }

  set html(newHTML) {
    // If instance get new html, set the html and process it again
    this.html = newHTML;
    this.textContentProcessing();
  }

  removeTag(tagName) {
    // Function that removes useless tag with tagname
    let elements = this.html.getElementsByTagName(tagName);
    let l = elements.length;
    let i;
    for (i = l - 1; i >= 0; i--) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }

  removeTagWithID(id) {
    // Function that removes useless tag with id
    let element = this.html.getElementById(id);
    if (element) {
      element.parentNode.removeChild(element);
    }
  }

  filterWithSpace() {
    // Function that filters the content with the space between phrases.
    this.text.replace(/[ \t]+/g, ' ').replace(/ \n+/g, '\n');
    let separatedContent = this.text.split('\n'.repeat(5));
    let longest = separatedContent.sort(function (a, b) {
      return b.length - a.length;
    })[0];

    this.text = longest.trim();
  }
}
