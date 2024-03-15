const { Readable, Writable } = require("stream");

const readable = new Readable({
  objectMode: true,
  read() {
    if (this.count === undefined) {
      this.count = 0;
    }
    if (this.count < 10) {
      this.push(`${this.count++}`);
    } else {
      this.push(null);
    }
  },
});

const writeable = new Writable({
  highWaterMark: 1,
  objectMode: true,
  write(chunk, encoding, next) {
    // 模拟写入操作很慢，仅每秒处理1个字符
    setTimeout(() => {
      console.log(`写入${chunk}`);
      next();
    }, 1000);
  },
});

readable.on("readable", () => {
  const chunk = readable.read();
  writeable.write(chunk);
  // if (chunk !== null) {
    // const canWrite = writeable.write(chunk);
    // if (!canWrite) {
    //   // 背压 不能继续写入
    //   // 暂停可读流直到可写流 drain 事件触发
    //   readable.pause();
    //   writeable.once("drain", () => {
    //     // 可写流 写入缓冲区已清空，可继续读取可读流
    //     readable.resume();
    //   });
    // }
  // }
});

// 关闭可写流以捕获结尾
writeable.on("finish", () => {
  console.log("所有数据已写入完毕");
});
