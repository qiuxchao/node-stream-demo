const { Readable, Transform } = require("stream");

class Style extends Readable {
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
  constructor(color: "red" | "green" | "blue" | (string & {})) {
    super({ objectMode: true });
    this.color = color || "red";
  }

  _transform(style, encoding, callback) {
    callback(null, JSON.stringify({ ...JSON.parse(style), color: this.color }));
  }
}

class TextAlign extends Transform {
  constructor(textAlign: "left" | "center" | "right") {
    super({ objectMode: true });
    this.textAlign = textAlign || "left";
  }

  _transform(style, encoding, callback) {
    callback(
      null,
      JSON.stringify({ ...JSON.parse(style), textAlign: this.textAlign })
    );
  }
}

class Background extends Transform {
  constructor(background: "blue" | "black" | "white" | (string & {})) {
    super({ objectMode: true });
    this.background = background || "left";
  }

  _transform(style, encoding, callback) {
    callback(
      null,
      JSON.stringify({ ...JSON.parse(style), background: this.background })
    );
  }
}

const style = new Style();

style
  .pipe(new Color("blue"))
  .pipe(new TextAlign("right"))
  .pipe(new Background("#f5f5f5"))
  .pipe(process.stdout);

// {"color":"blue","textAlign":"right","background":"#f5f5f5"}