export class Recorder {
  constructor(source) {
    this.context = source.context;
    if (this.context.createScriptProcessor === null)
      this.context.createScriptProcessor = this.context.createJavaScriptNode;
    this.input = this.context.createGain();
    source.connect(this.input);
  }

  isRecording() {
    return this.processor != null;
  }

  startRecording(tabId, encodeWav) {
    if (!this.isRecording()) {
      const NUMCHANNELS = 1;
      let buffer = [];
      this.processor = this.context.createScriptProcessor(undefined, NUMCHANNELS, NUMCHANNELS);
      this.input.connect(this.processor);
      this.processor.connect(this.context.destination);

      this.processor.onaudioprocess = function (event) {
        for (let ch = 0; ch < NUMCHANNELS; ++ch) buffer[ch] = event.inputBuffer.getChannelData(ch);
        chrome.tabs.get(tabId, function (data) {
          if (data.audible) {
            // ToDo - data.toString()
            const data = encodeWav(buffer);
            const urls = "http://localhost:8000/stt";
            const opts = {
              method: 'POST',
              body: `{"buf": "${data}"}`,
              headers: {
                "Content-Type": "application/json"
              }
            };
            fetch(urls, opts);
          }
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
}
