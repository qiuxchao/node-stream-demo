const { Transform } = require("stream");

const transform = new Transform({
  // 使用对象模式
  objectMode: true,
});

// 将写入的数据转换为大写
transform._transform = function (chunk, encoding, next) {
  // 不再需要 .toString()
  const res = chunk.toUpperCase();
  this.push(res);
  next();
};

transform.on("data", (data) => {
  // 不再需要 .toString()
  console.log(data);
});

transform.write("a");
transform.write("b");
transform.write("c");
transform.end();

// A
// B
// C
