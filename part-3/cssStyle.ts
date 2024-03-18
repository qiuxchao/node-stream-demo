const { Duplex, Transform } = require("stream");

class Style extends Duplex {
  constructor() {
    super({ objectMode: true });
    this.style = {};
  }

  _read() {
    this.push(JSON.stringify(this.style));
    this.push(null);
  }
}

class Color extends Transform {
  constructor(color: 'red' | 'green' | 'blue') {
    super({ objectMode: true });
    this.color = color || "red";
  }

  _transform(style, encoding, callback) {
    callback(null, JSON.stringify({ ...JSON.parse(style), color: this.color }));
  }
}

class TextAlign extends Transform {
  constructor(textAlign: 'left' | 'center' | 'right') {
    super({ objectMode: true });
    this.textAlign = textAlign || "left";
  }

  _transform(style, encoding, callback) {
    callback(null, JSON.stringify({ ...JSON.parse(style), textAlign: this.textAlign }));
  }
}

const style = new Style();

style.pipe(new Color('blue')).pipe(new TextAlign('right')).pipe(process.stdout);
