const { Readable, Writable } = require("stream");

const readable = new Readable({
  // 水位线
  highWaterMark: 1,
});

readable._read = function () {
  if (this.count === undefined) {
    this.count = 0;
  } else {
    this.count++;
  }
  if (this.count < 10) {
    console.log("底层读取方法，向缓冲区中推入数据，长度为 5");
    this.push(`hello`);
  } else {
    this.push(null);
  }
};

const writable = new Writable({
  highWaterMark: 2,
  write(data, encoding, next) {
    next();
  },
});

console.log(
  "水位线：",
  readable.readableHighWaterMark,
  writable.writableHighWaterMark,
  "\n"
);

// 验证可读流缓冲区的满状态
console.log("可读流缓冲区：", readable.readableLength); // 0
const r = readable.read(1); // 读取一个字符（此时缓冲区中还剩 4 个）
console.log("读取1个字符：", r.toString());
console.log("可读流缓冲区：", readable.readableLength); // 4
const r2 = readable.read(1); // 此时再读取一个字符，将不会触发底层的 _read() 事件
console.log("读取1个字符：", r2.toString());
console.log("可读流缓冲区：", readable.readableLength); // 缓冲区中剩余 3 个字符（还是用的第一次读取时缓冲区中剩余的四个字符）
// 读取大于缓冲区长度的字符时，将会触发底层的 _read() 事件
const r3 = readable.read(3); // 读取 3 个字符时，会将缓冲区清空，导致缓冲区中的数据不满足于下一次的读取，从而会调用 _read() 事件再向缓冲区中推入一批数据
console.log("读取3个字符：", r3.toString());
console.log("可读流缓冲区：", readable.readableLength, "\n"); // 缓冲区中剩余 5 个字符，这是第二次调用底部的 _read() 方法 push 到缓冲区中的


// 验证可写流缓冲区的满状态
const w1 = writable.write("1"); // 写入一个字符（由于设置了highWaterMark=2，此时还可以继续写入）
console.log("能否继续写入：", w1); // true
const w2 = writable.write("12"); // 写入两个字符（此时缓冲区已满，无法继续写入）
console.log("能否继续写入：", w2); // false
writable.end();
