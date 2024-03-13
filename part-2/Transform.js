const { Transform } = require("stream");

const transform = new Transform();

// 将写入的数据转换为大写
transform._transform = function (chunk, encoding, next) {
  const res = chunk.toString().toUpperCase();
  this.push(res);
  next();
};

transform.on('data', (data) => console.log(data.toString()));

transform.write('a');
transform.write('b');
transform.write('c');
transform.end();

// A
// B
// C

