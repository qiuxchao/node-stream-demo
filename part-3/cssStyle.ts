import { Readable, Transform } from "stream";

class Style extends Readable {
  style: { [key: string]: any };

  constructor() {
    super({ objectMode: true });
    this.style = {};
  }

  _read() {
    this.push(JSON.stringify(this.style));
    this.push(null);
  }
}

type ColorType = "red" | "green" | "blue" | (string & {});

class Color extends Transform {
  color: ColorType;

  constructor(color: ColorType) {
    super({ objectMode: true });
    this.color = color || "red";
  }

  _transform(style, encoding, callback) {
    callback(null, JSON.stringify({ ...JSON.parse(style), color: this.color }));
  }
}

type TextAlignType = "left" | "center" | "right";

class TextAlign extends Transform {
  textAlign: TextAlignType;

  constructor(textAlign: TextAlignType) {
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

type BackgroundType = "blue" | "black" | "white" | (string & {});

class Background extends Transform {
  background: BackgroundType;

  constructor(background: BackgroundType) {
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
