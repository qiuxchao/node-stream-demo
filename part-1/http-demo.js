const http = require("http");

const server = http.createServer((req, res) => {
  // `req` 是一个 http.IncomingMessage，它是一个可读流。
  // `res` 是一个 http.ServerResponse，它是一个可写流。

  let body = "";
  // 获取 utf8 字符串形式的数据。
  // 如果未设置编码，将接收 Buffer 对象。
  req.setEncoding("utf8");

  // 给请求对象添加 data 事件监听器。当请求数据可读时，会触发该事件
  req.on("data", (chunk) => {
    body += chunk;
  });

  // 当请求的数据全部接收完毕时，会触发该事件
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      // 向响应对象写入数据
      res.write(typeof data);
      res.end();
    } catch (er) {
      // json 解析失败
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

server.listen(1337);

// 测试
// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token 'o', "not json" is not valid JSON 
