import mock from './modules';

function mockButtonClickedHandler() {
  chrome.runtime.sendMessage(
    {
      type: 'mock'
    },
    response => {
      console.log('response', response);
    }
  );
}

const initPopupScript = () => {
  document.getElementById('mcokButton').addEventListener('click', function () {
    getSavedPages();
  });
};

// Fire scripts after page has loaded
document.addEventListener('DOMContentLoaded', initPopupScript);
