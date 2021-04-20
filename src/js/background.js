import { Recorder } from './modules/Recorder';

let cntTabId = null,
  liveStream,
  audioCtx,
  mediaRecorder;

function encodeWavOneChannel(buffer) {
  const bufSize = buffer[0].length;
  let bufData = new DataView(new ArrayBuffer(bufSize * 2));
  for (let i = 0; i < bufSize; ++i) {
    const num = buffer[0][i] * 32767;
    bufData.setInt16(i * 2, num < 0 ? Math.max(num, -32768) : Math.min(num, 32767), true);
  }

  const buf = new Uint8Array(bufData.buffer);
  let bufStr = "";

  for (let i = 0; i < buf.byteLength; ++i) {
    let bytechar = buf[i].toString(16);
    if (bytechar.length === 1) bytechar = '0' + bytechar;
    bufStr += bytechar;
  }

  return bufStr;
}

function audioCapture(tabId) {
  chrome.tabCapture.capture({ audio: true }, function (stream) {
    liveStream = stream;
    audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);

    mediaRecorder = new Recorder(source);
    mediaRecorder.startRecording(tabId, encodeWavOneChannel);

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
