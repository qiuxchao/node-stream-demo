const { Readable } = require("stream");

const readable = new Readable({
  // highWaterMark: 10,
  objectMode: true,
});

console.log(readable.readableHighWaterMark);
