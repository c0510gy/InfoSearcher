import mock from './modules/mock';
import textProcessing from './modules/text-processing/background-text';
import { Recorder } from './modules/audio-processing/recorder';

const backgroundGlobal = {};
let cntTabId = null,
  liveStream,
  audioCtx,
  mediaRecorder;

function audioCapture(tabId) {
  chrome.tabCapture.capture({ audio: true }, function (stream) {
    liveStream = stream;
    audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);

    mediaRecorder = new Recorder(source);
    mediaRecorder.startRecording(tabId);

    const audio = new Audio();
    audio.srcObject = liveStream;
    audio.play();
  });
}

function startCapture() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!cntTabId) {
      cntTabId = tabs[0].id;
      audioCapture(tabs[0].id);
    }
  });
}

function stopCapture() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const endTabId = tabs[0].id;
    if (mediaRecorder && cntTabId === endTabId) {
      mediaRecorder.finishRecording();
      audioCtx.close();
      liveStream.getAudioTracks()[0].stop();
      cntTabId = null;
    }
  });
}

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'start') {
    startCapture();
  } else if (command === 'stop') {
    stopCapture();
  }
});

// req handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type } = message;
  const {} = sender;

  switch (type) {
    case 'mock':
      sendResponse({
        message: 'mock'
      });
      break;
    case 'text':
      // the result of the process will be saved in the 'backgroundGlobal' variable
      backgroundGlobal.text = textProcessing(message, sendResponse);
      break;
  }

  return true;
});

window.backgroundGlobal = backgroundGlobal;
