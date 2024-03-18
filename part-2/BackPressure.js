const { Readable, Writable } = require("stream");

const readable = new Readable({
  highWaterMark: 1,
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
  write(chunk, encoding, next) {
    // 模拟写入操作很慢，仅每秒处理1个字符
    setTimeout(() => {
      console.log(`写入${chunk}（读写流缓冲大小：${readable.readableLength} ${writeable.writableLength})`);
      next();
    }, 1000);
  },
});

writeable.on("finish", () => {
  console.log("所有数据已写入完毕");
});

// 不处理背压，会导致数据堆积在可写流的缓冲区中，占用内存
readable.on("data", (data) => {
  writeable.write(data);
});
readable.on("end", () => {
  writeable.end();
});

// 递归读写数据，自行处理背压，解决数据堆积问题
const run = () => {
  const chunk = readable.read(1);
  if (chunk !== null) {
    const canWrite = writeable.write(chunk);
    if (!canWrite) {
      // 背压 不能继续写入
      // 暂停可读流直到可写流 drain 事件触发
      readable.pause();
      writeable.once("drain", () => {
        // 可写流 写入缓冲区已清空，可继续读取可读流
        readable.resume();
        run();
      });
    }
  } else {
    writeable.end();
  }
};
// run();

// 使用 pipe 自动处理背压
// readable.pipe(writeable);
