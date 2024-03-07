const { Readable } = require("stream");
const { createReadStream } = require("fs");
const { resolve } = require("path");

// 创建可读流
class ToReadable extends Readable {
  constructor(iterator) {
    super();
    this.iterator = iterator;
  }

  // 子类需要实现该方法
  // 这是生产数据的逻辑
  _read() {
    const res = this.iterator.next();
    if (res.done) {
      // 数据源已枯竭，调用 `push(null)` 通知流
      return this.push(null);
    }
    setTimeout(() => {
      // 通过 `push` 方法将数据添加到流中（数据必须是 Buffer、String、Uint8Array 等）
      this.push(res.value + "\n");
    }, 0);
  }
}

function* generator() {
  let i = 0;
  while (i < 10) {
    yield i++;
  }
}

const iterator = generator();

const readable = new ToReadable(iterator);

// 监听`data`事件，一次获取一个数据
readable.on("data", (data) => {
  // 将数据写入到标准输出流
  process.stdout.write(data);
});

// readable.on('readable', () => {
//   const data = readable.read();
//   data && process.stdout.write(data.toString());
// })


readable.on('end', () => {
  process.stdout.write('DONE');
})

// const readStream = createReadStream(resolve(__dirname, "writeStream-test.txt"));
// readStream.pipe(process.stdout);