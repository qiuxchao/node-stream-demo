const { Readable, Writable } = require("stream");

const readable = new Readable({
  // 水位线
  highWaterMark: 1,
  objectMode: true,
  read() {
    if (this.count === undefined) {
      this.count = 0;
    } else {
      this.count++;
    }
    if (this.count < 10) {
      this.push(`${this.count}${this.count}`);
    } else {
      this.push(null);
    }
  },
});

const writable = new Writable({
  highWaterMark: 1,
  objectMode: true,
  write(data, encoding, next) {
    console.log(data);
    next();
  },
});

console.log('水位线：', readable.readableHighWaterMark, writable.writableHighWaterMark);

const r1 = readable.read()
const r2 = readable.read()
console.log(r1, r2);
console.log(readable.readableLength);
