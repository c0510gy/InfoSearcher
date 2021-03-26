const encoding = 'LINEAR16';
const sampleRateHertz = 44100;
const languageCode = 'en-US';
const streamingLimit = 14000;

const toStream = require('buffer-to-stream');
const chalk = require('chalk');
const {Writable} = require('stream');

const speech = require('@google-cloud/speech').v1p1beta1;
const client = new speech.SpeechClient();
const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
};
const request = {
  config,
  interimResults: true,
};

let recognizeStream = null;
let restartCounter = 0;
let audioInput = [];
let lastAudioInput = [];
let resultEndTime = 0;
let isFinalEndTime = 0;
let finalRequestEndTime = 0;
let newStream = true;
let bridgingOffset = 0;
let lastTranscriptWasFinal = false;

let recBuffer = [];
let recBufferLength = 0;
let audiostream = null;

var e = function (n, a, e) {
  var s = e.length;
  for (var t = 0; t < s; ++t) n.setUint8(a + t, e.charCodeAt(t));
};

function startWAV(){
  var n = 2147479552,
  t = new DataView(new ArrayBuffer(44));
  e(t, 0, 'RIFF');
  t.setUint32(4, 36 + n, true);
  e(t, 8, 'WAVE');
  e(t, 12, 'fmt ');
  t.setUint32(16, 16, true);
  t.setUint16(20, 1, true);
  t.setUint16(22, 1, true);
  t.setUint32(24, 44100, true);
  t.setUint32(28, 44100 * 4, true);
  t.setUint16(32, 2, true);
  t.setUint16(34, 16, true);
  e(t, 36, 'data');
  t.setUint32(40, n, true);

  return new Uint8Array(t.buffer);
}

function startStream() {
  // Clear current audioInput
  audioInput = [];
  recBuffer = [startWAV()];
  recBufferLength = startWAV().length;

  // Initiate (Reinitiate) a recognize stream
  recognizeStream = client
    .streamingRecognize(request)
    .on('error', err => {
      if (err.code === 11) {
        //restartStream();
      } else {
        console.error('API request error ' + err);
      }
    })
    .on('data', speechCallback);

  // Restart stream when streamingLimit expires
  setTimeout(restartStream, streamingLimit);
}

const speechCallback = stream => {
  // Convert API result end time from seconds + nanoseconds to milliseconds
  resultEndTime =
    stream.results[0].resultEndTime.seconds * 1000 +
    Math.round(stream.results[0].resultEndTime.nanos / 1000000);

  // Calculate correct time based on offset from audio sent twice
  const correctedTime =
    resultEndTime - bridgingOffset + streamingLimit * restartCounter;

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  let stdoutText = '';
  if (stream.results[0] && stream.results[0].alternatives[0]) {
    stdoutText =
      correctedTime + ': ' + stream.results[0].alternatives[0].transcript;
  }

  if (stream.results[0].isFinal) {
    process.stdout.write(chalk.green(`${stdoutText}\n`));

    isFinalEndTime = resultEndTime;
    lastTranscriptWasFinal = true;
  } else {
    // Make sure transcript does not exceed console character length
    if (stdoutText.length > process.stdout.columns) {
      stdoutText =
        stdoutText.substring(0, process.stdout.columns - 4) + '...';
    }
    process.stdout.write(chalk.red(`${stdoutText}`));

    lastTranscriptWasFinal = false;
  }
};

function restartStream() {
  if (recognizeStream) {
    recognizeStream.end();
    recognizeStream.removeListener('data', speechCallback);
    recognizeStream = null;
  }
  if (resultEndTime > 0) {
    finalRequestEndTime = isFinalEndTime;
  }
  resultEndTime = 0;

  lastAudioInput = [];
  lastAudioInput = audioInput;

  restartCounter++;

  if (!lastTranscriptWasFinal) {
    process.stdout.write('\n');
  }
  process.stdout.write(
    chalk.yellow(`${streamingLimit * restartCounter}: RESTARTING REQUEST\n`)
  );

  newStream = true;

  startStream();
}

console.log('');
console.log('Listening, press Ctrl+C to stop.');
console.log('');
console.log('End (ms)       Transcript Results/Status');
console.log('=========================================================');

startStream();

var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port: 4000 });

function main(audiobuf){
  let arr = new Uint8Array(audiobuf);
  recBuffer.push(arr);
  recBufferLength += arr.length;

  if(audiostream == null && recBufferLength != 0){

    const audioInputStreamTransform = new Writable({
      write(chunk, encoding, next) {
        if (newStream && lastAudioInput.length !== 0) {
          // Approximate math to calculate time of chunks
          const chunkTime = streamingLimit / lastAudioInput.length;
          if (chunkTime !== 0) {
            if (bridgingOffset < 0) {
              bridgingOffset = 0;
            }
            if (bridgingOffset > finalRequestEndTime) {
              bridgingOffset = finalRequestEndTime;
            }
            const chunksFromMS = Math.floor(
              (finalRequestEndTime - bridgingOffset) / chunkTime
            );
            bridgingOffset = Math.floor(
              (lastAudioInput.length - chunksFromMS) * chunkTime
            );
    
            for (let i = chunksFromMS; i < lastAudioInput.length; i++) {
              recognizeStream.write(lastAudioInput[i]);
            }
          }
          newStream = false;
        }
    
        audioInput.push(chunk);
    
        if (recognizeStream) {
          recognizeStream.write(chunk);
        }
    
        next();
      },
    
      final() {
        if (recognizeStream) {
          //recognizeStream.end();
        }
        audiostream = null;
      },
    });

    const audiobuffer = Buffer.concat(recBuffer, recBufferLength);
    recBuffer = [];
    recBufferLength = 0;
    audiostream = new toStream(Buffer.from(audiobuffer));
    audiostream.pipe(audioInputStreamTransform);
  }

}

wss.on("connection", function(ws) {
  console.log('connection checked');
  ws.on("message", function(message) {
    main(message);
  });
});
