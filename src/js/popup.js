import mock from './modules/mock';

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
  document.getElementById('mockButton').addEventListener('click', function () {
    mockButtonClickedHandler();
  });
};

// Fire scripts after page has loaded
document.addEventListener('DOMContentLoaded', initPopupScript);
