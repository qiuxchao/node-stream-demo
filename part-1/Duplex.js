const { Duplex } = require("stream");

const duplex = Duplex();

// 可读端底层逻辑
duplex._read = function () {
  this._readNum = this._readNum || 0;
  if (this._readNum > 1) {
    this.push(null);
  } else {
    this.push('' + this._readNum++);
  }
};

// 可写端底层逻辑
duplex._write = function (chunk, encoding, next) {
  console.log(chunk.toString());
  next();
};

// 0, 1
duplex.on("data", (data) => console.log(`ondata: ${data}`));

duplex.write('a');
duplex.write('b');
duplex.end();