let exampleSocket = new WebSocket('ws://localhost:4000');

function encodeWAV(buffer) {
  let t = buffer[0].length,
    h = new DataView(new ArrayBuffer(t * 2)),
    o = 0;
  for (let e = 0; e < t; ++e) {
    for (let n = 0; n < 1; ++n) {
      let i = buffer[n][e] * 32767;
      h.setInt16(o, i < 0 ? Math.max(i, -32768) : Math.min(i, 32767), true);
      o += 2;
    }
  }

  return h.buffer;
}

function record(buffer, isSpeaking) {
  if (!isSpeaking) return;
  const buf = encodeWAV(buffer);
  exampleSocket.send(buf);
}

self.onmessage = function (event) {
  let data = event.data;
  switch (data.command) {
    case 'record':
      record(data.buffer, data.isSpeaking);
      break;
  }
};
