const { Duplex } = require("stream");

const duplex = new Duplex();

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
  console.log('write data: ' + chunk.toString());
  next();
};

// 0, 1
duplex.on("data", (data) => console.log(`read data: ${data}`));

duplex.write('a');
duplex.write('b');
duplex.end();