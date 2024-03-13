const { Readable, Writable } = require("stream");

class MyReadable extends Readable {
  constructor(max) {
    super({
      objectMode: true,
    });
    this.max = max;
    this.count = 0;
  }

  _read() {
    if (this.count < this.max) {
      this.push(this.count++);
    } else {
      this.push(null);
    }
  }
}

class MyWritable extends Writable {
  constructor() {
    super({
      objectMode: true,
    });
  }

  _write(chunk, encoding, next) {
    console.log(chunk.toString());
    next();
  }
}

const readable = new MyReadable(10);
const writable = new MyWritable();
readable.pipe(writable);