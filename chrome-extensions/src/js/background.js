let TabId;

class Recorder {
  constructor(source) {
    //creates audio context from the source and connects it to the worker
    this.context = source.context;
    if (this.context.createScriptProcessor == null)
      this.context.createScriptProcessor = this.context.createJavaScriptNode;
    this.input = this.context.createGain();
    source.connect(this.input);
    this.buffer = [];
    this.initWorker();
  }

  isRecording() {
    return this.processor != null;
  }

  startRecording() {
    if (!this.isRecording()) {
      let numChannels = 1;
      let buffer = this.buffer;
      let worker = this.worker;
      this.processor = this.context.createScriptProcessor(undefined, numChannels, numChannels);
      this.input.connect(this.processor);
      this.processor.connect(this.context.destination);
      this.processor.onaudioprocess = function (event) {
        for (var ch = 0; ch < numChannels; ++ch) buffer[ch] = event.inputBuffer.getChannelData(ch);
        chrome.tabs.get(TabId, data => {
          let isSpeaking = data.audible;
          worker.postMessage({ command: 'record', buffer: buffer, isSpeaking: isSpeaking });
        });
      };
    }
  }

  finishRecording() {
    if (this.isRecording()) {
      this.input.disconnect();
      this.processor.disconnect();
      delete this.processor;
    }
  }

  initWorker() {
    if (this.worker != null) this.worker.terminate();
    this.worker = new Worker('/workers/WavWorker.js');
  }
}

const audioCapture = () => {
  chrome.tabCapture.capture({ audio: true }, stream => {
    // sets up stream for capture
    let startTabId; //tab when the capture is started
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      startTabId = tabs[0].id;
      TabId = tabs[0].id;
    }); //saves start tab
    const liveStream = stream;
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    let mediaRecorder = new Recorder(source); //initiates the recorder based on the current stream
    mediaRecorder.startRecording();

    function onStopCommand(command) {
      //keypress
      if (command === 'stop') {
        stopCapture();
      }
    }
    chrome.commands.onCommand.addListener(onStopCommand);
    mediaRecorder.onComplete = () => {
      mediaRecorder = null;
    };

    const stopCapture = function () {
      let endTabId;
      //check to make sure the current tab is the tab being captured
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        endTabId = tabs[0].id;
        if (mediaRecorder && startTabId === endTabId) {
          mediaRecorder.finishRecording();
          closeStream(endTabId);
        }
      });
    };

    //removes the audio context and closes recorder to save memory
    const closeStream = function (endTabId) {
      chrome.commands.onCommand.removeListener(onStopCommand);
      audioCtx.close();
      liveStream.getAudioTracks()[0].stop();
      sessionStorage.removeItem(endTabId);
    };

    let audio = new Audio();
    audio.srcObject = liveStream;
    audio.play();
  });
};

const startCapture = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (!sessionStorage.getItem(tabs[0].id)) {
      sessionStorage.setItem(tabs[0].id, Date.now());
      audioCapture();
    }
  });
};

chrome.commands.onCommand.addListener(command => {
  if (command === 'start') {
    startCapture();
  }
});
