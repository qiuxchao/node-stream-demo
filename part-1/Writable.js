const { Writable } = require("stream");
const { writeFileSync, createWriteStream } = require("fs");
const { resolve } = require("path");

const writable = new Writable();

// 实现 `_write` 方法
// 这是将数据写入底层的逻辑

writable._write = function (chunk, encoding, next) {
  // 将流中的数据写入底层
  process.stdout.write(chunk.toString().toUpperCase());
  writeFileSync(
    resolve(__dirname, "./writeable-test.txt"),
    chunk.toString().toUpperCase(),
    {
      encoding: "utf8",
      // 追加模式
      flag: "a",
    }
  );
  // 写入完成时，调用 `next()` 方法通知流传入下一个数据
  process.nextTick(next);
};

// 所有数据均已写入底层
writable.on("finish", () => process.stdout.write("DONE"));

// 将一个个数据写入流中
writable.write("a" + "\n");
writable.write("b" + "\n");
writable.write("c" + "\n");

// 再无数据写入流时，调用 `end()` 方法结束流
writable.end();


// // 用 fs 的 writeStream 实现
// const writeStream = createWriteStream(
//   resolve(__dirname, "./writeStream-test.txt"),
// );

// writeStream.write("a" + "\n");
// writeStream.write("b" + "\n");
// writeStream.write("c" + "\n");

// writeStream.end();
