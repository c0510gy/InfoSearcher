function encodeWav(buffer) {
    const bufSize = buffer[0].length;
    let bufData = new DataView(new ArrayBuffer(bufSize * 2));
    for (let i = 0; i < bufSize; ++i) {
      const num = buffer[0][i] * 32767;
      bufData.setInt16(i * 2, num < 0 ? Math.max(num, -32768) : Math.min(num, 32767), true);
    }
  
    const buf = new Uint8Array(bufData.buffer);
    let bufStr = '';
  
    for (let i = 0; i < buf.byteLength; ++i) {
      let bytechar = buf[i].toString(16);
      if (bytechar.length === 1) bytechar = '0' + bytechar;
      bufStr += bytechar;
    }
  
    return bufStr;
  }
  
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
  
    startRecording(tabId) {
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
              /*
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
              */
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
  