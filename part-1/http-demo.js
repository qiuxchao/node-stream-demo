const http = require("http");

const server = http.createServer((req, res) => {
  // `req` 是一个 http.IncomingMessage，它是一个可读流。
  // `res` 是一个 http.ServerResponse，它是一个可写流。

  let body = "";
  // 使用可读流读取客户端的请求数据，将每次的数据拼接起来
  req.on("data", (chunk) => {
    body += chunk;
  });

  // 当请求的数据全部接收完毕时，会触发 end 事件
  req.on("end", () => {
    try {
      const data = JSON.parse(body.toString());
      // 使用可写流的方式向响应对象写入数据
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
// error: Unexpected token o in JSON at position 1
